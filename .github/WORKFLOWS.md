# ASF App - GitHub Actions Documentation

## 📋 Visão Geral

O ASF App usa **GitHub Actions** para automação completa. Um único workflow (`main.yml`) coordena 7 jobs especializados.

---

## 🔄 Workflow Principal

### `main.yml` - Central Automation

**Triggers:**
- ✅ `push` para `main` → Deploy imediato
- ✅ `schedule` (cron) → Execução automática diária
- ✅ `workflow_dispatch` → Execução manual (botão "Run workflow")
- ✅ `repository_dispatch` → Trigger externo via API

**Jobs:**

| Job | Quando roda | O que faz | Output |
|-----|-------------|-----------|--------|
| **deploy** |Push |Valida HTML + Deploy GitHub Pages| App atualizado |
| **wave-forecast** |Diário (10:00 UTC)|Busca dados reais Open-Meteo|docs/wave-forecast.html`|
| **daily-tip** |Diário (10:00 UTC)|Gera dica de bem-estar mental|`docs/daily-tip.html`|
| **content-generator**|A cada 6h|Gera dicas, quotes, posts|`docs/generated/`|
| **mobility** |A cada 3 dias|Exercícios de mobilidade|`docs/generated/mobility.html`|
| **smart-gen** |A cada 6h|Sugestões inteligentes|`docs/generated/smart.html`|
| **eco-board** |Diário|Conteúdo de pranchas + eco|`docs/generated/eco-board.html`|
| **notify** |Sempre (after all)|Resumo de status|Artifact `workflow-status`|

---

## 📁 Estrutura de Arquivos Gerados

```
docs/
├── wave-forecast.html      ← Previsão de ondas (8 cidades)
├── daily-tip.html          ← Dica do dia (bem-estar)
└── generated/
    ├── tip.html            ← Nova dica de surf
    ├── quote.html          ← Frase motivacional
    ├── post.html           ← Post de comunidade
    ├── mobility.html       ← Exercício do dia
    ├── eco-board.html      ← Dica de prancha + eco
    ├── smart.html          ← Sugestões inteligentes
    ├── mobility.json       ← JSON da mobilidade
    ├── eco-board.json      ← JSON do eco board
    └── smart.json          ← JSON do smart gen
```

---

## 🔧 Scripts Python

### Principais
| Script | Função | Output |
|--------|--------|--------|
| `wave_forecast.py` | Busca dados reais da API Open-Meteo Marine | `docs/wave-forecast.html` |
| `generate_content.py`| Gera dicas, quotes e posts da comunidade| `docs/generated/` |
| `mobility_agent.py` | Exercícios diários de mobilidade | `docs/generated/mobility.html` |
| `eco_board_agent.py`| Conteúdo sobre pranchas e sustentabilidade | `docs/generated/eco-board.html` |
| `smart_generator.py` | Sugestões de melhorias e utilitários | `docs/generated/smart.html` |
| `link_checker.py` | Verifica links e sugere melhorias | `docs/generated/link-checker.html` |
| `layout_optimizer.py`| Análise de layout e sugestões | `docs/generated/layout.html` |

### Como executar localmente
```bash
cd /root/.openclaw/workspace/asf-app
python3 scripts/wave_forecast.py
python3 scripts/generate_content.py
python3 scripts/mobility_agent.py
# ... etc
```

---

## ⚙️ Configuração

### Dependencies
Instaladas automaticamente via `requirements.txt`:
```
requests>=2.31.0
beautifulsoup4>=4.12.0
ghapi>=1.0.0
```

### Variáveis de Ambiente
- `PYTHON_VERSION`: 3.11 (padrão)
- `GIT_AUTHOR_NAME`: ASF Bot
- `GIT_AUTHOR_EMAIL`: bot@asf-app.com

---

## 🚀 Executando Manualmente

1. Vá para **Actions** no GitHub
2. Selecione workflow **ASF App - Daily Automation**
3. Clique **Run workflow**
4. Escolha evento:
   - `deploy` → só deploy
   - `daily_update` → previsão + dica
   - `content_update` → conteúdo
   - `workflow_dispatch` → tudo

---

## 📊 Cron Schedule

| Job | Cron (UTC) | Horário Brasil | Frequência |
|-----|------------|----------------|------------|
| wave-forecast | `0 10 * * *` | 07:00 | Diário |
| daily-tip | `0 10 * * *` | 07:00 | Diário |
| content-generator | `0 */6 * * *` | A cada 6h | 4x/dia |
| mobility | `0 9 */3 * *` | 06:00 | A cada 3 dias |
| smart-gen | `0 */6 * * *` | A cada 6h | 4x/dia |
| eco-board | `0 10 * * *` | 07:00 | Diário |

---

## 🔍 Monitoramento

### Logs
- Cada job tem logs detalhados no GitHub Actions
- Use `echo "✅ status"` para rastreamento
- Erros aparecem em vermelho no log

### Artifacts
- `workflow-status` (job notify) → resumo da execução

### Debugar
```bash
# Clone o repo
git clone https://github.com/acarolmourad-commits/asf-app.git
cd asf-app

# Execute um script localmente
python3 scripts/wave_forecast.py

# Verifique os arquivos gerados
ls docs/generated/
```

---

## 🛠️ Troubleshooting

### Script não gera arquivo
```bash
# Verifique permissões
chmod +x scripts/*.py

# Execute manualmente
python3 scripts/generate_content.py
ls -la docs/generated/
```

### Deploy falha
1. Verifique se `index.html` existe
2. Valide HTML (sem erros críticos)
3. Tente deploy manual via Actions

### Commit não acontece
- Scripts só fazem commit se houver mudanças
- Use `git diff` para ver modifications
- Verifique Git token (GITHUB_TOKEN automático)

---

## 📈 Futuras Melhorias

- [ ] Adicionar notificações via email/Slack
- [ ] Adicionar retry automático em falhas
- [ ] Cache de dependências Python
- [ ] Métricas de sucesso/falha
- [ ] Deploy automático só se testes passarem
- [ ] Integração com Canvas para preview

---

**Última atualização:** 27 Abr 2026
**Versão do workflow:** 2.0 (consolidado)