#!/usr/bin/env python3
# Remove a seção "Previsão de Ondas - Litoral Paulista" da página principal,
# pois as previsões já têm app dedicado (previsao-surf / Surf Day Check).
import io, re, sys

TARGET = 'index.html'

with io.open(TARGET, encoding='utf-8') as f:
    src = f.read()

pattern = re.compile(
    r'\n?[ \t]*<!-- Wave Forecast -->.*?<!-- End Wave Forecast -->\n?',
    re.DOTALL,
)

new, n = pattern.subn('\n', src)

if n == 0:
    print('⚠️ Seção Wave Forecast não encontrada (talvez já removida).')
    sys.exit(0)

with io.open(TARGET, 'w', encoding='utf-8') as f:
    f.write(new)

print(f'✅ Seção Wave Forecast removida ({n} bloco).')
print(f'   Tamanho: {len(src)} -> {len(new)} chars')
