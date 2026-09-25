#!/usr/bin/env python3
"""
Fix de conteudo falso/enganoso no app ASF (one-shot, idempotente).

1. showBrandChallenge(): removia promessa de premio falso ("R$500 em produtos")
   -> texto honesto de campanhas futuras (index.html inline + app.js).
2. Estatistica estatica "500+ socias" no rodape -> removida (numero nao verificavel).
3. "Manas Proximas" (MOCK_MANAS): perfis ficticios ganham aviso explicito de
   demonstracao nos dois pontos de renderizacao.
"""
import sys

DISCLAIMER = ('<p style="text-align:center;font-size:11px;color:#b0392e;background:#fdecea;'
              'border:1px solid #f5c6cb;border-radius:8px;padding:8px;margin:0 0 12px">'
              '⚠️ Demonstração: perfis fictícios. Perfis reais aparecerão aqui quando o '
              'recurso de comunidade estiver ativo.</p>')

ALERT_OLD = "alert('🏆 DESAFIO DA SEMANA\\n\\n📸 Tema: \"Melhor foto com prancha na praia\"\\n🏅 Prêmio: R$500 em produtos\\n📅 Prazo: 7 dias\\n\\nComo participar:\\n1. Tire sua foto\\n2. Poste no Instagram marcando @associacaosurffeminino\\n3. Use #ASFChallenge\\n4. Compartilhe no app!\\n\\nBoa sorte! 🏄‍♀️');"
ALERT_NEW = "alert('📸 CAMPANHAS ASF\\n\\nAs campanhas com brindes serão anunciadas aqui quando houver parceria ativa. Brindes vêm de doações de lojas parceiras e são vinculados à pontuação da carteirinha ASF — tudo gratuito.\\n\\nAcompanhe o app! 🏄‍♀️');"

ALERT_OLD_JS = "alert(`🏆 DESAFIO DA SEMANA\\n\\n📸 Tema: \"Melhor foto com prancha na praia\"\\n🏅 Prêmio: R$500 em produtos\\n📅 Prazo: 7 dias\\n\\nComo participar:\\n1. Tire sua foto\\n2. Poste no Instagram marcando @associacaosurffeminino\\n3. Use #ASFChallenge\\n4. Compartilhe no app!\\n\\nBoa sorte! 🏄‍♀️`);"
ALERT_NEW_JS = "alert(`📸 CAMPANHAS ASF\\n\\nAs campanhas com brindes serão anunciadas aqui quando houver parceria ativa. Brindes vêm de doações de lojas parceiras e são vinculados à pontuação da carteirinha ASF — tudo gratuito.\\n\\nAcompanhe o app! 🏄‍♀️`);"

STATS_OLD = '                <span>👥 <span id="stat-members">500+</span> sócias</span>\n'

def fix(path, pairs):
    with open(path, encoding="utf-8") as f:
        s = f.read()
    changed = False
    if "Demonstração: perfis fictícios" in s:
        pairs = [p for p in pairs if "aviso de demonstracao" not in p[2]]
    for old, new, label in pairs:
        if old in s:
            s = s.replace(old, new)
            changed = True
            print("OK [%s]: %s" % (path, label))
    if changed:
        with open(path, "w", encoding="utf-8") as f:
            f.write(s)
    return changed

changed = False

changed |= fix("index.html", [
    (ALERT_OLD, ALERT_NEW, "showBrandChallenge sem premio falso"),
    (ALERT_OLD_JS, ALERT_NEW_JS, "showBrandChallenge (template literal) sem premio falso"),
    (STATS_OLD, "", "estatistica estatica '500+ socias' removida"),
    ('<h4 style="color: var(--secondary); margin-bottom: 15px;">📍 Manas mais próximas</h4>',
     DISCLAIMER + '\n                    <h4 style="color: var(--secondary); margin-bottom: 15px;">📍 Manas mais próximas</h4>',
     "aviso de demonstracao em Manas Proximas"),
    ('<h4 style="color: var(--secondary); margin-bottom: 15px;">🏖️ Manas em ${beachNames[beach]}</h4>',
     DISCLAIMER + '\n                <h4 style="color: var(--secondary); margin-bottom: 15px;">🏖️ Manas em ${beachNames[beach]}</h4>',
     "aviso de demonstracao em Manas por praia"),
])

changed |= fix("app.js", [
    (ALERT_OLD, ALERT_NEW, "showBrandChallenge sem premio falso"),
    (ALERT_OLD_JS, ALERT_NEW_JS, "showBrandChallenge (template literal) sem premio falso"),
])

if not changed:
    print("Nada a corrigir (ja aplicado)")
