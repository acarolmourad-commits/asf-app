#!/usr/bin/env python3
# Limpeza e integração da página principal (index.html):
# 1) Remove seções migradas para apps dedicados
# 2) Redireciona cliques da home para os apps relacionados
# 3) Oculta widgets dinâmicos alimentados por JS (surf-bar e dica do dia)
import io, re, sys

TARGET = 'index.html'

with io.open(TARGET, encoding='utf-8') as f:
    src = f.read()

original = src

# --- 1) Blocos removidos ---
BLOCKS = [
    ('Wave Forecast', r'\n?[ \t]*<!-- Wave Forecast -->.*?<!-- End Wave Forecast -->\n?'),
    ('Quiz do Dia (Home Card)', r'\n?[ \t]*<!-- Quiz do Dia \(Home Card\) -->.*?\n[ \t]*</div>\n(?=\n)'),
    ('Tip of the Day', r'\n?[ \t]*<!-- Tip of the Day -->.*?<!-- End Tip of the Day -->\n?'),
    ('Feminine Tips Section', r'\n?[ \t]*<!-- Feminine Tips Section -->.*?<!-- End Feminine Tips -->\n?'),
    ('Stats (Dicas/Lojas/Surftrips/Membros)', r'\n?[ \t]*<!-- Stats -->\n[ \t]*<div class="stats">.*?</div>\s*</div>\s*</div>\s*</div>\s*</div>\n'),
]

for name, pat in BLOCKS:
    src, n = re.compile(pat, re.DOTALL).subn('\n', src)
    print(f'✅ {name} removido ({n}).' if n else f'⚠️ {name} não encontrado (ok).')

# Menção no card de boas-vindas
welcome_old = '🌊 Previsão de ondas • 💪 Treinos • 📚 Dicas • 💬 Grupos'
welcome_new = '💪 Treinos • 📚 Dicas • 💬 Grupos'
if welcome_old in src:
    src = src.replace(welcome_old, welcome_new)
    print('✅ Menção no card de boas-vindas removida.')

# --- 2) Links da home -> apps dedicados ---
LINKS = [
    ('onclick="showSection(\'surf-conditions\')"',
     'onclick="location.href=\'previsao-surf/\'"', 'Ondas -> previsao-surf'),
    ('onclick="showSection(\'utilities\');setTimeout(function(){var el=document.getElementById(\'card-mare\');if(el)el.scrollIntoView({behavior:\'smooth\',block:\'start\'});},80)"',
     'onclick="location.href=\'mareas/\'"', 'Marés -> mareas'),
    ('onclick="showSection(\'utilities\');setTimeout(function(){var el=document.getElementById(\'card-calc\');if(el)el.scrollIntoView({behavior:\'smooth\',block:\'start\'});},80)"',
     'onclick="location.href=\'prancha-ideal/\'"', 'Calculadora -> prancha-ideal'),
    ('aria-controls="quiz" onclick="showSection(\'quiz\')"',
     'aria-controls="quiz" onclick="location.href=\'quiz/\'"', 'Quiz -> quiz'),
    ('aria-controls="trips" onclick="showSection(\'trips\')"',
     'aria-controls="trips" onclick="location.href=\'surf-trip/\'"', 'Trips -> surf-trip'),
]

for old, new, label in LINKS:
    cnt = src.count(old)
    if cnt:
        src = src.replace(old, new)
        print(f'✅ Link: {label} ({cnt}).')
    else:
        print(f'⚠️ Link não encontrado: {label} (ok).')

# --- 3) Ocultar widgets dinâmicos (JS continua funcionando sem erro) ---
HIDE = [
    ('<div class="surf-bar" id="surfBar">',
     '<div class="surf-bar" id="surfBar" style="display:none !important">', 'Surf bar (condições ao vivo)'),
    ('<div id="dica-do-dia">',
     '<div id="dica-do-dia" style="display:none !important">', 'Dica do Dia dinâmica'),
    ('<div id="dica-community-section" style="max-width:800px;margin:0 auto 24px;padding:0 16px">',
     '<div id="dica-community-section" style="display:none !important;max-width:800px;margin:0 auto 24px;padding:0 16px">', 'Comentários da Dica do Dia'),
    ('<div id="surf-conditions-wrapper" style="padding:0 16px;max-width:800px;margin:0 auto 12px">',
     '<div id="surf-conditions-wrapper" style="display:none !important;padding:0 16px;max-width:800px;margin:0 auto 12px">', 'Wrapper de condições'),
]

for old, new, label in HIDE:
    if old in src:
        src = src.replace(old, new)
        print(f'✅ Oculto: {label}.')
    else:
        print(f'⚠️ Não encontrado para ocultar: {label} (ok).')

if src != original:
    with io.open(TARGET, 'w', encoding='utf-8') as f:
        f.write(src)
    print(f'📮 index.html atualizado: {len(original)} -> {len(src)} chars')
else:
    print('⚠️ Nenhuma alteração necessária.')
