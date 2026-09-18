#!/usr/bin/env python3
# Limpeza e integração da página principal (index.html):
# 1) Remove seções migradas para apps dedicados
# 2) Redireciona cliques da home para os apps relacionados
# 3) Remove a barra de condições ao vivo (surfBar) e o card dinâmico Dica do Dia
# 4) Blinda app.js contra referências aos elementos removidos
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
    ('Stats', r'\n?[ \t]*<!-- Stats -->\n[ \t]*<div class="stats">.*?\n[ \t]*</div>\n(?=\n)'),
    ('Live Surf Conditions', r'\n?[ \t]*<!-- Live Surf Conditions -->\n[ \t]*<div class="surf-bar" id="surfBar".*?</div>\n[ \t]*</div>\n'),
    ('Dica do Dia (dinâmico)', r'\n?[ \t]*<!-- Dica do Dia \(2417\) -->\n[ \t]*<div id="surf-conditions-wrapper".*?</div>\n[ \t]*<div id="dica-do-dia".*?\n[ \t]*</div>\n[ \t]*</div>\n'),
    ('Comentários da Dica', r'\n?[ \t]*<!-- 💬 Comentários da Dica do Dia -->\n[ \t]*<div id="dica-community-section".*?</div>\n'),
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

if src != original:
    with io.open(TARGET, 'w', encoding='utf-8') as f:
        f.write(src)
    print(f'📮 index.html atualizado: {len(original)} -> {len(src)} chars')
else:
    print('⚠️ index.html sem alterações.')

# --- 3) Blindar app.js contra elementos removidos ---
try:
    with io.open('app.js', encoding='utf-8') as f:
        js = f.read()
    js_orig = js
    GUARDS = [
        ("async function loadSurfBar() {\n            const bar = document.getElementById('surfBar');",
         "async function loadSurfBar() {\n            const bar = document.getElementById('surfBar');\n            if (!bar) return;"),
        ("function shareSurfConditions() {\n            const bar = document.getElementById('surfBar');",
         "function shareSurfConditions() {\n            const bar = document.getElementById('surfBar');\n            if (!bar) return;"),
        ("            const container = document.getElementById('dica-do-dia');\n",
         "            const container = document.getElementById('dica-do-dia');\n            if (!container) return;\n"),
        ("            const current = document.getElementById('dica-text').textContent;",
         "            const dicaEl = document.getElementById('dica-text');\n            if (!dicaEl) return;\n            const current = dicaEl.textContent;"),
    ]
    for old, new in GUARDS:
        if new in js:
            continue
        if old in js:
            js = js.replace(old, new)
            print(f'✅ app.js: guarda adicionada ({old.strip()[:50]}...)')
        else:
            print(f'⚠️ app.js: padrão não encontrado ({old.strip()[:50]}...)')
    if js != js_orig:
        with io.open('app.js', 'w', encoding='utf-8') as f:
            f.write(js)
        print('📮 app.js atualizado')
    else:
        print('⚠️ app.js sem alterações.')
except FileNotFoundError:
    print('⚠️ app.js não encontrado.')
