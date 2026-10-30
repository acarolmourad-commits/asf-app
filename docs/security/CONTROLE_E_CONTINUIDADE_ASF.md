# ASF — controle, continuidade e emissão segura (plano gratuito)

Status: **PLANO TÉCNICO — NÃO APLICADO EM PRODUÇÃO**
Branch: `security/verified-email-issuance`

## Objetivo operacional

Preservar a experiência simples de emissão da ASF: a associada preenche o formulário, confirma o e-mail e recebe a carteirinha. O código, as regras e os testes ficam versionados no GitHub; o Supabase continua sendo a fonte oficial dos registros; os serviços Google já conectados podem fornecer o envio de e-mail e cópias de segurança, desde que a conta e as permissões sejam confirmadas.

Nenhum cadastro existente deve ser apagado, renumerado, recriado ou migrado para Auth.

## Auditoria somente leitura realizada

- A página `emitir.html` chama diretamente a RPC `public.emitir_carteirinha` com a chave pública e um SHA-256 calculado no navegador.
- A RPC é `SECURITY DEFINER` e possui EXECUTE para `PUBLIC`, `anon` e `authenticated`. O hash recebido não comprova posse do e-mail.
- A função atual pode atualizar os dados de um registro existente e renovar a validade usando apenas esse hash.
- A tabela `associadas` tem os campos atuais de cadastro, validade, renovações e ativo; não possui um campo de aprovação pendente.
- A tabela `emissoes` registra número, tipo, data e hash de IP.
- O login por e-mail está habilitado, a confirmação automática está desabilitada e logins sem e-mail confirmado estão bloqueados.
- O SMTP próprio não está configurado. O SMTP padrão do Supabase aceita apenas endereços autorizados da equipe e está limitado a 2 mensagens por hora, sem garantia de entrega.
- O callback público `emitir.html` ainda não está na allowlist de redirects.
- Foram encontrados 67 branches no repositório e nenhum branch protegido. A branch `main` também não aparece protegida.
- As buscas somente leitura no Drive e no Sheets conectados não localizaram uma planilha de registro ASF. O registro oficial identificado continua sendo o Supabase.

## Arquitetura recomendada sem mensalidade

### 1. GitHub — fonte de controle

- Código-fonte, SQL versionado, testes, documentação, histórico de mudanças e deploy do site.
- Todo ajuste de banco começa como migration revisável na branch de segurança.
- A branch `main` deve passar a exigir Pull Request, bloquear force-push e exclusão; checks obrigatórios só devem ser definidos depois de identificar os checks estáveis.
- Não armazenar dados pessoais em repositório público, nem em arquivos de workflow, logs ou artefatos abertos.

### 2. Supabase — fonte oficial dos registros

- Manter `associadas` e `emissoes` como fonte oficial; não duplicar a base em planilha.
- Manter RLS e leitura administrativa restrita.
- Fechar EXECUTE de `emitir_carteirinha` para PUBLIC/anon e conceder somente a authenticated depois de o frontend autenticado estar pronto e testado.
- A função deve validar `auth.uid()`, e-mail confirmado em `auth.users`, hash calculado no servidor, campos e formato do número.
- Serializar renovações concorrentes por e-mail e manter o número existente na renovação.
- Preservar `verificar_carteirinha` como endpoint público de consulta mínima: nível, validade e situação, sem nome, e-mail ou contato.

### 3. Autenticação simples por código de e-mail

Fluxo proposto na própria página atual:

1. Associada preenche o formulário como hoje.
2. Ao clicar em “Cadastrar e emitir”, o sistema solicita um código OTP ao Supabase.
3. A associada informa o código recebido, sem sair do fluxo.
4. O Supabase cria/valida a sessão e o frontend chama a RPC com o token da sessão.
5. O banco calcula o hash do e-mail confirmado e compara com o cadastro.
6. Se o e-mail já existir, mantém o número e aplica a regra atual de validade/renovação. Se for novo, gera número no formato ASF atual e cria um registro.
7. Só depois da confirmação do banco o frontend mostra a carteirinha oficial e o QR.

O payload temporário do formulário fica apenas em `sessionStorage`, com expiração curta e limpeza após sucesso, falha ou cancelamento. Não armazenar OTP, tokens ou dados pessoais em logs.

### 4. E-mail gratuito usando Google Apps Script (a validar)

O Supabase oferece o Send Email Auth Hook no plano Free. O hook pode encaminhar a mensagem de autenticação a um provedor customizado.

Alternativa gratuita a validar:
- Manter o código do Google Apps Script dentro deste repositório.
- Publicar o Apps Script como Web App executado pela conta Google autorizada da ASF.
- Um Supabase Edge Function recebe o webhook, valida a assinatura Standard Webhooks e só então chama o Apps Script com payload assinado e timestamp.
- O Apps Script valida assinatura, timestamp e proteção contra repetição antes de enviar o OTP com `MailApp`.
- Segredos ficam exclusivamente em Supabase Secrets e Script Properties; nunca no HTML, GitHub público ou navegador.
- Monitorar cota com `MailApp.getRemainingDailyQuota()` e falhar de modo seguro quando a cota acabar.

Limites oficiais publicados pelo Google: 100 destinatários/dia em conta de consumidor e 1.500/dia em Google Workspace; são limites sujeitos a alteração. O endereço remetente precisa ser uma conta ASF autorizada ou um alias de envio efetivamente configurado. A conta Google conectada ao ChatGPT não deve ser presumida como remetente autorizado da ASF.

**Não ativar o hook nem publicar o Web App antes de confirmar a conta remetente, testar a assinatura e validar entrega real em endereços de teste.** Se a implementação do Apps Script não puder validar a assinatura de ponta a ponta, não usar o endpoint público; manter a alternativa administrativa até existir um provedor adequado.

### 5. Backup gratuito e recuperação

- O plano Free do Supabase não oferece backups gerenciados para download; a documentação recomenda exportação lógica periódica com Supabase CLI.
- Criar workflow de backup versionado no GitHub, executado manualmente e por agenda, com dump de esquema e dados.
- O dump de dados deve ser criptografado antes de sair do runner (por exemplo, age), com chave de recuperação guardada fora do GitHub e fora do repositório.
- Destino obrigatório: armazenamento privado separado (repositório privado exclusivo ou Drive privado aprovado). Nunca gravar dados de associadas em `asf-app` se o repositório for público.
- Guardar manifestos de integridade, data do backup e versão do esquema; testar restauração com dados sintéticos ou em projeto isolado.
- Fazer backup antes de qualquer migration e manter export manual de emergência.
- Não usar planilha como espelho automático nem permitir edição concorrente da base oficial.

## Decisões de negócio que precisam ser explícitas

A tabela atual não possui estado “pendente de aprovação”. O fluxo de OTP confirma posse do e-mail, não confirma pagamento, elegibilidade ou aprovação institucional. Se a ASF aceitar inscrição aberta, a emissão automática após e-mail confirmado preserva o comportamento atual. Se for necessária aprovação humana, primeiro será preciso desenhar uma fila de solicitações pendentes sem alterar a semântica atual de `ativo`.

## Ordem segura de implementação

1. Congelar alterações de produção e manter emissão local disponível.
2. Concluir auditoria de assinatura/índices/policies e ajustar a migration proposta ao esquema real.
3. Implementar OTP na branch e criar testes automatizados para sessão ausente, e-mail não confirmado, hash divergente, número duplicado, renovação, concorrência e expiração.
4. Preparar o Google Apps Script e o Send Email Hook em ambiente isolado; testar assinatura, cota, entrega e rate limit.
5. Preparar backup/export cifrado e testar restauração antes de qualquer migration.
6. Revisão do Pull Request e aprovação humana.
7. Ativar em produção em janela controlada, com verificação pós-deploy e rollback fail-closed.

## Estado desta entrega

Este documento é uma arquitetura de execução, não uma ativação. Não houve alteração de Auth, SQL, tabelas, registros, SMTP, redirects, publicação do Apps Script ou deploy de produção.
