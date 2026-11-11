# ASF — Fase 3: Painel Admin de Carteirinhas (runbook)

Status: implementado em branch `security/fase3-admin-carteirinhas-20261025`, sem merge, sem aplicar migrations no banco de produção e sem fechar o SELECT público.

## Arquivos desta branch
- `admin-carteirinhas.html` — painel somente-leitura com Supabase Auth (magic link) + allowlist.
- `supabase/migrations/20261025123000_fase3_admin_allowlist.sql` — tabela `admin_allowlist`, função `is_asf_admin()`, policy `associadas_admin_select` (aditiva).
- `supabase/migrations/20261025123100_fase3_mural_top3_security_invoker.sql` — trilha separada do Mural.
- `supabase/migrations/20261025123200_fase3_carteirinhas_stats_search_path.sql` — fixa `search_path` de `carteirinhas_stats()`.

## O que esta branch NÃO faz
- Não remove `Anonymous can read assoc` (SELECT público continua aberto de propósito).
- Não altera `emitir.html`, `carteirinha.js`, `verificar.html` nem o workflow `verifica-carteirinha.yml` (continua `disabled_manually`).
- Não cria usuário Auth, não desliga signup e não muda Auth config de produção.
- Não usa `service_role` no navegador. Só a chave publishable, como nos demais arquivos públicos.

## Preservação antes de qualquer aplicação
1. No Supabase Dashboard do projeto `asf-galeria`, exportar `public.associadas` em local privado da ASF (nunca no GitHub) e conferir: 55 linhas em 25/10/2026 (54 ativas, 1 SONDA), `emissoes` com 38 linhas.
2. Guardar também a definição atual das policies/functions (schema-only) junto do backup privado.
3. Só aplicar migration depois de conferir o backup.

## Ordem segura de ativação (etapas futuras, cada uma com confirmação)
1. Aplicar primeiro a migration `20261025123000` em ambiente de teste/branch do Supabase, se disponível; senão, revisar o SQL linha a linha antes de aplicar em produção.
2. Em Auth, adicionar as URLs do painel em Redirect URLs: `https://asf.surf/admin-carteirinhas.html` e `https://acarolmourad-commits.github.io/asf-app/admin-carteirinhas.html`.
3. Fazer o primeiro login no painel com `asf.surffeminino@gmail.com` (magic link cria o usuário Auth).
4. No SQL Editor, cadastrar o admin com o INSERT comentado no fim da migration `20261025123000`.
5. Abrir o painel já logada e validar: lista paginada, busca, estatísticas, logout. Testar também com um e-mail não-admin: deve ser negado e deslogado.
6. Só depois disso, em mudança separada: desligar signup público (`disable_signup=true`) mantendo o login do admin já criado.
7. Migrar `emitir.html` do POST direto em `associadas` para a RPC `emitir_carteirinha` (mesmo contrato usado por `carteirinha.js`), em PR próprio, testando com a SONDA sem duplicar registros.
8. Cutover do SELECT (PR + migration separados, com confirmação expressa): remover a policy `Anonymous can read assoc` e revogar SELECT de `anon` em `associadas`.
9. Aplicar as migrations do Mural/stats em janela separada e testar Top 3 público e estatísticas.
10. Reativar `verifica-carteirinha.yml` somente após o cutover validado, com confirmação separada.

## Testes de aceite do cutover (quando ele for autorizado)
- Anon (sem login): `GET /rest/v1/associadas` deve retornar vazio/negado.
- Admin logado e allowlistado: painel lista as carteirinhas.
- E-mail logado fora da allowlist: painel nega e encerra a sessão.
- RPC `emitir_carteirinha` com a SONDA: mantém o mesmo número, sem novo registro.
- RPC `verificar_carteirinha`: continua retornando apenas nível, validade e status.
- Mural público e Top 3: continuam carregando.
- Contagens conferem com o snapshot: associadas/emissões sem perda.

## Rollback do cutover
Se algo falhar após remover a policy pública, recriar temporariamente:

```sql
create policy "Anonymous can read assoc"
  on public.associadas
  for select
  to public
  using (true);
```

Registrar o rollback no checkpoint e investigar antes de tentar novamente. Para as migrations aditivas desta branch, o rollback é remover a policy `associadas_admin_select`, a função `is_asf_admin()` e a tabela `admin_allowlist`, nessa ordem, somente se o painel for abandonado.
