-- Recover an existing ASF card only after the authenticated user proves ownership
-- of the email address stored as the membership's SHA-256 hash.
-- Read-only: this function never inserts, updates, renews, or changes card data.

CREATE OR REPLACE FUNCTION public.recuperar_carteirinha()
RETURNS TABLE(
  numero text,
  nome text,
  apelido text,
  nivel text,
  praia text,
  cidade text,
  validade date,
  ativo boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  v_email text;
  v_confirmed_at timestamptz;
  v_email_hash text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Autenticação obrigatória.' USING ERRCODE = '42501';
  END IF;

  SELECT lower(btrim(u.email)), u.email_confirmed_at
    INTO v_email, v_confirmed_at
    FROM auth.users AS u
   WHERE u.id = auth.uid();

  IF v_email IS NULL OR v_confirmed_at IS NULL THEN
    RAISE EXCEPTION 'Confirme seu e-mail para recuperar a carteirinha.'
      USING ERRCODE = '42501';
  END IF;

  v_email_hash := encode(
    extensions.digest(convert_to(v_email, 'UTF8'), 'sha256'),
    'hex'
  );

  RETURN QUERY
    SELECT a.numero, a.nome, a.apelido, a.nivel, a.praia, a.cidade,
           a.validade, a.ativo
      FROM public.associadas AS a
     WHERE a.email_hash = v_email_hash
     ORDER BY a.validade DESC
     LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Nenhuma carteirinha foi localizada para o e-mail autenticado.'
      USING ERRCODE = 'P0002';
  END IF;
END;
$function$;

REVOKE ALL ON FUNCTION public.recuperar_carteirinha() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.recuperar_carteirinha() TO authenticated;
