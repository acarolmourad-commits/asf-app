-- Make the public mural ranking view respect the caller's privileges and RLS.
-- Existing anon SELECT grants and permissive public read policies on both base
-- tables are retained, so the public leaderboard contract remains unchanged.
ALTER VIEW public.mural_top3 SET (security_invoker = true);
