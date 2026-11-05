# ASF Newsletter - automacao semanal gratuita

Planilha (Google Sheets): https://docs.google.com/spreadsheets/d/1V4aepr98rLiQi2_tM0LavJSWAha23RDz0eQ84n5m6pg/edit
Apps Script existente: https://script.google.com/d/1mY--RY8B2ydVV6QIG4Zr5-n_-dpY6SW8Agwflh7F7-qQ7InGNcWMJDnp/edit
Home (formulario): https://asf.surf/#newsletter-destaque

## Como funciona
1. A visitante se inscreve na home. O app.js envia e-mail + consentimento para o Web App do Apps Script.
2. O Apps Script grava na aba Inscritas (com token de cancelamento), sem duplicar; quem cancelou e volta e reativado.
3. Toda segunda as 9h (America/Sao_Paulo), sendWeeklyNewsletter roda se Config envio_ativado=sim.
4. A edicao usa somente linhas da aba Conteudo da semana ISO atual (formato 2026-W46) com aprovado=sim, ordenadas por ordem.
5. Cada envio e registrado em Envios. A mesma semana nunca e reenviada para o mesmo e-mail. Sem conteudo aprovado ou sem inscritas ativas, nao envia e registra o motivo.
6. Todo e-mail tem link de cancelamento (doGet?action=unsubscribe...), que muda o status para cancelado.

## Instalacao (uma unica vez, 2 minutos)
1. Abra o Apps Script acima e substitua todo o Codigo.gs pelo conteudo de newsletter/Code.gs deste repositorio. Salve.
2. Execute createWeeklyTrigger uma vez e autorize as permissoes (Sheets, envio de e-mail e gatilhos).
3. Em Implantar > Gerenciar implantacoes, atualize a implantacao existente do Web App mantendo a MESMA URL /exec: Executar como = Eu; Acesso = Qualquer pessoa. Sem isso, visitante anonimo recebe 403 e a inscricao nao grava.
4. Execute sendTestNewsletter e confira: caixa de entrada de asf.surffeminino@gmail.com e aba Envios com status teste.
5. So depois do teste OK, mude Config envio_ativado para sim. A distribuicao continua 1x por semana.

## Rotina semanal (maximo de automacao com qualidade)
- Ate sexta: adicionar linhas em Conteudo com semana ISO da proxima segunda, categoria, titulo, resumo curto e link ASF. Noticias de surf de terceiros entram apenas como item curado e linkado (sem copiar texto de fora).
- Marcar aprovado=sim somente no que pode sair. O restante fica como rascunho.
- Segunda 9h: envio automatico. Confira a aba Envios (enviado/erro/sem_conteudo/sem_inscritas).

## Limites e seguranca
- A URL /exec e publica para inscricoes: o codigo valida e-mail/consentimento, usa honeypot e nao expoe a lista de inscritas.
- MailApp tem cotas diarias do Google. Se a lista crescer muito, migrar o disparo para uma ferramenta dedicada mantendo esta planilha como controle.
- Nunca mude envio_ativado para sim antes do teste: e a trava de seguranca da automacao.
