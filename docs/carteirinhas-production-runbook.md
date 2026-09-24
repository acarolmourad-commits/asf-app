# ASF Carteirinhas — Runbook de produção

Status em 2026-09-24:

- ✅ Workflow `ASF Carteirinha Registry` validado novamente com sucesso: https://github.com/acarolmourad-commits/asf-app/actions/runs/36000783240
- ✅ Página pública do painel disponível: https://acarolmourad-commits.github.io/asf-app/carteirinhas.html
- ✅ Planilha de produção localizada na conta ASF: [ASF — Registro de Carteirinhas](https://docs.google.com/spreadsheets/d/1XVAma2w7qc0FJ-PJ385hoiT-3PKO1kmDiRxjPzOoA04/edit)
- ✅ Aba `Carteirinhas` validada com cabeçalhos: `timestamp`, `numero`, `nome`, `apelido`, `nivel`, `praia`, `cidade`, `insta` e `origem`
- ⏳ Endpoint Apps Script ainda não implantado; `ASF_CARD.REGISTRY_URL` permanece vazio por segurança até haver uma URL real

## Ativação do endpoint

1. Abra a planilha de produção.
2. Vá em **Extensões → Apps Script**.
3. Cole o conteúdo de `docs/ASF_Carteirinhas_Registry.gs`.
4. Troque `TROQUE-POR-UM-SEGREDO` por um token forte e privado.
5. Salve e selecione **Implantar → Nova implantação → App da Web**.
6. Configure:
   - **Executar como:** a conta ASF
   - **Quem pode acessar:** qualquer pessoa
7. Copie a URL `/exec` gerada.
8. Atualize `carteirinha.js` em `ASF_CARD.REGISTRY_URL` com essa URL ou execute o workflow `ASF Carteirinha Registry` informando `registry_url`.
9. Abra o painel público, cole a URL e o token, e valide `status: OK`.

## Observações LGPD

- O registro é opt-in: somente usuárias que marcarem a opção no app serão enviadas à planilha.
- A carteirinha continua funcionando localmente mesmo sem o registro central.
- O token do painel não deve ser commitado no repositório.
- A planilha deve permanecer privada para a conta ASF.

## Teste de fumaça após implantação

1. Abra a carteirinha no app.
2. Preencha dados de teste.
3. Marque o consentimento LGPD e o opt-in de registro.
4. Gere a carteirinha.
5. Confirme uma nova linha na aba `Carteirinhas`.
6. Confirme no painel que o total aumentou.

## GH_TOKEN do cron

O repositório não possui secret `GH_TOKEN` configurado. O token não pode ser gerado automaticamente a partir da integração atual. Para resolver o rate-limit do relatório diário:

1. Crie um Personal Access Token com escopo mínimo necessário de leitura dos repositórios monitorados.
2. Configure-o como variável de ambiente `GH_TOKEN` no serviço que executa o cron.
3. Não salve o valor em código, issues, documentos ou logs.
4. Rode o relatório novamente e confirme que o aviso de modo unauthenticated desapareceu.
