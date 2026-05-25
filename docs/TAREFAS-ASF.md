# 🎯 Tarefas ASF App — Priorização Completa
_Atualizado em: 2026-05-23_ | _Repo: `acarolmourad-commits/asf-app`_

---

## 📊 Diagnóstico Rápido

| Item | Status |
|---|---|
| Módulos `ASF_*` definidos | ✅ 19 detectados |
| `<script>` balanceados | ✅ 15/15 |
| Seções `section[]` | 37 (6 ocultas, 31 auto/block) |
| Total `onclick` | ~316 |
| `dicas[]` no array | ~3,642 |
| GA4 placeholder | ❌ `G-XXXXXXXXXX` ainda lá |
| `//` comentários soltos | ⚠️ 232 linhas expostas no HTML |
| Bugs restantes | 4 categorias |

---

## 🔴 BUGS CRÍTICOS — Imediato (Carol)

### [BUG-1] GA4 placeholder no código
- **Severidade:** Crítico/SEO
- **O que:** `G-XXXXXXXXXX` em `gtag('config', 'G-XXXXXXXXXX', { ... })`
- **Impacto:** Não coleta dados do Google Analytics. Analítica morta.
- **Fix:** Trocar por ID real do GA4 do `asf.surffeminino@gmail.com`
- **Como:** Criar propriedade no [GA4](https://analytics.google.com/analytics/web/) → copiar ID → substituir no código
- **Tempo:** 5 min

### [BUG-6] Favicon genérico / ausente
- **Severidade:** Médio/SEO
- **O que:** Sem favicon `.ico` customizado ASF no `<head>`
- **Impacto:** Sem identidade visual na aba, SEO prejudicado
- **Fix:** Adicionar `<link rel="icon" href="assets/favicon.ico">` no `<head>`
- **Tempo:** 5 min — precisa de tu criar o favicon primeiro

### [BUG-7] Aspas simples quebram dicas
- **Severidade:** Alto
- **O que:** Dicas com `'...'` (aspas simples) dentro de aspas simples quebram o parse do array `dicas[]`
- **Fix:** Migrar dicas afetadas para aspas duplas ou usar template literals
- **Tempo:** 30 min — precisa de script Python para detectar e corrigir

---

## 🟡 BUGS MÉDIOS — Próximo deploy

### [BUG-2] `href="#"` sem `return false` (15 ocorrências)
- **Status:** ⚠️ ainda aberto
- **O que:** Links `<a href="#">` sem `onclick="...;return false"` causam scroll ao topo
- **Links afetados:** "Ver todas →" / "Ver todos →" / "Comp

artilhar" etc.
- **Fix:** Adicionar `return false` em cada `onclick`
- **Responsável:** KiloClaw
- **Tempo:** 5 min

### [BUG-3] Módulos ASF_* não detectados pelo parser
- **Status:** ⚠️ 4 módulos problemáticos
- **O que:** `ASF_SURF_CONDITIONS`, `ASF_BEACHES_FULL`, `ASF_CHALLENGES`, `ASF_SURFER_PROFILE` injetados como string, não como `const`
- **Impacto:** Módulos funcionam no navegador mas o parser de auditoria não os detecta
- **Fix:** Reescrever como `const ASF_… = {` direto no HTML
- **Responsável:** KiloClaw
- **Tempo:** 15 min

### [BUG-5] Google Sheets anchors quebrados
- **Status:** ⚠️ L5614–5617
- **O que:** `<div id="badge-…">` com `onclick` dentro — mas estrutura de navegação usa tags incorretas
- **Fix:** Garantir que todos os `onclick` em divs usem `onclick="…;return false"` se dentro de link
- **Responsável:** KiloClaw
- **Tempo:** 10 min

---

## 🔵 MELHORIAS UX/UI — Esta semana

### [UX-1] Substituir `alert()` → `showToast()`
- **Status:** Pendente
- **O que:** ~27 chamadas `alert("…")` bloqueiam a thread
- **Fix:** Substituir por `showToast("…")` (função já existe no app)
- **Responsável:** KiloClaw
- **Tempo:** 10 min

### [UX-2] Loading states em seções JS-only
- **Seções sem markup inicial visível:**
  - `#surf-conditions` — 160 chars
  - `#loja` — 251 chars
  - `#brandhub` — 776 chars
  - `#surf-news` — 168 chars
  - `#badges` — 820 chars
  - `#metas` — 153 chars
  - `#seguranca` — 218 chars
  - `#surf-culture` — 463 chars
  - `#carteirinha` — 206 chars
- **Fix:** Adicionar skeleton HTML direto (`<p style="text-align:center">⏳ Carregando…</p>`)
- **Responsável:** KiloClaw
- **Tempo:** 20 min

### [UX-3] Lazy-load em imagens
- **Status:** Parcial — `decode="async"` adicionado em algumas
- **Fix:** Adicionar `loading="lazy"` em `<img>` abaixo da dobra
- **Responsável:** KiloClaw
- **Tempo:** 10 min

### [UX-4] Code-split index.html
- **Status:** Não iniciado
- **Fix:** Extrair CSS/JS para arquivos externos: `asf-styles.css`, `asf-app.js`, `asf-quiz.js`, `asf-gamification.js`
- **Responsável:** KiloClaw
- **Tempo:** 2–3h | **Prioridade:** Baixa (funciona, gargalo de perf)

---

## 📝 CONTEÚDO — Carol (delegado)

### [CON-1] GA4 — tracking real ver BUG-1 acima

### [CON-2] Infolinks — Monetização por anúncios
- **Site:** [infolinks.net](https://www.infolinks.com/)
- **Faça:** Cadastrar `acarolmourad-commits.github.io` → pegar `<script>` embed → inserir no comentário `<!-- INLINKS ADS HERE -->`
- **Tempo:** 10 min

### [CON-3] Ebook PDF + Checkout
- **Status:** Landing page pronta; faltam PDF + gateway de pagamento
- **Faça:** Upload PDF em `docs/ebooks/guia-definitivo-surf.pdf` + ativar Stripe/PagSeguro na checkout page
- **Tempo:** 30–60 min

### [CON-4] Pix Donation — Testar modal
- **Chave atual:** `asf@asf-surf.org` — validar se é o Pix correto
- **Faça:** Testar modal na aba Premium → substituir chave se necessário
- **Tempo:** 5 min

### [CON-5] Brand Partners — Cadastrar marcas no `ASF_BRANDS_DATA`
- **Pendentes:** Rip Curl, Billabong, Quiksilver, Granado
- **Fix:** Adicionar produtos, preços e cupons no array no código
- **Tempo:** 15 min por marca

### [CON-6] Pix/Newsletter Email Endpoint
- **Status:** Botões funcionam mas sem backend de envio
- **Faça:** Criar endpoint simples (Netlify Functions / Vercel Edge) para enviar emails via `asf.surffeminino@gmail.com`
- **Tempo:** 30–60 min

### [CON-7] Conteúdo — +200 dicas novas (meta 5,000)
- **Atual:** ~3,642 | **Meta:** 5,000
- **Categorias pendentes:** Nutrição, Técnica, Mental, Alongamento, Surf Adaptado, Sustentabilidade
- **Script:** `adicionar_dicas.py` já existe — só rodar com novas dicas
- **Tempo:** 30 min por lote de 50 dicas

### [CON-8] UGC Image Submission — Backend
- **Status:** Frontend funciona (modal + preview) mas arquivos não são enviados
- **Opções:** Supabase Storage (grátis 500MB) · Cloudinary (grátis 25GB) · GitHub issues (temp)
- **Tempo:** 1–2h

---

## 📋 Tarefas Rápidas (5 min cada)

| # | Tarefa | Responsável |
|---|---|---|
| R-1 | Favicon `.ico` customizado ASF no `<head>` | Carol |
| R-2 | Meta description única por seção | Carol |
| R-3 | Open Graph cards (og:image, og:title) | Carol |
| R-4 | Sitemap.xml automatizado | KiloClaw ✅ já commitado |
| R-5 | Robots.txt | Carol |
| R-6 | Substituir cópias de `carol.jpg` por URL real | Carol |
| R-7 | Validar todos `href="#"` internos tem `return false` | KiloClaw |

---

## 🏁 Mapa de Responsabilidades

```
CAROL (8 tarefas)                    KILOCLAW (6 tarefas)
─────────────────────────────────    ─────────────────────────
[BUG-1] GA4 placeholder              [BUG-2] Fix 15x href="#"
[BUG-6] Favicon                      [BUG-3] Rewrite 4 ASF_* consts
[BUG-7] Aspas simples dicas          [BUG-5] Google Sheets anchors
[CON-1] GA4 tracking                 [UX-1] alert() → showToast()
[CON-2] Infolinks embed              [UX-2] Loading states (9 seções)
[CON-3] Ebook PDF + checkout         [UX-3] loading="lazy" images
[CON-4] Pix modal test               [UX-4] code-split (low priority)
[CON-5] Brand Partners array
[CON-7] +200 dicas
[CON-8] UGC backend
[R-1 a R-7] Tarefas rápidas
```

---

_Atualizado em: 2026-05-23 por KiloClaw | Repo: `acarolmourad-commits/asf-app`_
