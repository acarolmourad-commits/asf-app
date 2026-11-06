# ASF Newsletter - arquitetura oficial

Este diretorio tem uma unica arquitetura valida (consolidada em 2026-11-06):

- `apps-script/Code.gs` - Web App gratuito de inscricao com double opt-in, confirmacao e cancelamento por token. E o codigo que deve ser colado no Apps Script da planilha.
- `send_newsletter.py` - envio semanal via GitHub Actions + Brevo, com travas de seguranca (preview por padrao; test so para um e-mail; send so com conteudo aprovado da semana, inscritas ativas, credenciais e variavel de ativacao).
- `config.js` - endpoint publico do formulario da home. So preencher com a URL /exec DEPOIS que o Web App de inscricao estiver implantado e testado; vazio mantem o formulario em modo de ativacao (fail-closed).
- `README-SETUP.md` - setup e operacao completos.

O antigo `newsletter/Code.gs` (envio por MailApp/trigger do Apps Script) foi deprecado para evitar duas automacoes concorrentes. Nao implante esse modelo.

Estado de seguranca: nenhum envio real acontece sem (1) Web App de inscricao ativo, (2) secrets do GitHub configurados, (3) conteudo aprovado da semana na aba Conteudo e (4) travas de ativacao ligadas (planilha + variavel do GitHub).


## Auditoria operacional
Consulte [AUDITORIA-E-PLANO-2026-11-06.md](AUDITORIA-E-PLANO-2026-11-06.md) para a decisão sobre envio gratuito via MailApp, correções aplicadas e bloqueios de ativação.
