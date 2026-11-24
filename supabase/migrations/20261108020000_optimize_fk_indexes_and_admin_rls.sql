-- Improve foreign-key lookup performance and avoid per-row JWT evaluation in RLS.
-- These indexes are additive and do not change application data or access rules.
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments (post_id);
CREATE INDEX IF NOT EXISTS emissoes_numero_idx ON public.emissoes (numero);
CREATE INDEX IF NOT EXISTS mensagens_sala_id_idx ON public.mensagens (sala_id);
CREATE INDEX IF NOT EXISTS mural_votos_foto_id_idx ON public.mural_votos (foto_id);

-- Preserve the existing admin-only predicate while evaluating JWT claims once per statement.
DROP POLICY IF EXISTS "Admin can read associadas" ON public.associadas;
CREATE POLICY "Admin can read associadas"
ON public.associadas
FOR SELECT
TO authenticated
USING ((SELECT auth.jwt() ->> 'email') = 'asf.surffeminino@gmail.com');
