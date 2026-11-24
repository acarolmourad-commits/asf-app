-- Keep the RLS membership helper outside the exposed PostgREST schema.
CREATE SCHEMA IF NOT EXISTS private AUTHORIZATION postgres;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.chat_associada_ativa()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  v_email text;
  v_confirmed_at timestamptz;
  v_email_hash text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  SELECT lower(btrim(u.email)), u.email_confirmed_at
    INTO v_email, v_confirmed_at
    FROM auth.users AS u
   WHERE u.id = auth.uid();

  IF v_email IS NULL OR v_confirmed_at IS NULL THEN
    RETURN false;
  END IF;

  v_email_hash := encode(
    extensions.digest(convert_to(v_email, 'UTF8'), 'sha256'),
    'hex'
  );

  RETURN EXISTS (
    SELECT 1
      FROM public.associadas AS a
     WHERE a.email_hash = v_email_hash
       AND a.ativo
       AND a.validade >= CURRENT_DATE
  );
END;
$function$;

REVOKE ALL ON FUNCTION private.chat_associada_ativa() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.chat_associada_ativa() TO authenticated;

DROP POLICY IF EXISTS mensagens_read_authenticated ON public.mensagens;
CREATE POLICY mensagens_read_authenticated
  ON public.mensagens
  FOR SELECT
  TO authenticated
  USING (private.chat_associada_ativa());

DROP FUNCTION IF EXISTS public.chat_associada_ativa();
