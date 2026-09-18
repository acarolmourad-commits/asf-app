#!/usr/bin/env python3
# Remove a seção "Previsão de Ondas - Litoral Paulista" da página principal
# e a menção "🌊 Previsão de ondas" do card de boas-vindas,
# pois as previsões já têm app dedicado (previsao-surf / Surf Day Check).
import io, re, sys

TARGET = 'index.html'

with io.open(TARGET, encoding='utf-8') as f:
    src = f.read()

original = src

# 1) Remove bloco completo da seção Wave Forecast
pattern = re.compile(
    r'\n?[ \t]*<!-- Wave Forecast -->.*?<!-- End Wave Forecast -->\n?',
    re.DOTALL,
)
src, n = pattern.subn('\n', src)
if n:
    print(f'✅ Seção Wave Forecast removida ({n} bloco).')
else:
    print('⚠️ Seção Wave Forecast não encontrada (talvez já removida).')

# 2) Remove menção no card de boas-vindas
welcome_old = '🌊 Previsão de ondas • 💪 Treinos • 📚 Dicas • 💬 Grupos'
welcome_new = '💪 Treinos • 📚 Dicas • 💬 Grupos'
if welcome_old in src:
    src = src.replace(welcome_old, welcome_new)
    print('✅ Menção no card de boas-vindas removida.')
else:
    print('⚠️ Menção de boas-vindas não encontrada (ok se já removida).')

if src != original:
    with io.open(TARGET, 'w', encoding='utf-8') as f:
        f.write(src)
    print(f'📮 index.html atualizado: {len(original)} -> {len(src)} chars')
else:
    print('⚠️ Nenhuma alteração necessária.')
