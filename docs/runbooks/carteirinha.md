# Carteirinha ASF — Preserve, verify, restore

Generated: 2026-10-18. Source of truth: Supabase project `qktabrzbgdfndklytwub` (`asf-galeria`).

## State verified 2026-10-18 14:29 UTC
- `public.associadas`: 54 rows, `id uuid` PK, `numero` UNIQUE, `email_hash` UNIQUE, 54 active, 0 duplicates by numero/email_hash.
- Checksum rows md5: associadas `170e7d7484fa7c542d92e7497693faaa`; emissoes `9f8bd114e7dd8ade7f82d9525809c935` (see Drive manifest).
- `public.emissoes`: 38 rows, all type `emissao`, 16 associadas with no emission row.
- RPCs `emitir_carteirinha` / `verificar_carteirinha`: present, SECURITY DEFINER. No public triggers. `public.carteirinha_eventos`: does not exist.
- RLS enabled, but anon still has direct INSERT/SELECT/UPDATE on `public.associadas` via policies with `true`. Do NOT revoke until the web client writes only via RPC.
- Web risk: `carteirinha.js` on `main` uses direct REST POST upsert on `associadas` in two paths and still contains the obsolete comment that `emitir_carteirinha` does not exist. Restore order: migrate both web paths to RPC, harden RPC to reject diverging profile fields for known email_hash, then revoke direct anon INSERT/UPDATE.

## Never delete
- A row in `associadas` may be a real issued card (numero is QR identity). Test/sonda rows remain mixed in production until an explicit classification rule is approved by the owner.
- `emissoes` is the audit trail. Do not truncate to force consistency.

## Backup
- Drive file `ASF-backup-carteirinha-20261018.zip` (private) with `carteirinha-backup-20261018.sql` + manifest. Exported 2026-10-18 14:29 UTC. SQL sha256 `2543ef8c0ee0216a6106ca2760c1d340f4079a904159b84fb6f3b39d936cad81`.
- Recheck: `md5(string_agg(md5(t::text), '' ORDER BY numero))` for associadas; `md5(string_agg(md5(t::text), '' ORDER BY id))` for emissoes.

## Verify before release
1. Count associadas/emissoes; compare manifest checksum.
2. Probe: one fixed sonda must return the same numero/status every day; a second sonda call must not create a different numero.
3. Regression gates: duplicate email_hash, inactive card, navigation `/clube/ -> /#carteirinha`, and benefit visibility not granted without valid registration.
4. Do not merge PR51, dispatch workflows, or revoke RLS as part of routine verification.

## Decisions still pending
- Explicit classification rule production vs test.
- RPC hardening and web migration before RPC-only enforcement.
- Hub #3/#5 close only after first Uptime Watch run on post-PR6 SHA; Hub #4 needs an explicit adopt-or-keep-policy decision.
