# Segurança do envio de mensagens da comunidade ASF

## Diagnóstico (2026-11-09)

A função `public.postar_mensagem(text,text,text)` era executável por `anon` e identificava o autor apenas pelo número de carteirinha informado pelo cliente. Isso permitia tentativa de personificação por quem conhecesse um número válido.

A página atual do repositório `asf-comunidade` é editorial e não contém fluxo de mensagens. A busca nos repositórios ASF consultados não localizou consumidores do RPC. A tabela `public.mensagens` tinha 1 registro, com última mensagem em 2026-10-11. Esses sinais reduzem o risco de interromper um fluxo ativo, mas não provam ausência de clientes externos.

## Correção proposta

A migration `20261109001000_secure_community_message_posting.sql`:
- exige sessão Supabase autenticada;
- exige e-mail confirmado;
- calcula o SHA-256 do e-mail autenticado, normalizado em minúsculas;
- exige correspondência com `associadas.email_hash`, número informado, associação ativa e validade vigente;
- deriva o nome do autor exclusivamente do cadastro;
- mantém validação de sala e limite de 500 caracteres;
- revoga execução de `anon` e `PUBLIC`, concedendo-a a `authenticated`.

## Compatibilidade / implantação

Antes de publicar uma interface de envio, ela deve usar Supabase Auth (Magic Link) com o mesmo e-mail cadastrado na associação e chamar o RPC somente depois da confirmação da sessão. A leitura pública das mensagens e salas não é alterada.

A migration deve ser aplicada após revisão do PR e teste de integração com:
1. associada autenticada e e-mail confirmado: envio permitido;
2. associada com outro e-mail autenticado: negado;
3. sessão ausente/anon: negado;
4. carteirinha inativa ou vencida: negado;
5. sala inativa ou texto inválido: negado.

Nenhuma mensagem existente é apagada ou modificada por esta migration.
