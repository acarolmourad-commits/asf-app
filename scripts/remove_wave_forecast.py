#!/usr/bin/env python3
# Limpeza e integração da página principal (index.html):
# 1) Remove seções migradas para apps dedicados
# 2) Redireciona cliques da home para os apps relacionados
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
    # Botão/aba Ondas -> app Previsão de Ondas
    ('onclick="showSection(\'surf-conditions\')"',
     'onclick="location.href=\'previsao-surf/\'"', 'Ondas -> previsao-surf'),
    # Botão Marés -> app Guia de Marés
    ('onclick="showSection(\'utilities\');setTimeout(function(){var el=document.getElementById(\'card-mare\');if(el)el.scrollIntoView({behavior:\'smooth\',block:\'start\'});},80)"',
     'onclick="location.href=\'mareas/\'"', 'Marés -> mareas'),
    # Botão Calculadora -> app Prancha Ideal
    ('onclick="showSection(\'utilities\');setTimeout(function(){var el=document.getElementById(\'card-calc\');if(el)el.scrollIntoView({behavior:\'smooth\',block:\'start\'});},80)"',
     'onclick="location.href=\'prancha-ideal/\'"', 'Calculadora -> prancha-ideal'),
    # Aba Quiz -> app Quiz do Surf
    ('aria-controls="quiz" onclick="showSection(\'quiz\')"',
     'aria-controls="quiz" onclick="location.href=\'quiz/\'"', 'Quiz -> quiz'),
    # Aba Trips -> app Surf Trip Planner
    ('aria-controls="trips" onclick="showSection(\'trips\')"',
     'aria-controls="trips" onclick="location.href=\'surf-trip/\'"', 'Trips -> surf-trip'),
]

for old, new, label in LINKS:
    cnt = src.count(old)
    if cnt:
        src = src.replace(old, new)
        print(f'✅ Link: {label} ({cnt} ocorrência(s)).')
    else:
        print(f'⚠️ Link não encontrado: {label} (ok se já aplicado).')

if src != original:
    with io.open(TARGET, 'w', encoding='utf-8') as f:
        f.write(src)
    print(f'📮 index.html atualizado: {len(original)} -> {len(src)} chars')
else:
    print('⚠️ Nenhuma alteração necessária.')
