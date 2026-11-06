# ASF Newsletter — auditoria e plano de finalização
Data da auditoria: 2026-11-06

## Decisão recomendada: operação sem Brevo
A opção gratuita prioritária é Google Apps Script MailApp, mantendo Google Sheets como fonte de dados e o Apps Script como motor de inscrição, confirmação, cancelamento e envio semanal.

Cotas oficiais atuais do Apps Script:
- Conta Google pessoal: 100 destinatários por dia.
- Google Workspace: 1.500 destinatários por dia.
- Máximo de 50 destinatários por mensagem.
- Cotas são por usuário e podem mudar sem aviso.
Fonte: https://developers.google.com/apps-script/guides/services/quotas

A implantação deve consultar MailApp.getRemainingDailyQuota() antes de enviar e interromper a campanha quando a cota não for suficiente. Para bases maiores que a cota diária, distribuir a campanha em dias sucessivos ou usar um provedor especializado.

## O que foi validado
- GitHub: repositório acessível e estrutura newsletter encontrada.
- Formulário: presente na home, com consentimento LGPD e honeypot.
- Endpoint: newsletter/config.js ainda contém URL vazia; cadastro online não está ativado.
- Apps Script: código existe, mas implantação Web App não foi comprovada.
- GitHub Actions: workflow semanal existe, segunda-feira às 09:00 America/Sao_Paulo.
- Gmail via Composio: conexão ativa identificada como comercial@praia.digital; não é o remetente institucional ASF e não deve ser usado para disparo da associação.
- Google Sheets via Composio: conexão ativa, porém o acesso à planilha da Newsletter retornou 403 PERMISSION_DENIED. Não foi possível auditar abas, cabeçalhos ou inscrições. Nenhum dado foi alterado.

## Correções aplicadas nesta branch
1. O formulário não grava mais inscrições fictícias/local-only em localStorage quando o endpoint está vazio.
2. O formulário valida e-mail, consentimento e honeypot, bloqueia duplo clique durante o pedido e informa com precisão que a confirmação depende do e-mail.
3. O disparador Python rejeita modos desconhecidos; apenas preview, test e send são aceitos.
4. O disparador lê o campo token, que corresponde à coluna gravada pelo Apps Script, em vez de procurar token_cancelamento.

## Bloqueios para ativação
- Conceder à conexão Google Sheets já conectada acesso de leitor/editor à planilha da Newsletter, ou conectar no Composio a conta Google que já tem acesso.
- Confirmar qual conta Google deve ser proprietária do Apps Script e remetente da ASF.
- Confirmar cabeçalhos exatos das abas Inscritas, Conteudo, Envios e Config.
- Escolher e implementar um único motor de envio. Recomendação: MailApp no Apps Script para remover Brevo; manter o workflow GitHub em preview/validação editorial, sem disparo para a lista.
- Implantar e testar o Web App /exec, incluindo inscrição, double opt-in e cancelamento.
- Testar campanha apenas para um endereço autorizado e revisar a cota antes de ativar o envio semanal.

## Segurança
Não colocar credenciais, tokens ou URLs privadas com parâmetros em commits. Não ativar envio real antes de validar o remetente, o consentimento, a lista ativa, o cancelamento e a cota diária. Não usar a conta comercial@praia.digital como remetente institucional sem autorização explícita.
