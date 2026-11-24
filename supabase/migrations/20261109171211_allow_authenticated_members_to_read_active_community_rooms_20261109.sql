-- Allow both visitors and authenticated members to discover active community rooms.
-- Message history remains protected by its separate authenticated-member RLS policy.
alter policy salas_read
on public.salas
to anon, authenticated
using (true);
