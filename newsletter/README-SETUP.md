# ASF Newsletter — setup e operação

## Controle (Google Sheets)
Planilha: https://docs.google.com/spreadsheets/d/1V4aepr98rLiQi2_tM0LavJSWAha23RDz0eQ84n5m6pg/edit
- `Inscritas`: inscricoes confirmadas (status ativa) e canceladas.
- `Conteudo`: curadoria semanal. Use semana ISO `AAAA-Www` (ex.: 2026-W46), preencha titulo/resumo/link e `aprovado=sim`.
- `Envios`: log automatico por destinataria (anti-duplicidade).
- `Config`: remetente/assunto/URL. `envio_ativado` comeca `nao`.

## 1) Ativar inscricoes no site (uma unica vez, 5 min)
1. Abra a planilha > Extensoes > Apps Script.
2. Cole o conteudo de `newsletter/apps-script/Code.gs`.
3. Implantar > Nova implantacao > Web app. Executar como: eu. Acesso: qualquer pessoa.
4. Copie a URL terminada em `/exec`.
5. Cole essa URL em `newsletter/config.js` (`ASF_NEWSLETTER_ENDPOINT`) e na aba `Config` (`apps_script_url`).
6. Teste na home: inscreva um e-mail seu, clique no link de confirmacao recebido e confira `status=ativa` na planilha.

## 2) Segredos do GitHub (Settings > Secrets and variables > Actions)
Nunca cole segredos em chat/e-mail.
- Secret `GOOGLE_SERVICE_ACCOUNT_JSON`: JSON de uma conta de servico Google; compartilhe a planilha com o e-mail dessa conta como Editor.
- Secret `BREVO_API_KEY`: chave da Brevo (remetente ASF ja verificado; plano Free).
- Variable `ASF_NEWSLETTER_SHEET_ID`: `1V4aepr98rLiQi2_tM0LavJSWAha23RDz0eQ84n5m6pg` (opcional, ja e o padrao do script).
- Variable `ASF_NEWSLETTER_UNSUBSCRIBE_BASE`: a URL `/exec` do Apps Script.
- Variable opcional `ASF_NEWSLETTER_RSS_URLS`: feeds RSS de noticias de surf separados por virgula. Sem isso, a newsletter usa so a curadoria aprovada + links ASF (nada e inventado).

## 3) Teste sem enviar para a lista
Actions > ASF Newsletter Semanal > Run workflow:
1. `mode=preview` (padrao): gera `newsletter-preview.html` como artefato, nao envia.
2. `mode=test` + seu e-mail: envia so para ele.
3. Confira a planilha `Envios`.

## 4) Ligar o envio semanal
1. Na planilha `Config`, mude `envio_ativado` para `sim`.
2. No GitHub, crie a variable `ASF_NEWSLETTER_SEND_ENABLED=true`.
3. Toda segunda, preencha/aprove linhas da semana em `Conteudo`. Sem conteudo aprovado, o envio e bloqueado.
Horario: segundas 12:00 UTC (09:00 America/Sao_Paulo). Para desligar: `envio_ativado=nao` ou `SEND_ENABLED` diferente de `true`.

## LGPD/boas praticas
Confirmacao por e-mail (double opt-in), consentimento registrado, link de cancelamento em todo envio, nada de comprar lista, e nunca prometer no site que ha envio antes de o endpoint estar ativo.
