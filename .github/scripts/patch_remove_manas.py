#!/usr/bin/env python3
import re
t = open('index.html', encoding='utf-8').read()
orig = t

t = t.replace('        <!-- Manas Section - WhatsApp Groups -->\n        \n', '')

m = re.search(r'<div class="section" id="manas">[\s\S]*?(?=<!-- Utilities Section -->)', t)
assert m, 'seção manas não encontrada'
removido = m.group(0)
t = t.replace(removido, '')

for bad in ['id="manas"', 'Grupos em formação', 'lista de interesse', 'Surftrip com as amigas',
            'Comunidade em formação', 'Bertioga Surf Girls', 'barca com as manas']:
    assert bad not in t, f'restante: {bad}'
assert 'id="utilities"' in t and 'id="comunidade"' in t, 'seções vizinhas afetadas!'
co = len(re.findall(r'<div\b', t)); cc = len(re.findall(r'</div>', t))
print('divs:', co, cc, '| removidos', len(removido), 'bytes')
open('index.html', 'w', encoding='utf-8').write(t)
print('OK', len(orig), '->', len(t))
