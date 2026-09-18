#!/usr/bin/env python3
# Remove referências restantes à seção de Previsão de Ondas da home:
# - menção no card de boas-vindas
# - entradas de tradução i18n não utilizadas
# - notificação que aponta para a âncora #wave-forecast (removida)
import io, sys

TARGET = 'index.html'

with io.open(TARGET, encoding='utf-8') as f:
    lines = f.readlines()

out = []
removed = 0
for line in lines:
    if "'Previsão de Ondas':" in line:
        removed += 1
        continue
    if "target: 'wave-forecast'" in line:
        removed += 1
        continue
    out.append(line)

src = ''.join(out)
new = src.replace('🌊 Previsão de ondas • 💪 Treinos', '💪 Treinos')
if new != src:
    removed += 1

if removed == 0:
    print('⚠️ Nada a remover (talvez já limpo).')
    sys.exit(0)

with io.open(TARGET, 'w', encoding='utf-8') as f:
    f.write(new)

print(f'✅ {removed} referências removidas do index.html')
