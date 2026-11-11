-- ASF Fase 3 (2026-10-25) — mural_top3 com SECURITY INVOKER
-- Trilha independente. NAO aplicar junto do cutover de carteirinhas sem testar o Top 3.
-- Requer PostgreSQL 15+ (projeto em PG17).

alter view public.mural_top3 set (security_invoker = true);

-- Rollback:
-- alter view public.mural_top3 set (security_invoker = false);
