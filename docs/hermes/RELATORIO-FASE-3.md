# 📋 RELATÓRIO — MISSÃO HERMES · FASE 3 (15/set/2026)

Status: IMPLEMENTADO E VERIFICADO EM PRODUÇÃO.

## 🔧 Correções críticas de infraestrutura

### 1. Automação diária estava 100% quebrada (10/10 execuções agendadas falhando)
**Causas raiz encontradas e corrigidas no `.github/workflows/main.yml` (commit fc0fa19):**
- **Validação impossível:** o passo "Validate Layout & Link Reports" exigia `docs/generated/link-checker.json`, mas o `link_checker.py` gera `link-audit.json`. Falha garantida em toda execução → o conteúdo diário (dicas, quotes, mobilidade, eco board) nunca era commitado. Corrigido para `link-audit.json`.
- **Corrida de commits:** 3 jobs (wave-forecast, breathing-stretching, daily-content) commitavam e davam push na `main` em paralelo → falhas non-fast-forward. Adicionado loop de retry com `git pull --rebase` em todos os passos de commit.
- **Sobreposição de runs:** adicionado `concurrency: asf-main-automation` (sem cancelar em andamento).

### 2. Linkagem interna e descoberta de conteúdo
- Novo bloco **"📖 Guias ASF"** na Home (logo após o hero) com links para os 6 artigos editoriais — substituições idempotentes via `scripts/hermes_guias_home.py` + workflow dedicado.
- Toasts dos quizzes atualizados: referência a "menu Aprender" (inexistente) → "bloco Guias ASF na Home".

## 🧩 Quizzes (fase anterior, confirmado em produção)
- Quiz básico e quiz de segurança agora retornam **resultado-arquétipo** (Mana Começando / Mana em Evolução / Mana Expert; Mana Precavida / Mana Atenta / Guardiã do Line-up) com explicação e próximo passo real — fim da frase genérica.

## ✅ Verificação final em produção (acarolmourad-commits.github.io/asf-app)
- sorteio: **0** ocorrências ✅
- hero com proposta de valor ✅
- bloco Guias ASF na Home ✅
- arquétipos de quiz (básico + segurança) ✅
- 6 artigos editoriais: todos HTTP 200, com links internos ✅
- sitemap.xml com 8 URLs ✅

## 🚀 Próximos passos reais
1. Monitorar a próxima execução agendada do main.yml (deve passar pela primeira vez — o conteúdo diário volta a ser commitado).
2. QA visual mobile (320–414px) das páginas novas no dispositivo/emulador.
3. Google Search Console: enviar sitemap atualizado e acompanhar indexação.
4. Fila editorial 3: Histórias de Manas (somente com depoimentos reais e autorizados).
