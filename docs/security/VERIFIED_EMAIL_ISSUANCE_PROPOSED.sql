-- ASF: PROPOSTA DE MIGRACAO — NAO EXECUTAR EM PRODUCAO AINDA
-- Depende do frontend OTP/magic-link, confirmação de e-mail habilitada,
-- redirect URI autorizado e testes completos em projeto Supabase de staging.
-- Preserva os registros atuais; altera apenas a definição e ACL da RPC.

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
SET search_path = ''
AS $function$
DECLARE
  v_email text;
  v_expected_hash text;
  r public.associadas%ROWTYPE;
  v_base date;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'authentication required' USING ERRCODE = '28000';
  END IF;

  SELECT pg_catalog.lower(pg_catalog.btrim(u.email))
    INTO v_email
    FROM auth.users AS u
   WHERE u.id = auth.uid()
     AND u.email_confirmed_at IS NOT NULL;

  IF v_email IS NULL THEN
    RAISE EXCEPTION 'verified email required' USING ERRCODE = '28000';
  END IF;

  v_expected_hash := pg_catalog.encode(
    extensions.digest(pg_catalog.convert_to(v_email, 'UTF8'), 'sha256'),
    'hex'
  );

  IF p_email_hash IS NULL
     OR p_email_hash !~ '^[0-9a-f]{64}$'
     OR p_email_hash <> v_expected_hash THEN
    RAISE EXCEPTION 'authenticated email does not match membership email'
      USING ERRCODE = '42501';
  END IF;

  IF p_numero IS NULL OR p_numero !~ '^ASF-[A-Z0-9]{6,12}$' THEN
    RAISE EXCEPTION 'invalid membership number' USING ERRCODE = '22023';
  END IF;

  IF p_nome IS NULL OR pg_catalog.char_length(pg_catalog.btrim(p_nome)) NOT BETWEEN 2 AND 120 THEN
    RAISE EXCEPTION 'invalid member name' USING ERRCODE = '22023';
  END IF;

  IF (p_apelido IS NOT NULL AND pg_catalog.char_length(p_apelido) > 80)
     OR (p_nivel IS NOT NULL AND pg_catalog.char_length(p_nivel) > 40)
     OR (p_praia IS NOT NULL AND pg_catalog.char_length(p_praia) > 120)
     OR (p_cidade IS NOT NULL AND pg_catalog.char_length(p_cidade) > 120)
     OR (p_insta IS NOT NULL AND pg_catalog.char_length(p_insta) > 80) THEN
    RAISE EXCEPTION 'member field exceeds allowed length' USING ERRCODE = '22023';
  END IF;

  -- Serializa operações concorrentes para o mesmo e-mail verificado.
  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_expected_hash, 0)
  );

  SELECT *
    INTO r
    FROM public.associadas AS a
   WHERE a.email_hash = v_expected_hash
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
       WHERE a.email_hash = v_expected_hash;

      RETURN QUERY SELECT r.numero, r.validade, 'existente'::text;
      RETURN;
    END IF;

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
     WHERE a.email_hash = v_expected_hash;

    INSERT INTO public.emissoes (numero, tipo)
    VALUES (r.numero, 'renovacao');

    RETURN QUERY
      SELECT r.numero, (v_base + INTERVAL '1 year')::date, 'renovada'::text;
    RETURN;
  END IF;

  INSERT INTO public.associadas (
    numero, email_hash, nome, apelido, nivel, praia, cidade, insta, validade
  )
  VALUES (
    p_numero, v_expected_hash, p_nome, p_apelido, p_nivel,
    p_praia, p_cidade, p_insta, (CURRENT_DATE + INTERVAL '1 year')::date
  );

  INSERT INTO public.emissoes (numero, tipo)
  VALUES (p_numero, 'emissao');

  RETURN QUERY
    SELECT p_numero, (CURRENT_DATE + INTERVAL '1 year')::date, 'emitida'::text;
END;
$function$;

-- Fechar o endpoint público e permitir chamada apenas por sessões autenticadas.
REVOKE ALL ON FUNCTION public.emitir_carteirinha(
  text, text, text, text, text, text, text, text
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.emitir_carteirinha(
  text, text, text, text, text, text, text, text
) TO authenticated;

-- Não alterar as permissões de verificar_carteirinha nem carteirinhas_stats aqui.
