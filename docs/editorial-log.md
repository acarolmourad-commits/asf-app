# 📓 Registro Editorial ASF

Toda alteração editorial automatizada é registrada aqui. Rollback via histórico de commits do Git.

| Data/Hora (UTC) | Arquivo | Alteração | Motivo | Fonte | Prioridade | QA |
|---|---|---|---|---|---|---|
| 2026-09-15 17:20 | surf-news.js | 7 itens de news movidos para SURF_NEWS_LEGACY (não renderizados); lista ativa esvaziada | Notícias sem fonte confirmável — regra anti-conteúdo-fake | Auditoria Hermes | P0 | OK |
| 2026-09-15 17:20 | index.html (via injector) | Aviso "Conteúdo demonstrativo" na vitrine de Marcas Parceiras | Cupons/parcerias sem convênio confirmado | Auditoria Hermes | P0 | Aviso confirmado no navegador (QA real) |
| 2026-09-15 17:20 | data/events.json | `status` + `ultima_atualizacao` nos 3 eventos encerrados | Consciência temporal | spsurf.com.br | P1 | QA navegador: histórico com 3 eventos ✅ |
| 2026-09-15 17:20 | sitemap.xml | lastmod → 2026-09-15 | SEO | Auditoria | P3 | OK |
| 2026-09-15 17:50 | index.html (via hotfix) | Forms 404 → WhatsApp oficial; checkout placeholder 5511999999999 → número oficial | Links/número quebrados | Auditoria de links | P1 | 404 confirmado por GET |
| 2026-09-15 17:50 | 12 arquivos deletados | Resíduos de dev (~4 MB) | Limpeza; recuperável via git | Auditoria | P2 | 404 confirmado pós-deploy |
| 2026-09-15 18:40 | scripts/link_checker.py | Checker SIMULADO substituído por verificador real (HEAD/GET; não-verificável = skipped, nunca ok) | Automação não pode fingir verificação | Auditoria | P1 | Sandbox: 20 ok / 1 broken / 23 skipped |
| 2026-09-15 18:40 | .github/workflows/link-audit.yml | Auditoria diária de links (9h BRT) com relatório commitado | Rotina diária | Hermes | P2 | OK |
| 2026-09-15 19:00 | scripts/events_status.py + events-status.yml | Status temporal de eventos recalculado diariamente (6h BRT): PROXIMO/EM_ANDAMENTO/ENCERRADO. Data inválida → PRESERVA. Nunca cria eventos | Consciência temporal automática | Hermes | P1 | Testado: transições e fail-safe de data inválida |
| 2026-09-15 19:10 | surf-news.js | Guard anti-colisão: se ASF_NEWS (guias evergreen do index.html) já renderizou o container, surf-news.js não sobrescreve | Dois sistemas escreviam no mesmo #surf-news-container; QA no navegador detectou | QA navegador | P1 | ASF_NEWS classificado como EVERGREEN legítimo (guias: prancha, maré, wax, segurança) — PRESERVADO |

## Classificação editorial (resumo)
- **ASF_NEWS (index.html)**: 10 guias EVERGREEN (prancha, alongamento, maré, lycra sustentável, wipeout, surf feminino, wax, surf terapêutico, praias SP, swell) — conteúdo editorial legítimo, preservado. Sugestão futura: rotular como "Guia" em vez de "Notícia" e revisar datas 2025-05.
- **SURF_NEWS (surf-news.js)**: notícias temporais — exige fonte verificável; hoje vazio (itens antigos sem fonte).
- **ASF_BRANDS_DATA (index.html)**: demonstrativo (marcado no site). Destino final = decisão humana.
- **data/events.json**: temporal, com status automático diário.

## Notas sobre prospecção (docs/brand-*)
- Não publicados; docs/ bloqueado no robots.txt. E-mails são contatos públicos (SAC/B2B).
- ⚠️ Claim "500+ mulheres surfistas" NÃO verificado — corrigir antes de enviar. Smart Fit duplicado em brand-emails.json.
- Envio de propostas = decisão humana (não automatizar).

## QA real em navegador (2026-09-15, browser automation)
- ✅ Banner "Conteúdo demonstrativo" visível na vitrine de marcas
- ✅ Eventos: "Nenhum evento futuro confirmado" + Histórico (3 encerrados)
- ✅ Console sem erros críticos; layout sem quebras visuais
- ✅ Seção News exibe os guias evergreen (após correção da colisão)

## Pendências (controle humano)
- [ ] Destino da vitrine de marcas/cupons.
- [ ] Novo formulário de cadastro ou WhatsApp como canal oficial.
- [ ] Fontes oficiais de notícias (SPSurf, WSL, ISA) para SURF_NEWS.
- [ ] Corrigir claim "500+ surfistas" e duplicidade Smart Fit em docs/brand-emails.json.
- [ ] Instagram/TikTok: checagem manual ocasional (rate-limit impede automação).
- [ ] Incorporar hotfixes diretamente no index.html quando houver edição humana (remover injectors de surf-news.js depois).
