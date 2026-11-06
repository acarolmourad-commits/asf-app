# ASF Newsletter — configuração inicial

## Recursos
- Planilha oficial: [ASF — Newsletter](https://docs.google.com/spreadsheets/d/1V4aepr98rLiQi2_tM0LavJSWAha23RDz0eQ84n5m6pg/edit)
- Projeto Apps Script: [ASF Newsletter](https://script.google.com/d/1mY--RY8B2ydVV6QIG4Zr5-n_-dpY6SW8Agwflh7F7-qQ7InGNcWMJDnp/edit)
- Código versionado: [newsletter/apps-script/Code.gs](https://github.com/acarolmourad-commits/asf-app/blob/main/newsletter/apps-script/Code.gs)

## Estado e segurança
A planilha é nova e não há inscrições anteriores para migrar. O formulário do site permanece desativado enquanto o endpoint estiver vazio. Nenhum disparo de campanha está autorizado por esta configuração.

O Apps Script versionado no GitHub precisa ser copiado para o projeto Apps Script institucional e implantado como Web App. Atualizar o arquivo no GitHub **não atualiza automaticamente** o projeto Apps Script.

## 1. Preparar a planilha
1. Abra o projeto Apps Script institucional vinculado à conta `asf.surffeminino@gmail.com`.
2. Abra `newsletter/apps-script/Code.gs` no GitHub e substitua o conteúdo do arquivo `Code.gs` no editor Apps Script.
3. Salve.
4. No seletor de funções, escolha `setup` e execute uma vez.
5. Autorize o acesso à planilha e o envio de e-mail solicitado pelo Google.
6. Confirme que a aba `Inscritas` foi criada com os cabeçalhos: `created_at, email, name, source, consent, status, token, updated_at`.

A função `setup()` cria a aba e os cabeçalhos somente se necessário. Se encontrar uma primeira linha diferente, interrompe sem sobrescrever dados.

## 2. Implantar como Web App
1. No Apps Script, selecione **Implantar > Nova implantação**.
2. Tipo: **App da Web**.
3. Executar como: **Eu** (conta institucional ASF).
4. Quem pode acessar: **Qualquer pessoa**.
5. Implante e copie a URL terminada em `/exec`.
6. Não compartilhe a URL de edição do projeto; somente a URL pública de execução será usada no formulário.

## 3. Conectar o formulário
1. Insira a URL `/exec` em `newsletter/config.js`, na variável `window.ASF_NEWSLETTER_ENDPOINT`.
2. Faça commit e aguarde o deploy do site.
3. Teste com um endereço controlado pela ASF: inscrição, recebimento do e-mail de confirmação, clique no link e verificação de `status=ativa` na planilha.
4. Teste o descadastro pelo link de cancelamento em uma mensagem de teste controlada. Não use uma lista real.

## 4. Limites operacionais
- Inscrições só ficam ativas após confirmação por e-mail (double opt-in).
- O status pendente não deve receber campanhas.
- Cada mensagem de campanha precisa conter um link de descadastro individual.
- O envio deve respeitar a cota diária disponível do MailApp e interromper quando a cota for insuficiente.
- A campanha semanal deve permanecer em preview por padrão. Envio real exige conteúdo aprovado e ativação deliberada, fora desta etapa.
- Não armazene credenciais Google ou tokens em arquivos públicos do repositório.

## 5. Critério de conclusão
A newsletter só poderá ser considerada ativa depois de confirmar: (a) implantação pública do Web App, (b) endpoint real configurado no site, (c) cadastro de teste recebido e confirmado, (d) descadastro de teste funcionando e (e) fluxo de campanha bloqueado por padrão.
