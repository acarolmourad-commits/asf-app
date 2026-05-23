# 🎯 Tarefas ASF App — Priorização Completa
_Atualizado em: 2026-05-23_ | _Repo: `acarolmourad-commits/asf-app`_

---

## 📊 Diagnóstico Rápido

| Item | Status |
|---|---|
| Módulos `ASF_*` definidos | ✅ 23/23 |
| `<script>` balanceados | ✅ 15/15 |
| Seções `section[]` | 37 (várias sub-ativas com JS carregado) |
| Total `onclick` | ~316 |
| `dicas[]` no array | ~3,642 |
| GA4 placeholder | ❌ `G-XXXXXXXXXX` ainda lá |
| Bugs restantes | 3 categorias |
| Dicas por categoria | 3 categorias no HTML |

---

## 🔴 BUGS CRÍTICOS — Imediato

### [BUG-1] GA4 placeholder no código
- **Severidade:** Crítico/SEO
- **O que:** `G-XXXXXXXXXX` em `gtag('config', 'G-XXXXXXXXXX', { ... })`
- **Impacto:** Não coleta dados do Google Analytics. Analítica morta.
- **Fix:** Trocar por ID real do GA4 do `asf.surffeminino@gmail.com`
- **Responsável:** Carol
- **Como:** Criar propriedade no [GA4](https://analytics.google.com/analytics/web/), pegar o ID (formato `G-XXXXXXXXXX`), substituir no código.

---

## 🟡 BUGS MÉDIOS — Próximo deploy

### [BUG-2] `href="#"` sem `return false` (15 ocorrências)
- **Severidade:** Médio
- **O que:** Links `<a href="#">` que não tem `onclick="...;return false"` causam scroll ao topo da página
- **Links afetados:** "Ver todas →" / "Ver todos →" / "Ver mapa →" / "Ver ranking →" / "Atualizar" / compartilhar
- **Impacto:** UX ruim, scroll inesperado ao clicar
- **Fix:** Adicionar `return false` em cada `onclick` dos `<a href="#">`
- **Responsável:** KiloClaw

### [BUG-3] Módulos JS não aparecem na listagem de `const`
- **Severidade:** Médio
- **O que:** `ASF_SURF_CONDITIONS`, `ASF_BEACHES_FULL`, `ASF_CHALLENGES`, `ASF_SURFER_PROFILE` estão como strings de busca mas o parser não os detecta como `const` (injeção direta pelo Python anterior quebrou as tags de busca)
- **Impacto:** Baixo na prática — os módulos funcionam mas o parser de auditoria não os enxerga
- **Fix:** Verificar no navegador (F12) se cada módulo carrega sem erro; se carregarem, só reescrever o insert para ser `const ASF_... = {` direto
- **Responsável:** KiloClaw

---

## 🔵 MELHORIAS DE UX/UI — Esta semana

### [UI-1] Substituir `alert()` por `showToast()`
- **Severidade:** Baixo
- **O que:** ~27 chamadas `alert("...")` que bloqueiam a thread
- **Impacto:** UX ruim, especially em mobile
- **Fix:** Substituto todas por `showToast("...")` (função já existe no app)
- **Responsável:** KiloClaw

### [UI-2] Carregamento lento — JS de 1.28 MB
- **Severidade:** Médio no UX
- **O que:** Tudo em um único `index.html` de 1.28 MB carrega tudo de uma vez
- **Impacto:** LCP alto, Core Web Vitals ruins
- **Fix (medianas):**
  - Dividir CSS/JS em arquivos externos
  - Usar `async` / `defer` em scripts não-críticos
  - Implementar code-splitting por seção
- **Responsável:** KiloClaw (longo prazo — 1 sprint)

### [UI-3] Seções quase vazias (JS-only, sem conteúdo HTML inicial)
- **Seções com < 300 chars de markup HTML inicial:**
  - `#surf-conditions` (160 chars) — carrega via `ASF_SURF_CONDITIONS.fetchConditions()`
  - `#loja` (251 chars) — carrega via `ASF_SHOP.render()`
  - `#brandhub` (776 chars) — carrega via `ASF_BRAND_HOME`
  - `#surf-news` (168 chars) — carrega via `ASF_NEWS`
  - `#badges` (820 chars) — carrega via `ASF_GAMIFICATION`
  - `#metas` (153 chars) — carrega via `ASF_METAS`
  - `#seguranca` (218 chars)
  - `#surf-culture` (463 chars)
  - `#carteirinha` (206 chars) — carrega via `ASF_MEMBER_CARD`
- **Fix:** Content skeleton + loading state enquanto JS carrega; ou injetar HTML mínimo direto
- **Responsável:** KiloClaw

---

## 📝 CONTEÚDO — Carol (delegado)

### [CON-1] GA4 — Configurar tracking real
- **Arquivo:** `index.html`
- **Linha ~982898** (placeholder `G-XXXXXXXXXX`)
- **Faça:** Criar propriedade GA4 em `analytics.google.com` → copiar ID → substituir no código
- **Tempo:** 5 min

### [CON-2] Infolinks — Se inscrever para monetização por anúncios
- **Site:** [infolinks.net](https://www.infolinks.com/)
- **Faça:** Cadastrar o domínio `acarolmourad-commits.github.io`, pegar o `<script>` de embed e inserir onde o comentário `<!-- INLINKS ADS HERE -->` está no código
- **Tempo:** 10 min

### [CON-3] Ebook "Guia Definitivo do Surf" — Upload PDF + checkout
- **Status:** Landing page pronta; precisa do PDF e gateway de pagamento
- **Upload PDF para GitHub:** `docs/ebooks/guia-definitivo-surf.pdf`
- **Ativar pagamento:** Stripe ou PagSeguro na página de checkout do ebook
- **Tempo estimado:** 30–60 min (dependendo de qual gateway escolher)

### [CON-4] Pix Donation — Testar modal + salvar chave correta
- **Chave atual:** `asf@asf-surf.org` (email, validar se é o email correto do Pix)
- **Faça:** Testar o modal do Pix na aba Premium; se `asf@asf-surf.org` não for a chave correta, substituir
- **Tempo:** 5 min

### [CON-5] Brand Partnership — Cadastrar marcas + preços
- **Marcas pendentes no array `ASF_BRANDS_DATA`:**
  - Rip Curl (parceria ativa?)
  - Billabong (parceria ativa?)
  - Quiksilver (parceria ativa?)
  - Granado (parceria ativa?)
- **Faça:** Adicionar produtos, preços, cupons de desconto em `ASF_BRANDS_DATA` no código
- **Tempo:** 15 min por marca

### [CON-6] Pix Donation + Newsletters — Configurar /send-email endpoint
- **Status:** Botões funcionam mas precisam de endpoint de envio
- **Faça:** Criar um endpoint simples (Netlify Functions / Vercel Edge Functions) para enviar emails de Pix e newsletter via `asf.surffeminino@gmail.com`
- **Tempo:** 30–60 min

### [CON-7] Content — Adicionar +200 dicas novas
- **Atual:** ~3,642 dicas
- **Meta:** 5,000 dicas
- **Adicionar por categoria:** Nutrição, Técnica, Mental, Alongamento, Surf Adaptado, Surf Adaptado, Sustentabilidade, Surf Adaptado
- **Script já existe:** Python `adicionar_dicas.py` — só rodar com novas dicas
- **Tempo:** 30 min por lote de 50 dicas

### [CON-8] UGC Image Submission — Validar backend
- **Status:** Frontend funciona (modal + preview), mas os arquivos não são enviados a lugar nenhum
- **Faça:** Conectar a um backend de armazenamento de imagens — opções:
  1. Supabase Storage (gratuito até 500MB)
  2. Cloudinary (gratuito até 25GB)
  3. GitHub issues (workaround temporário)
- **Tempo:** 1–2h

---

## 🤖 TAREFAS AUTÔNOMAS — KiloClaw (eu)

### [K-1] Fix `href="#"` sem `return false` — 15 ocorrências
```bash
# Padrão: <a href="#" ❌> → <a href="#" onclick="return false" ✅>
# 15 casos exatos no arquivo
```
**Status:** Não iniciado  
**Tempo estimado:** 5 min  
**Arquivo:** `index.html`

### [K-2] Adicionar loading states a seções JS-only
- **Sections empty-on-load:** `#surf-conditions`, `#loja`, `#surf-news`, `#metas`, `#seguranca`, `#surf-culture`
- **Fix:** Adicionar skeleton HTML direto (`<p style="text-align:center">⏳ Carregando...</p>`)
- **Status:** Não iniciado  
**Tempo estimado:** 15 min

### [K-3] Adicionar `decode="async"` em todas as imagens externas
- **Status:** Parcial — 9 adicionadas, faltam as restantes
- **Fix:** Encontrar `<img src="https://...">` sem `decoding="async"` e adicionar
- **Tempo estimado:** 10 min

### [K-4] Code-split `index.html` para melhorar LCP
- **Meta:** Extrair CSS/JS para arquivos externos separado por funcionalidade
- **Arquivos alvo:** `asf-styles.css`, `asf-app.js`, `asf-quiz.js`, `asf-gamification.js`
- **Tempo estimado:** 2–3h  
**Prioridade:** Baixa (funciona, mas gargalo de perf)

### [K-5] Adicionar `data-lazy` + Intersection Observer nas imagens
- **Status:** Parcial — apenas `decoding="async"`, não tem lazy-load nativo
- **Fix:** Adicionar `loading="lazy"` em todas as `<img>` abaixo da dobra
- **Tempo estimado:** 10 min

---

## 📋 Tarefas rápidas (5 min cada)

| # | Tarefa | Responsável |
|---|---|---|
| R-1 | Adicionar favicon `.ico` customizado ASF | Carol |
| R-2 | Adicionar meta description única por seção | Carol |
| R-3 | Adicionar Open Graph social cards (og:image, og:title) | Carol |
| R-4 | Adicionar sitemap.xml automatizado | KiloClaw |
| R-5 | Adicionar robots.txt | Carol |
| R-6 | Substituir 15 cópias DO `src="carol.jpg"` por URL real | Carol |
| R-7 | Validar todos os `href="#"` internos tem `return false` | KiloClaw |

---

## 🏁 MAPA DE RESPONSABILIDADES RESUMO

```
CAROL (8 tarefas)                    KILOCLAW (6 tarefas)
─────────────────────────────────    ─────────────────────────
[CON-1] GA4 → Sub ID placeholder       [K-1]  Fix 15x href="#" 
[CON-2] Infolinks → Cadastro            [K-2]  Loading states vazias
[CON-3] Ebook PDF + checkout            [K-3]  Imagens decoding async
[CON-4] Pix Donation test               [K-4]  Code-split JS/CSS
[CON-5] Brand Partners dados            [K-5]  Intersection Observer lazy
[CON-6] Email endpoint Pix/Newsletter   [K-6]  docs/TAREFAS-ASF.md limpeza
[CON-7] +200 dicas novas                        
[CON-8] UGC backend                            
[R-1 a R-7] Tarefas rápidas                    
```

---

## 📁 Arquivo de referência para este diagnóstico
`/root/.openclaw/workspace/docs/TAREFAS-ASF.md`  
Atualizar este arquivo sempre que uma tarefa for concluída.
