-- Secure interactive sessions: tie chat access to the verified email on the membership.
-- Existing membership records and messages are preserved; only RPC execution is tightened.

CREATE OR REPLACE FUNCTION public.validar_acesso_chat(p_numero text)
RETURNS TABLE(numero text, nome text, validade date, valida boolean)
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
    RAISE EXCEPTION 'Confirme seu e-mail para acessar a comunidade.' USING ERRCODE = '42501';
  END IF;

  v_email_hash := encode(
    extensions.digest(convert_to(v_email, 'UTF8'), 'sha256'),
    'hex'
  );

  RETURN QUERY
  SELECT a.numero, a.nome, a.validade,
         (a.ativo AND a.validade >= CURRENT_DATE) AS valida
    FROM public.associadas AS a
   WHERE a.numero = p_numero
     AND a.email_hash = v_email_hash
     AND a.ativo
     AND a.validade >= CURRENT_DATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Carteirinha não corresponde ao e-mail autenticado ou está vencida.'
      USING ERRCODE = '42501';
  END IF;
END;
$function$;

REVOKE ALL ON FUNCTION public.validar_acesso_chat(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.validar_acesso_chat(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.postar_mensagem(p_numero text, p_sala text, p_texto text)
RETURNS TABLE(id bigint, sala_id text, autor text, texto text, criado_em timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  v_nome text;
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
    RAISE EXCEPTION 'Confirme seu e-mail para enviar mensagens.' USING ERRCODE = '42501';
  END IF;

  v_email_hash := encode(
    extensions.digest(convert_to(v_email, 'UTF8'), 'sha256'),
    'hex'
  );

  SELECT a.nome INTO v_nome
    FROM public.associadas AS a
   WHERE a.numero = p_numero
     AND a.email_hash = v_email_hash
     AND a.ativo
     AND a.validade >= CURRENT_DATE;

  IF v_nome IS NULL THEN
    RAISE EXCEPTION 'carteirinha_invalida' USING ERRCODE = '42501';
  END IF;

  IF p_texto IS NULL OR char_length(btrim(p_texto)) = 0 OR char_length(p_texto) > 500 THEN
    RAISE EXCEPTION 'texto_invalido' USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.salas AS s
     WHERE s.id = p_sala AND s.ativa
  ) THEN
    RAISE EXCEPTION 'sala_invalida' USING ERRCODE = '22023';
  END IF;

  RETURN QUERY
    INSERT INTO public.mensagens (sala_id, autor, texto)
    VALUES (p_sala, v_nome, btrim(p_texto))
    RETURNING mensagens.id, mensagens.sala_id, mensagens.autor,
              mensagens.texto, mensagens.criado_em;
END;
$function$;

REVOKE ALL ON FUNCTION public.postar_mensagem(text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.postar_mensagem(text, text, text) TO authenticated;
