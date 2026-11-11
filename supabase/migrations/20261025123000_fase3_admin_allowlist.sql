-- ASF Fase 3 (2026-10-25) — Admin allowlist + leitura admin de associadas
-- ADITIVO E REVERSIVEL: NAO remove a policy publica 'Anonymous can read assoc'.
-- NAO fechar o SELECT publico nesta migration. Cutover e etapa separada.
-- Rollback: ver docs/fase3-admin-carteirinhas-runbook.md

create table if not exists public.admin_allowlist (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  note text
);

alter table public.admin_allowlist enable row level security;

revoke all on table public.admin_allowlist from anon;
grant select on table public.admin_allowlist to authenticated;

drop policy if exists admin_allowlist_self_select on public.admin_allowlist;
create policy admin_allowlist_self_select
  on public.admin_allowlist
  for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_asf_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_allowlist where user_id = auth.uid()
  );
$$;

revoke all on function public.is_asf_admin() from public;
grant execute on function public.is_asf_admin() to authenticated;

grant select on table public.associadas to authenticated;

drop policy if exists associadas_admin_select on public.associadas;
create policy associadas_admin_select
  on public.associadas
  for select
  to authenticated
  using (public.is_asf_admin());

-- Cadastro do primeiro admin (executar manualmente apos o primeiro login):
-- insert into public.admin_allowlist (user_id, note)
-- select id, 'ASF admin — asf.surffeminino@gmail.com'
-- from auth.users where email = 'asf.surffeminino@gmail.com'
-- on conflict (user_id) do nothing;
