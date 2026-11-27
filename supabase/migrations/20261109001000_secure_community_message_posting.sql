-- Require the signed-in member's confirmed account to match the active ASF card.
-- This prevents a caller from impersonating another member by supplying a card number.
CREATE OR REPLACE FUNCTION public.postar_mensagem(p_numero text, p_sala text, p_texto text)
RETURNS TABLE(id bigint, sala_id text, autor text, texto text, criado_em timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  v_email text;
  v_email_confirmed_at timestamptz;
  v_nome text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Autenticação obrigatória para enviar mensagens.'
      USING ERRCODE = '42501';
  END IF;

  SELECT lower(btrim(u.email)), u.email_confirmed_at
    INTO v_email, v_email_confirmed_at
    FROM auth.users AS u
   WHERE u.id = auth.uid();

  IF v_email IS NULL OR v_email_confirmed_at IS NULL THEN
    RAISE EXCEPTION 'Confirme o e-mail da sua conta antes de enviar mensagens.'
      USING ERRCODE = '42501';
  END IF;

  SELECT a.nome
    INTO v_nome
    FROM public.associadas AS a
   WHERE a.numero = p_numero
     AND a.email_hash = encode(
       extensions.digest(convert_to(v_email, 'UTF8'), 'sha256'),
       'hex'
     )
     AND a.ativo
     AND a.validade >= CURRENT_DATE;

  IF v_nome IS NULL THEN
    RAISE EXCEPTION 'A conta autenticada não corresponde a uma carteirinha ASF ativa.'
      USING ERRCODE = '42501';
  END IF;

  IF p_texto IS NULL OR char_length(btrim(p_texto)) = 0 OR char_length(p_texto) > 500 THEN
    RAISE EXCEPTION 'Texto da mensagem inválido.'
      USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.salas AS s
     WHERE s.id = p_sala AND s.ativa
  ) THEN
    RAISE EXCEPTION 'Sala inválida.'
      USING ERRCODE = '22023';
  END IF;

  RETURN QUERY
    INSERT INTO public.mensagens (sala_id, autor, texto)
    VALUES (p_sala, v_nome, btrim(p_texto))
    RETURNING mensagens.id, mensagens.sala_id, mensagens.autor,
              mensagens.texto, mensagens.criado_em;
END;
$function$;

REVOKE ALL ON FUNCTION public.postar_mensagem(text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.postar_mensagem(text, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.postar_mensagem(text, text, text) TO authenticated;
