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

---

## Etapa 2 (2026-09-24) — páginas regeneráveis a partir do registry

O `data/apps.json` foi promovido a **v2** e agora centraliza também: ícone, título,
categoria, descrições por contexto (`desc` para satellites.html, `name_apps`/`icon_apps`/
`desc_apps` para apps/index.html), a ordem da lista de `apps/index.html`
(`apps_index_order`) e cards extras (`extras_satellites`, ex.: Media Kit).

`sync_apps_registry.py --write` agora regenera **3 consumidores** a partir do registry:
`asf-network.js`, `satellites.html` (por categoria, preservando extras) e
`apps/index.html`. Regeneração validada como **byte-idêntica** ao estado atual —
zero mudança de conteúdo.

`guia-apps.html`, `rede.html` e `novidades.html` têm markup editorial próprio e
permanecem somente validados pelo CI.

### Fluxo atualizado para adicionar um satélite
1. Editar `data/apps.json` (único arquivo).
2. `python3 scripts/sync_apps_registry.py --write` — regenera os 3 consumidores.
3. Atualizar manualmente guia-apps/rede/novidades (CI bloqueia até estar em sync).

---

## Etapa 3 (2026-09-24) — dados inline do index.html centralizados

`index.html` (~975 KB) tinha dois blocos de dados inline: `MOCK_MANAS` (linha ~416) e
`translations` (linha ~11355). Como o arquivo é grande demais para edição via API,
a extração é feita por `scripts/centralize_index_data.py` (idempotente), executado pelo
workflow `centralize-index-data.yml` (push no script ou dispatch manual):

- `MOCK_MANAS` → `data/mock-manas.js`
- `translations` → `data/translations.js`

O `index.html` passa a carregá-los via `<script src="data/...">` nas posições corretas
de ordem de execução (mock-manas.js no lugar do script original; translations.js antes
do script que consome `translations`; `app.js` é `defer`, executa por último).
Sintaxe dos arquivos gerados validada com `node --check`.
