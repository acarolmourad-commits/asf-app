#!/usr/bin/env python3
"""
One-shot (Fase conteudo): remove promessa de premio falso ("R$500 em produtos")
do showBrandChallenge() em app.js, alinhando ao texto honesto ja presente no index.html.
app.js e defer e sobrescreve a versao inline — era ela que aparecia para a usuaria.
Idempotente.
"""
import sys

with open("app.js", encoding="utf-8") as f:
    s = f.read()

OLD = ("alert('🏆 DESAFIO DA SEMANA\\n\\n📸 Tema: \"Melhor foto com prancha na praia\"\\n"
       "🏅 Prêmio: R$500 em produtos\\n📅 Prazo: 7 dias\\n\\nComo participar:\\n"
       "1. Tire sua foto\\n2. Poste no Instagram marcando @associacaosurffeminino\\n"
       "3. Use #ASFChallenge\\n4. Compartilhe no app!\\n\\nBoa sorte! 🏄‍♀️');")
NEW = ("showToast('🏆 CAMPANHAS ESPECIAIS ASF\\n\\nNenhuma campanha ativa no momento.\\n\\n"
       "Quando houver, será uma campanha pontual com brinde ou experiência oferecida por uma "
       "marca parceira — sempre com condições, período e regras de participação publicados "
       "aqui e no Instagram @associacaosurffeminino.\\n\\nA ASF não realiza sorteios mensais "
       "permanentes. 💙');")

if OLD not in s:
    if "R$500" not in s:
        print("Nada a corrigir (ja alinhado)")
        sys.exit(0)
    print("ERRO: bloco esperado nao encontrado, mas R$500 ainda presente")
    sys.exit(2)

s = s.replace(OLD, NEW)
assert "R$500" not in s
with open("app.js", "w", encoding="utf-8") as f:
    f.write(s)
print("OK: showBrandChallenge() em app.js alinhado (premio falso removido)")
