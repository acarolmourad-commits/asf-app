# 📓 Registro Editorial ASF

Toda alteração editorial automatizada é registrada aqui. Rollback via histórico de commits do Git.

| Data/Hora (UTC) | Arquivo | Alteração | Motivo | Fonte | Prioridade | QA |
|---|---|---|---|---|---|---|
| 2026-09-15 17:20 | surf-news.js | 7 itens de news movidos para SURF_NEWS_LEGACY (não renderizados); lista ativa esvaziada com mensagem honesta de estado vazio | Notícias sem fonte confirmável (ex.: "primeira praia oficial feminina", WSL CT Bertioga, parceria e workshop não verificados) — violação da regra anti-conteúdo-fake | Auditoria Hermes | P0 | Renderização exibe estado vazio correto |
| 2026-09-15 17:20 | index.html (via injector em surf-news.js) | Aviso "Conteúdo demonstrativo" injetado na vitrine de Marcas Parceiras (Brand Hub) | Marcas reais (Rip Curl, Billabong, Quiksilver, Granado) com cupons ASF15/20/25 exibidos como parcerias verificadas sem convênio confirmado; remoção total exige controle humano (parcerias) | Auditoria Hermes | P0 | Aviso visível acima dos cards |
| 2026-09-15 17:20 | data/events.json | Adicionados campos `status` (ENCERRADO) e `ultima_atualizacao` aos 3 eventos passados | Consciência temporal: eventos de jun–ago/2026 estavam sem status | spsurf.com.br | P1 | Renderer já separa histórico; sem quebra |
| 2026-09-15 17:20 | sitemap.xml | lastmod atualizado 2026-05-23 → 2026-09-15 | SEO | Auditoria Hermes | P3 | XML válido |
| 2026-09-15 17:50 | index.html (via hotfix em surf-news.js) | Link do Google Forms de cadastro (404 confirmado) redirecionado para WhatsApp oficial wa.me/5511954346288 | Link quebrado — formulário inexistente | Auditoria de links Hermes | P1 | GET confirmou 404 antes da troca; WhatsApp é o número usado 8x no próprio site |
| 2026-09-15 17:50 | index.html (via hotfix em surf-news.js) | Checkout da loja usava wa.me/5511999999999 (placeholder); interceptado e corrigido para 5511954346288 | Número fictício — pedidos iriam para número errado | Auditoria Hermes | P1 | window.open interceptado; nenhum outro fluxo afetado |
| 2026-09-15 17:50 | 12 arquivos deletados | Removidos: index-local.html, index.html.corrupt, index.html.bak, .bak.1779607955, .bak.safe, asf-app-completo.tar.gz, redirect.html (redirecionava p/ raw.githack), test.html, clean_stats.txt, scripts/__pycache__ (3 .pyc) | Arquivos mortos de desenvolvimento (~4 MB); recuperáveis via histórico git | Auditoria Hermes | P2 | Nenhum era referenciado pelo index.html |

## Pendências (controle humano necessário)
- [ ] Decidir destino da vitrine de marcas/cupons (remover ou substituir por parcerias reais).
- [ ] Criar novo formulário de cadastro (o antigo foi excluído) ou manter WhatsApp como canal oficial.
- [ ] Definir fontes oficiais de notícias (SPSurf, WSL, ISA) para alimentar SURF_NEWS com verificação.
- [ ] Revisar `docs/brand-*.json|html` (materiais de prospecção) — não publicados, mas revisar claims.
- [ ] Links de Instagram não puderam ser verificados automaticamente (rate-limit 429) — checagem manual recomendada.
