-- Harden SECURITY DEFINER RPCs against search_path object shadowing.
-- This changes function configuration only; function bodies, grants, and data remain unchanged.
ALTER FUNCTION public.emitir_carteirinha(text, text, text, text, text, text, text, text)
  SET search_path = pg_catalog, public;

ALTER FUNCTION public.postar_mensagem(text, text, text)
  SET search_path = pg_catalog, public;

ALTER FUNCTION public.verificar_carteirinha(text)
  SET search_path = pg_catalog, public;
