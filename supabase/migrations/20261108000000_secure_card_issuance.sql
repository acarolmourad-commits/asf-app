-- Require verified Supabase Auth email ownership before issuing or renewing ASF cards.
-- No existing associadas/emissoes rows are changed by this migration.
CREATE OR REPLACE FUNCTION public.emitir_carteirinha(
  p_numero text,
  p_email_hash text,
  p_nome text,
  p_apelido text DEFAULT NULL,
  p_nivel text DEFAULT NULL,
  p_praia text DEFAULT NULL,
  p_cidade text DEFAULT NULL,
  p_insta text DEFAULT NULL
)
RETURNS TABLE(numero text, validade date, status text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  r public.associadas%ROWTYPE;
  v_base date;
  v_email text;
  v_email_confirmed_at timestamptz;
  v_email_hash text;
  v_jwt_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
BEGIN
  -- Authenticated browser sessions must prove ownership of the same confirmed email.
  -- Keep a tightly scoped server-only path for trusted service_role callers.
  IF auth.uid() IS NULL THEN
    IF v_jwt_role <> 'service_role' THEN
      RAISE EXCEPTION 'Autenticação obrigatória para emissão da carteirinha.'
        USING ERRCODE = '42501';
    END IF;

    IF p_email_hash IS NULL OR p_email_hash !~ '^[a-f0-9]{64}$' THEN
      RAISE EXCEPTION 'Identificador de e-mail inválido.'
        USING ERRCODE = '22023';
    END IF;
    v_email_hash := p_email_hash;
  ELSE
    SELECT lower(btrim(u.email)), u.email_confirmed_at
      INTO v_email, v_email_confirmed_at
      FROM auth.users AS u
     WHERE u.id = auth.uid();

    IF v_email IS NULL OR v_email_confirmed_at IS NULL THEN
      RAISE EXCEPTION 'Confirme o endereço de e-mail antes de emitir a carteirinha.'
        USING ERRCODE = '42501';
    END IF;

    v_email_hash := encode(
      extensions.digest(convert_to(v_email, 'UTF8'), 'sha256'),
      'hex'
    );

    IF p_email_hash IS DISTINCT FROM v_email_hash THEN
      RAISE EXCEPTION 'O e-mail autenticado não corresponde ao e-mail informado.'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  IF p_nome IS NULL OR length(btrim(p_nome)) < 2 THEN
    RAISE EXCEPTION 'Nome inválido.' USING ERRCODE = '22023';
  END IF;

  -- Serialize operations for the same email to avoid concurrent duplicate registrations.
  PERFORM pg_advisory_xact_lock(hashtextextended(v_email_hash, 0));

  SELECT *
    INTO r
    FROM public.associadas AS a
   WHERE a.email_hash = v_email_hash
   FOR UPDATE;

  IF FOUND THEN
    IF r.ativo AND r.validade > CURRENT_DATE + 30 THEN
      UPDATE public.associadas AS a
         SET nome = p_nome,
             apelido = p_apelido,
             nivel = p_nivel,
             praia = p_praia,
             cidade = p_cidade,
             insta = p_insta
       WHERE a.email_hash = v_email_hash;

      RETURN QUERY SELECT r.numero, r.validade, 'existente'::text;
      RETURN;
    ELSE
      v_base := GREATEST(r.validade, CURRENT_DATE);

      UPDATE public.associadas AS a
         SET validade = (v_base + INTERVAL '1 year')::date,
             renovacoes = a.renovacoes + 1,
             ativo = true,
             nome = p_nome,
             apelido = p_apelido,
             nivel = p_nivel,
             praia = p_praia,
             cidade = p_cidade,
             insta = p_insta
       WHERE a.email_hash = v_email_hash;

      INSERT INTO public.emissoes (numero, tipo)
      VALUES (r.numero, 'renovacao');

      RETURN QUERY
        SELECT r.numero, (v_base + INTERVAL '1 year')::date, 'renovada'::text;
      RETURN;
    END IF;
  END IF;

  IF p_numero IS NULL OR p_numero !~ '^ASF-[A-HJ-NP-Z2-9]{10}$' THEN
    RAISE EXCEPTION 'Número de carteirinha inválido.'
      USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.associadas
    (numero, email_hash, nome, apelido, nivel, praia, cidade, insta, validade)
  VALUES
    (p_numero, v_email_hash, p_nome, p_apelido, p_nivel, p_praia, p_cidade, p_insta,
     (CURRENT_DATE + INTERVAL '1 year')::date);

  INSERT INTO public.emissoes (numero, tipo)
  VALUES (p_numero, 'emissao');

  RETURN QUERY
    SELECT p_numero, (CURRENT_DATE + INTERVAL '1 year')::date, 'emitida'::text;
END;
$function$;

REVOKE ALL ON FUNCTION public.emitir_carteirinha(text, text, text, text, text, text, text, text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.emitir_carteirinha(text, text, text, text, text, text, text, text)
  TO authenticated, service_role;

-- Public QR validation remains available through verificar_carteirinha().
-- Existing card records, emission history, and aggregate stats are not modified.
