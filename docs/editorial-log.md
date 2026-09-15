# 📓 Registro Editorial ASF

Toda alteração editorial automatizada é registrada aqui. Rollback via histórico de commits do Git.

| Data/Hora (UTC) | Arquivo | Alteração | Motivo | Fonte | Prioridade | QA |
|---|---|---|---|---|---|---|
| 2026-09-15 17:20 | surf-news.js | 7 itens de news movidos para SURF_NEWS_LEGACY (não renderizados); lista ativa esvaziada com mensagem honesta de estado vazio | Notícias sem fonte confirmável — violação da regra anti-conteúdo-fake | Auditoria Hermes | P0 | Estado vazio renderiza corretamente |
| 2026-09-15 17:20 | index.html (via injector em surf-news.js) | Aviso "Conteúdo demonstrativo" injetado na vitrine de Marcas Parceiras (Brand Hub) | Marcas reais com cupons ASF15/20/25 exibidos como parcerias verificadas sem convênio confirmado; remoção total exige controle humano | Auditoria Hermes | P0 | Aviso visível acima dos cards |
| 2026-09-15 17:20 | data/events.json | Campos `status` (ENCERRADO) e `ultima_atualizacao` nos 3 eventos passados | Consciência temporal | spsurf.com.br | P1 | Renderer separa histórico; sem quebra |
| 2026-09-15 17:20 | sitemap.xml | lastmod 2026-05-23 → 2026-09-15 | SEO | Auditoria Hermes | P3 | XML válido |
| 2026-09-15 17:50 | index.html (via hotfix em surf-news.js) | Link do Google Forms de cadastro (404 confirmado) → WhatsApp oficial wa.me/5511954346288 | Link quebrado — formulário inexistente | Auditoria de links | P1 | GET confirmou 404 antes da troca |
| 2026-09-15 17:50 | index.html (via hotfix em surf-news.js) | Checkout da loja usava wa.me/5511999999999 (placeholder) → corrigido para 5511954346288 | Número fictício — pedidos iriam para número errado | Auditoria Hermes | P1 | window.open interceptado; demais fluxos intactos |
| 2026-09-15 17:50 | 12 arquivos deletados | index-local.html, index.html.corrupt, 3× .bak, asf-app-completo.tar.gz, redirect.html, test.html, clean_stats.txt, 3× __pycache__ | Arquivos mortos (~4 MB); recuperáveis via git | Auditoria Hermes | P2 | Nenhum referenciado pelo index.html |
| 2026-09-15 18:40 | scripts/link_checker.py | Substituído checker SIMULADO (retornava "ok" sem verificar, usava random) por verificador real (HTTP HEAD/GET, marca não-verificáveis como skipped, nunca como ok) | Automação não pode fingir verificação | Auditoria Hermes | P1 | Executado no sandbox: 20 ok, 1 broken (Forms, já mitigado), 23 skipped |
| 2026-09-15 18:40 | .github/workflows/link-audit.yml | Novo workflow diário (9h BRT): roda checker real, commita relatório em docs/generated/, alerta se houver quebrados | Rotina diária de auditoria de links | Auditoria Hermes | P2 | YAML válido; relatório commitado apenas se houver mudança |

## Notas sobre prospecção (docs/brand-*)
- Materiais NÃO são publicados no site e docs/ está bloqueado no robots.txt.
- E-mails de marcas são contatos públicos (SAC/B2B) — uso legítimo para prospecção manual.
- ⚠️ Claim "500+ mulheres surfistas" nos e-mails NÃO é verificado — corrigir antes de qualquer envio.
- Duplicidade: Smart Fit aparece 2× em brand-emails.json.
- Envio de propostas = decisão humana (não automatizar).

## Pendências (controle humano necessário)
- [ ] Decidir destino da vitrine de marcas/cupons (remover ou substituir por parcerias reais).
- [ ] Criar novo formulário de cadastro (o antigo foi excluído) ou manter WhatsApp como canal oficial. Enquanto isso, o link-audit diário continuará flagando o Forms 404 no HTML estático (o hotfix em JS já protege os usuários).
- [ ] Definir fontes oficiais de notícias (SPSurf, WSL, ISA) para realimentar SURF_NEWS com verificação.
- [ ] Corrigir claim "500+ surfistas" e duplicidade Smart Fit em docs/brand-emails.json antes de prospectar.
- [ ] Links de Instagram/TikTok não verificáveis automaticamente (rate-limit) — checagem manual ocasional.
