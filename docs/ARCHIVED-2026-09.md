# 🗄️ Arquivados na auditoria de 2026-09-21

Os arquivos abaixo eram **correções pontuais já aplicadas** (uso único) e foram removidos da `main` para reduzir ruído. **Nada foi perdido** — todo o conteúdo permanece no histórico git.

Para recuperar qualquer arquivo:
```
git log --diff-filter=D -- <caminho>   # encontra o commit de remoção
git checkout <sha>^ -- <caminho>       # restaura o arquivo
```

## Workflows arquivados (21)
asf-fix-buttons, asf-fix-quiz, asf-master-cleanup, clean-wave-mentions, fix-hero-img, fix-home-logo, fix-logo-svg, hermes-fix-anchors, hermes-fixes2, hermes-guias, hermes-home-hero, hermes-quiz, p0-remove-sorteio, p3-remove-infolinks, p4-split-index, perf-adsense-preconnect, remove-premium-charges, remove-wave-forecast, update-events-2026, update-events-sources, wsl-card-fix

## Scripts arquivados (13)
asf_fix_buttons.py, asf_fix_quiz.py, asf_master_cleanup.py, hermes_fix_anchors.py, hermes_fixes2.py, hermes_guias_home.py, hermes_home_hero.py, hermes_quiz_archetypes.py, p0_remove_sorteio.py, refactor_index.py, remove_lojas_section.py, remove_wave_forecast.py, remove_wave_mentions.py, wave_forecast.py

## Páginas obsoletas removidas (2)
- `index-short.html` — redirect solto, sem referências
- `index-seo.html` — variante SEO duplicada da home (canonical apontava para a home)

## Permanecem ativos
- Workflows: `main.yml`, `link-audit.yml`, `events-status.yml` (+ novos de manutenção)
- Scripts usados pelos workflows ativos: daily_tip, generate_content, link_checker, events_status, eco_board_agent, mobility_agent, smart_generator, layout_optimizer, alongamento_dicas, respiracao_dicas
