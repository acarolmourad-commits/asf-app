#!/usr/bin/env python3
# Remove da página principal:
# 1) Seção "Previsão de Ondas - Litoral Paulista" (já existe app dedicado)
# 2) Menção "🌊 Previsão de ondas" do card de boas-vindas
# 3) Card "Quiz do Dia" da home (quiz segue disponível na aba Quiz)
import io, re, sys

TARGET = 'index.html'

with io.open(TARGET, encoding='utf-8') as f:
    src = f.read()

original = src

# 1) Bloco completo da seção Wave Forecast
pattern = re.compile(
    r'\n?[ \t]*<!-- Wave Forecast -->.*?<!-- End Wave Forecast -->\n?',
    re.DOTALL,
)
src, n = pattern.subn('\n', src)
print(f'✅ Seção Wave Forecast removida ({n}).' if n else '⚠️ Wave Forecast não encontrada (ok).')

# 2) Menção no card de boas-vindas
welcome_old = '🌊 Previsão de ondas • 💪 Treinos • 📚 Dicas • 💬 Grupos'
welcome_new = '💪 Treinos • 📚 Dicas • 💬 Grupos'
if welcome_old in src:
    src = src.replace(welcome_old, welcome_new)
    print('✅ Menção no card de boas-vindas removida.')
else:
    print('⚠️ Menção de boas-vindas não encontrada (ok).')

# 3) Card Quiz do Dia da home
quiz_pattern = re.compile(
    r'\n?[ \t]*<!-- Quiz do Dia \(Home Card\) -->.*?\n[ \t]*</div>\n(?=\n)',
    re.DOTALL,
)
src, nq = quiz_pattern.subn('\n', src)
print(f'✅ Card Quiz do Dia removido ({nq}).' if nq else '⚠️ Card Quiz do Dia não encontrado (ok).')

if src != original:
    with io.open(TARGET, 'w', encoding='utf-8') as f:
        f.write(src)
    print(f'📮 index.html atualizado: {len(original)} -> {len(src)} chars')
else:
    print('⚠️ Nenhuma alteração necessária.')
