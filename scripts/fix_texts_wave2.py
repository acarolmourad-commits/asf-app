# ASF - Patch onda 2: acentuacao dos textos visiveis restantes
# (dicas rotativas, descricoes de praias, respostas do ManaBot, guias)
# Chaves JS (category, cat, q:[...], ids) sao preservadas propositalmente.

src = open('index.html', encoding='utf-8').read()

reps = [
    # --- Dicas rotativas (texto visivel; category key mantida) ---
    ("🛡️ Seguranca surf:", "🛡️ Segurança surf:"),
    ("🚨 Seguranca costa:", "🚨 Segurança costa:"),
    ("⚠️ Seguranca mar:", "⚠️ Segurança mar:"),
    ("🥤 Nutricao onda:", "🥤 Nutrição onda:"),
    ("🐟 Nutricao mar:", "🐟 Nutrição mar:"),
    ("🥗 Alimentacao surf:", "🥗 Alimentação surf:"),
    ("🌊 Alimentacao costa:", "🌊 Alimentação costa:"),
    ("🥤 Alimentacao mar:", "🥤 Alimentação mar:"),
    ("Use respiracao ritmica para recuperacao entre series",
     "Use respiração rítmica para recuperação entre séries"),
    # --- Descricoes de seguranca das praias (valores visiveis) ---
    ("descSeguranca:'Area segura durante todo o dia com iluminacao noturna'",
     "descSeguranca:'Área segura durante todo o dia com iluminação noturna'"),
    ("descSeguranca:'Policia militar no verao + salva-vidas fixo'",
     "descSeguranca:'Polícia militar no verão + salva-vidas fixo'"),
    ("descSeguranca:'Regiao afastada - va em grupo, avise alguem'",
     "descSeguranca:'Região afastada - vá em grupo, avise alguém'"),
    ("descSeguranca:'Area urbana iluminada e movimentada'",
     "descSeguranca:'Área urbana iluminada e movimentada'"),
    ("descSeguranca:'Ambiente familiar, frequentada por familias'",
     "descSeguranca:'Ambiente familiar, frequentada por famílias'"),
    ("descSeguranca:'Um dos pontos mais seguros do Guaruja'",
     "descSeguranca:'Um dos pontos mais seguros do Guarujá'"),
    ("descSeguranca:'Ambiente calmo — ideal para sessoes focadas'",
     "descSeguranca:'Ambiente calmo — ideal para sessões focadas'"),
    ("descSeguranca:'Infraestrutura completa — referencia em Florianopolis'",
     "descSeguranca:'Infraestrutura completa — referência em Florianópolis'"),
    ("horarioSeguro:'Todo horario'", "horarioSeguro:'Todo horário'"),
    ("nome:'Guaruja Centro'", "nome:'Guarujá Centro'"),
    # --- Respostas do ManaBot (keywords q:[...] mantidas sem acento) ---
    ("Melhor horario geral: 6h-10h.", "Melhor horário geral: 6h-10h."),
    ("mais fraco pela manha.", "mais fraco pela manhã."),
    ("As ondas tambem estao mais limpas e o mar esta mais vazio.",
     "As ondas também estão mais limpas e o mar está mais vazio."),
    ("Nao tenho essa informacao ainda!", "Não tenho essa informação ainda!"),
    ("prancha, horario, wax, swell, wetsuit, evento, alimentacao ou condicao de ondas. Usa o botao",
     "prancha, horário, wax, swell, wetsuit, evento, alimentação ou condição de ondas. Usa o botão"),
    ("mais estavel nos primeiros swells.", "mais estável nos primeiros swells."),
    ("Condicoes perfeitas: Swell", "Condições perfeitas: Swell"),
    ("Qual cor de wax usar no verao?", "Qual cor de wax usar no verão?"),
    ("Amarela: 22-28C (verao brasileiro)", "Amarela: 22-28C (verão brasileiro)"),
    ("Parafina amarela para agua de 22-28C (verao SP)",
     "Parafina amarela para água de 22-28C (verão SP)"),
    ("Maresias e perfeita para nivel intermediario. Tombo e Guaruja Centro tem ondas consistentes para todos os niveis!",
     "Maresias é perfeita para nível intermediário. Tombo e Guarujá Centro têm ondas consistentes para todos os níveis!"),
    # --- Conteudo ASF / guias ---
    ("Guias ASF - Conteudo editorial", "Guias ASF - Conteúdo editorial"),
    ("Leia seu primeiro artigo de Conteudo", "Leia seu primeiro artigo de Conteúdo"),
    ("Tecnicas de visualizacao e respiracao usadas por atletas profissionais.",
     "Técnicas de visualização e respiração usadas por atletas profissionais."),
    ("Guia de alimentacao para energia maxima nas sessoes e recuperacao rapida.",
     "Guia de alimentação para energia máxima nas sessões e recuperação rápida."),
    ("Funboard perfeita para comecar — volume alto e estavel",
     "Funboard perfeita para começar — volume alto e estável"),
]

total = 0
for old, new in reps:
    n = src.count(old)
    assert n >= 1, f'Trecho nao encontrado: {old[:70]}'
    src = src.replace(old, new)
    total += n
    print(f'OK ({n}x): {old[:70]}')

open('index.html', 'w', encoding='utf-8').write(src)
print(f'Total: {total} substituicoes aplicadas em index.html')
