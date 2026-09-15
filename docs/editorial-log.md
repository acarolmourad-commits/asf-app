# 📓 Registro Editorial ASF

Toda alteração editorial automatizada é registrada aqui. Rollback via histórico de commits do Git.

| Data/Hora (UTC) | Arquivo | Alteração | Motivo | Fonte | Prioridade | QA |
|---|---|---|---|---|---|---|
| 2026-09-15 17:20 | surf-news.js | 7 itens de news movidos para SURF_NEWS_LEGACY (não renderizados); lista ativa esvaziada com mensagem honesta de estado vazio | Notícias sem fonte confirmável (ex.: "primeira praia oficial feminina", WSL CT Bertioga, parceria e workshop não verificados) — violação da regra anti-conteúdo-fake | Auditoria Hermes | P0 | Renderização exibe estado vazio correto |
| 2026-09-15 17:20 | index.html (via injector em surf-news.js) | Aviso "Conteúdo demonstrativo" injetado na vitrine de Marcas Parceiras (Brand Hub) | Marcas reais (Rip Curl, Billabong, Quiksilver, Granado) com cupons ASF15/20/25 exibidos como parcerias verificadas sem convênio confirmado; remoção total exige controle humano (parcerias) | Auditoria Hermes | P0 | Aviso visível acima dos cards |
| 2026-09-15 17:20 | data/events.json | Adicionados campos `status` (ENCERRADO) e `ultima_atualizacao` aos 3 eventos passados | Consciência temporal: eventos de jun–ago/2026 estavam sem status | spsurf.com.br | P1 | Renderer já separa histórico; sem quebra |
| 2026-09-15 17:20 | sitemap.xml | lastmod atualizado 2026-05-23 → 2026-09-15 | SEO | Auditoria Hermes | P3 | XML válido |

## Pendências (controle humano necessário)
- [ ] Decidir destino da vitrine de marcas/cupons (remover ou substituir por parcerias reais).
- [ ] Definir fontes oficiais de notícias (SPSurf, WSL, ISA) para alimentar SURF_NEWS com verificação.
- [ ] Revisar `docs/brand-*.json|html` (materiais de prospecção) — não publicados, mas revisar claims.
