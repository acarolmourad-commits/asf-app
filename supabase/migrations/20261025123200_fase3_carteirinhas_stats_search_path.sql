-- ASF Fase 3 (2026-10-25) — search_path fixo em carteirinhas_stats
-- Apenas fixa o search_path. Grants da funcao devem ser validados em teste
-- antes de qualquer REVOKE, para nao quebrar quem consome as estatisticas.

alter function public.carteirinhas_stats() set search_path = public;

-- Rollback:
-- alter function public.carteirinhas_stats() reset search_path;
