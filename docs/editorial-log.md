# 📓 Registro Editorial ASF

Toda alteração editorial automatizada é registrada aqui. Rollback via histórico de commits do Git.

| Data/Hora (UTC) | Arquivo | Alteração | Motivo | Fonte | Prioridade | QA |
|---|---|---|---|---|---|---|
| 2026-09-15 17:20 | surf-news.js | 7 itens de news movidos para SURF_NEWS_LEGACY (não renderizados) | Notícias sem fonte confirmável — regra anti-conteúdo-fake | Auditoria Hermes | P0 | OK |
| 2026-09-15 17:20 | index.html (via injector) | Aviso "Conteúdo demonstrativo" na vitrine de Marcas Parceiras | Cupons/parcerias sem convênio confirmado | Auditoria Hermes | P0 | Confirmado em QA de navegador |
| 2026-09-15 17:20 | data/events.json | `status` + `ultima_atualizacao` nos 3 eventos encerrados | Consciência temporal | spsurf.com.br | P1 | QA navegador: histórico com 3 ✅ |
| 2026-09-15 17:20 | sitemap.xml | lastmod → 2026-09-15 | SEO | Auditoria | P3 | OK |
| 2026-09-15 17:50 | index.html (via hotfix) | Forms 404 → WhatsApp oficial; checkout placeholder → número oficial | Links/número quebrados | Auditoria de links | P1 | 404 confirmado por GET |
| 2026-09-15 17:50 | 12 arquivos deletados | Resíduos de dev (~4 MB) | Limpeza; recuperável via git | Auditoria | P2 | 404 confirmado pós-deploy |
| 2026-09-15 18:40 | scripts/link_checker.py | Checker SIMULADO substituído por verificador real | Automação não pode fingir verificação | Auditoria | P1 | Sandbox: 20 ok / 1 broken / 23 skipped |
| 2026-09-15 18:40 | .github/workflows/link-audit.yml | Auditoria diária de links (9h BRT) | Rotina diária | Hermes | P2 | Run #35010346787: success |
| 2026-09-15 19:00 | scripts/events_status.py + events-status.yml | Status temporal diário (6h BRT); data inválida → preserva | Consciência temporal automática | Hermes | P1 | Run #35010346722: success |
| 2026-09-15 19:10 | surf-news.js | Guard anti-colisão com ASF_NEWS (evergreen) | Dois sistemas no mesmo container | QA navegador | P1 | ASF_NEWS preservado |
| 2026-09-15 19:20 | hermes.html | Painel operacional Hermes (noindex) | Item 25 (dashboard) | Hermes | P2 | 200 em produção |
| 2026-09-15 19:20 | sessoes-interativas.html | Meta description + canonical; contadores falsos → "exemplo"; selo "demonstração" | Regra 27 | Auditoria | P1 | Validado em produção |
| 2026-09-15 20:10 | asf-enhancements.css (novo) + surf-news.js | Camada de design: bottom nav com safe-area + blur, estado ativo destacado, back-to-top flutuante, foco visível acessível, reduced-motion, hover suave em cards, transição fade ao trocar de seção. O loader já existente em surf-news.js referenciava asf-enhancements.css que NÃO existia (404 silencioso) — agora existe | Pedido do usuário: melhorar layout/design/navegação. Aditivo, sem alterar identidade visual | Usuário | P3 | QA navegador: CSS carrega ✅, back-to-top ✅, nav ✅, 0 erros console ✅. Análise de coordenadas do agente reportou "overlaps" — falsos positivos de nav fixa; nenhuma regra nova altera posicionamento. Monitorar. |

## Classificação editorial (resumo)
- **ASF_NEWS (index.html)**: 10 guias EVERGREEN legítimos — preservados.
- **SURF_NEWS (surf-news.js)**: temporal, exige fonte; hoje vazio.
- **ASF_BRANDS_DATA (index.html)**: demonstrativo (marcado no site). Destino final = decisão humana.
- **sessoes-interativas.html**: salas/mensagens = demonstração rotulada.
- **data/events.json**: temporal com status automático diário.

## Notas sobre prospecção (docs/brand-*)
- Não publicados; docs/ bloqueado no robots.txt.
- ⚠️ Claim "500+ mulheres surfistas" NÃO verificado — corrigir antes de enviar. Smart Fit duplicado.
- Envio de propostas = decisão humana.

## Pendências (controle humano)
- [ ] Destino da vitrine de marcas/cupons.
- [ ] Novo formulário de cadastro ou WhatsApp como canal oficial.
- [ ] Fontes oficiais de notícias (SPSurf, WSL, ISA) para SURF_NEWS.
- [ ] Corrigir claim "500+ surfistas" e duplicidade Smart Fit em docs/brand-emails.json.
- [ ] Instagram/TikTok: checagem manual ocasional.
- [ ] Incorporar hotfixes e a camada asf-enhancements.css diretamente no index.html na próxima edição humana (e remover injectors de surf-news.js).
