#!/usr/bin/env python3
# Limpeza da página principal (index.html):
# 1) Seção "Previsão de Ondas - Litoral Paulista" (já existe app dedicado)
# 2) Menção "🌊 Previsão de ondas" do card de boas-vindas
# 3) Card "Quiz do Dia" da home (quiz segue na aba Quiz)
# 4) Card "Dica do Dia" estático (Tip of the Day)
# 5) Seção "Dicas Femininas" da home
import io, re, sys

TARGET = 'index.html'

with io.open(TARGET, encoding='utf-8') as f:
    src = f.read()

original = src

BLOCKS = [
    ('Wave Forecast', r'\n?[ \t]*<!-- Wave Forecast -->.*?<!-- End Wave Forecast -->\n?'),
    ('Quiz do Dia (Home Card)', r'\n?[ \t]*<!-- Quiz do Dia \(Home Card\) -->.*?\n[ \t]*</div>\n(?=\n)'),
    ('Tip of the Day', r'\n?[ \t]*<!-- Tip of the Day -->.*?<!-- End Tip of the Day -->\n?'),
    ('Feminine Tips Section', r'\n?[ \t]*<!-- Feminine Tips Section -->.*?<!-- End Feminine Tips -->\n?'),
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
else:
    print('⚠️ Menção de boas-vindas não encontrada (ok).')

if src != original:
    with io.open(TARGET, 'w', encoding='utf-8') as f:
        f.write(src)
    print(f'📮 index.html atualizado: {len(original)} -> {len(src)} chars')
else:
    print('⚠️ Nenhuma alteração necessária.')
