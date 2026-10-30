# ASF — proposta de emissão com e-mail verificado

Status: **PROPOSTA EM BRANCH DE SEGURANÇA — NÃO APLICADA EM PRODUÇÃO**

Branch: `security/verified-email-issuance`

## O que a auditoria confirmou

- `public.emitir_carteirinha` é `SECURITY DEFINER` e hoje tem `EXECUTE` concedido a `PUBLIC`.
- A função atual usa `p_email_hash` recebido do navegador como identificador, sem vinculá-lo a uma sessão autenticada ou a um e-mail confirmado.
- A página `emitir.html` calcula SHA-256 no navegador e chama a RPC usando somente a chave pública.
- `pgcrypto` está instalado no schema `extensions`; as tabelas mantêm índices únicos em `email_hash` e `numero`.
- RLS está habilitado em `associadas` e `emissoes`; a leitura da tabela `associadas` está limitada à conta administrativa por política autenticada.
- A tabela de associadas contém registros históricos que não devem ser migrados, apagados ou recriados.

## Configuração Auth observada (somente leitura)

- Login por e-mail habilitado.
- Confirmação automática de cadastro desabilitada.
- Login com e-mail não verificado desabilitado.
- Allowlist atual contém apenas as páginas administrativas de carteirinhas nos dois domínios ASF/GitHub Pages; **`emitir.html` ainda não está autorizada como callback**.
- SMTP próprio não está configurado no projeto. A entrega de e-mails de produção precisa ser validada antes de liberar o fluxo; não presumir capacidade de envio ou entregabilidade.
- Há uma conta em `auth.users`, com e-mail confirmado. O cadastro histórico de associadas ainda não está vinculado individualmente a contas Auth.

## Objetivo

A emissão/renovação só poderá ocorrer quando:
1. houver uma sessão Supabase autenticada;
2. o usuário autenticado tiver `auth.users.email_confirmed_at IS NOT NULL`;
3. o SHA-256 do e-mail confirmado no Supabase corresponder ao hash enviado pelo formulário;
4. os dados e o número da carteirinha passarem pelas validações do servidor.

A função preserva o comportamento existente: mesma carteirinha para o mesmo hash, renovação anual, histórico em `emissoes`, e número existente mantido. A sincronização não atualiza nem apaga registros antigos.

## Pré-requisitos do frontend e do projeto

Antes de aplicar a migração:
- Validar a entrega de e-mails no ambiente de staging e definir SMTP transacional confiável para produção, com domínio autenticado, SPF/DKIM/DMARC conforme o provedor.
- Adicionar à allowlist, após revisão, os callbacks exatos de `emitir.html` nos domínios efetivamente usados. Não usar wildcard amplo.
- Implementar OTP/magic link na página de emissão com criação de usuário permitida apenas no fluxo de cadastro, captura de `access_token` após o clique no e-mail e chamada RPC com `Authorization: Bearer <access_token>`.
- Manter confirmação de e-mail obrigatória; a configuração observada já desabilita autoconfirmação e logins não verificados.
- Remover o fragmento de token da URL após capturá-lo. Preferir `sessionStorage`, implementar refresh seguro e logout/limpeza de sessão.
- Não exibir nem salvar carteirinha oficial até a RPC autenticada confirmar a operação.
- Respeitar os limites atuais de envio/OTP e implementar UX de reenvio com espera; não contornar rate limits.

A primeira autenticação de cada associada deve comprovar posse do mesmo e-mail usado no cadastro; não fazer vínculo automático por nome, telefone ou Instagram. A criação de conta Auth não deve alterar por si só os registros da tabela de associadas.

## Plano de validação obrigatório em staging

1. Criar projeto Supabase de staging isolado; nunca usar a base de produção como ambiente de teste.
2. Replicar apenas o esquema e funções necessárias, com dados sintéticos.
3. Configurar SMTP de teste e callback restrito ao host de staging.
4. Testar: novo cadastro confirmado; OTP não confirmado; e-mail divergente; hash manipulado; sessão ausente; sessão expirada; renovação; renovação repetida; duas chamadas simultâneas; colisão de número; entradas longas/malformadas.
5. Confirmar que `anon` não executa a RPC e `authenticated` executa somente quando o e-mail da sessão está confirmado e o hash corresponde.
6. Confirmar que a verificação pública de QR continua funcionando e que a leitura administrativa permanece restrita.
7. Só então abrir revisão humana da migração de produção, com backup/export de metadados e plano de rollback.

## Critérios para produção

- Não aplicar até frontend, SMTP, allowlist de redirect, confirmação de e-mail e staging estarem validados.
- Não chamar a RPC de emissão real durante testes.
- Não alterar, excluir, renumerar ou reemitir os cadastros existentes.
- A migração SQL proposta está em `VERIFIED_EMAIL_ISSUANCE_PROPOSED.sql` e é apenas um artefato de revisão; não está em `supabase/migrations` e não foi executada.

## Rollback seguro

O rollback emergencial recomendado é **fail-closed**: revogar EXECUTE de `authenticated` e manter revogado para `PUBLIC`/`anon`, interrompendo novas emissões até corrigir o frontend. Não restaurar a concessão pública antiga, pois ela reabre a vulnerabilidade.

## Limitações desta etapa

Esta branch contém proposta e SQL para revisão. Nenhuma alteração foi aplicada ao Supabase de produção, nenhum cadastro individual foi modificado e nenhum fluxo de emissão foi testado contra associadas reais.
