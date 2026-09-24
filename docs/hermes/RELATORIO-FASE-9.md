# Relatório — Fase 9: Centralização de dados do monólito

**Data:** 2026-09-24 · **Status:** concluída (etapa 1 — registry de satélites)

## Problema
A lista dos 52 apps satélites estava hardcoded e duplicada em 6 arquivos do monólito:
`asf-network.js`, `satellites.html`, `guia-apps.html`, `rede.html`, `novidades.html`, `apps/index.html`.
Adicionar/remover um satélite exigia editar 6 arquivos manualmente — risco de drift.

## Solução
- **`data/apps.json`** — fonte única de verdade (hub + 52 satélites: slug, nome, URL).
- **`scripts/sync_apps_registry.py`** — valida que todos os consumidores full-list estão
  idênticos ao registry (exit 1 em divergência) e regenera `asf-network.js` com `--write`.
- **`.github/workflows/apps-registry.yml`** — validação automática a cada push/PR que toque
  nos arquivos envolvidos. O ecossistema se autopolicia: drift quebra o CI.

## Fluxo para adicionar um satélite
1. Editar `data/apps.json` (único arquivo).
2. `python3 scripts/sync_apps_registry.py --write` para regenerar `asf-network.js`.
3. Atualizar as páginas HTML full-list (o CI bloqueia o merge até estarem em sync).

## Fora de escopo (próximas iterações)
- Migrar páginas full-list para renderização dinâmica a partir de `data/apps.json`
  (eliminaria o passo 3, mas exige refatoração de HTML estático).
- Centralizar demais dados inline do `index.html` (`MOCK_MANAS`, `translations`).
