# Modelo de Sustentação ASF — 100% gratuito para surfistas

**Vigente desde:** 2026-09-24 · **Substitui:** `docs/monetization-Plan.md` (histórico, não vigente)

## Princípio
Todo o conteúdo do ecossistema ASF (app + 52 satélites) é **gratuito** — sem assinatura,
sem paywall, sem plano premium, sem anúncios. O objetivo é maximizar a interação e a
conexão do público feminino com o surf.

## Como o projeto se sustenta
1. **Parcerias com lojas e marcas** — cotas de apoio/patrocínio B2B (ver `asf-patrocinio`),
   sempre "a combinar", nunca cobradas das usuárias.
2. **Doações de parceiras** — destinadas a:
   - 🎁 **Sorteios** para a comunidade
   - 🏄‍♀️ **Eventos pontuais beneficentes**
   - 🎒 **Brindes** vinculados à **pontuação da carteirinha ASF** (asf-clube/asf-ranking)
3. **Cupons e benefícios** negociados para associadas (asf-loja) — desconto, nunca cobrança.

## Enforcement
O workflow `free-content-guard.yml` roda `scripts/test_free_content.py` a cada alteração
no `index.html` e **quebra o build** se marcadores de cobrança/paywall/anúncios
reaparecerem (premium-modal, preço de assinatura, gateway de pagamento, ads etc.).
