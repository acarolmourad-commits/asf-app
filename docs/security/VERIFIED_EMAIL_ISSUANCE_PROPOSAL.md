# ASF — proposta de emissão com e-mail verificado

Status: **PROPOSTA EM BRANCH DE SEGURANÇA — NÃO APLICADA EM PRODUÇÃO**

Branch: `security/verified-email-issuance`

## O que a auditoria confirmou

- `public.emitir_carteirinha` é `SECURITY DEFINER` e hoje tem `EXECUTE` concedido a `PUBLIC`.
- A função atual usa `p_email_hash` recebido do navegador como identificador, sem vinculá-lo a uma sessão autenticada ou a um e-mail confirmado.
- A página `emitir.html` calcula SHA-256 no navegador e chama a RPC usando somente a chave pública.
- `pgcrypto` está instalado no schema `extensions`; as tabelas mantêm índices únicos em `email_hash` e `numero`.
- RLS está habilitado em `associadas` e `emissoes`; o acesso de leitura da tabela `associadas` está limitado à conta administrativa por política autenticada.
- A tabela de associadas contém registros históricos que não devem ser migrados, apagados ou recriados.

## Objetivo

A emissão/renovação só poderá ocorrer quando:
1. houver uma sessão Supabase autenticada;
2. o usuário autenticado tiver `auth.users.email_confirmed_at IS NOT NULL`;
3. o SHA-256 do e-mail confirmado no Supabase corresponder ao hash enviado pelo formulário;
4. os dados e o número da carteirinha passarem pelas validações do servidor.

A função preserva o comportamento existente: mesma carteirinha para o mesmo hash, renovação anual, histórico em `emissoes`, e número existente mantido. A sincronização não atualiza nem apaga registros antigos.

## Pré-requisitos do frontend e do projeto

Antes de aplicar a migração:
- Confirmar no painel Supabase que **Confirm email** está habilitado. Não presumir essa configuração a partir do banco.
- Confirmar que o redirect URI da página de emissão está na allowlist de Auth.
- Implementar OTP/magic link na página de emissão com criação de usuário permitida apenas no fluxo de cadastro, captura de `access_token` após o clique no e-mail e chamada RPC com `Authorization: Bearer <access_token>`.
- Manter tokens fora de URLs persistentes e remover o fragmento da URL após capturá-los. Preferir `sessionStorage`; implementar refresh seguro.
- Não exibir nem salvar carteirinha oficial até a RPC autenticada confirmar a operação.
- Definir rate limit no Auth e monitorar falhas/reenvios.

A auditoria encontrou apenas uma conta em `auth.users`, já confirmada. Portanto, a base histórica de associadas ainda não está vinculada individualmente a contas Auth. A primeira autenticação de cada associada deve comprovar posse do mesmo e-mail usado no cadastro; não fazer vínculo automático por nome, telefone ou Instagram.

## Plano de validação obrigatório em staging

1. Criar projeto Supabase de staging isolado; nunca usar a base de produção como ambiente de teste.
2. Replicar apenas o esquema e funções necessárias, com dados sintéticos.
3. Testar: novo cadastro confirmado; OTP não confirmado; e-mail divergente; hash manipulado; sessão ausente; sessão expirada; renovação; renovação repetida; duas chamadas simultâneas; colisão de número; entradas longas/malformadas.
4. Confirmar que `anon` não executa a RPC e `authenticated` executa somente quando o e-mail da sessão está confirmado e o hash corresponde.
5. Confirmar que a verificação pública de QR continua funcionando e que a leitura administrativa permanece restrita.
6. Só então abrir revisão humana da migração de produção, com backup/export de metadados e plano de rollback fail-closed.

## Critérios para produção

- Não aplicar até frontend, allowlist de redirect, confirmação de e-mail e staging estarem validados.
- Não chamar a RPC de emissão real durante testes.
- Não alterar, excluir, renumerar ou reemitir os cadastros existentes.
- A migração SQL proposta está em `VERIFIED_EMAIL_ISSUANCE_PROPOSED.sql` e é apenas um artefato de revisão; não está em `supabase/migrations` e não foi executada.

## Rollback seguro

O rollback emergencial recomendado é **fail-closed**: revogar EXECUTE de `authenticated` e manter revogado para `PUBLIC`/`anon`, interrompendo novas emissões até corrigir o frontend. Não restaurar a concessão pública antiga, pois ela reabre a vulnerabilidade.

## Limitações desta etapa

Esta branch contém proposta e SQL para revisão. Nenhuma alteração foi aplicada ao Supabase de produção, nenhum cadastro foi lido individualmente ou modificado e nenhum fluxo de emissão foi testado contra associadas reais.
