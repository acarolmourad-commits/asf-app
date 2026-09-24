#!/usr/bin/env python3
"""
ASF Free Content Guard (politica editorial: 100% gratuito)

Garante que o app NAO reintroduza cobranca/paywall/conteudo pago.
Falha (exit 1) se encontrar marcadores de monetizacao por usuario no index.html.
Modelo de sustentacao: parcerias com lojas + doacoes para sorteios, eventos
beneficentes e brindes vinculados a pontuacao da carteirinha (docs/MODELO-SUSTENTACAO.md).
"""
import sys

with open("index.html", encoding="utf-8") as f:
    html = f.read()
low = html.lower()

BANNED = [
    ("id=\"premium-modal\"", "modal premium"),
    ("tornar-se premium", "CTA premium"),
    ("vire premium", "CTA premium"),
    ("r$ 19,90", "preco de assinatura"),
    ("mercado pago", "gateway de pagamento"),
    ("paywall", "paywall"),
    ("conteudo exclusivo para assinantes", "promessa de conteudo pago"),
    ("adsbygoogle", "adsense"),
    ("infolinks", "infolinks"),
]

failed = 0
for marker, label in BANNED:
    if marker in low:
        print("❌ FALHOU: %s (%s) encontrado no index.html" % (label, marker))
        failed += 1
    else:
        print("✅ ausente: %s" % label)

# funcoes legadas existem como stubs vazios (compatibilidade) — ok; mas nao podem cobrar
if "function unlockPremium" in html and "conteúdo liberado para todas" in html:
    print("✅ unlockPremium e stub gratuito (compatibilidade)")

if failed:
    print("\n%d violacao(oes) da politica de conteudo gratuito" % failed)
    sys.exit(1)
print("\n🏄‍♀️ Free Content Guard: OK — app 100% gratuito")
