# -*- coding: utf-8 -*-
"""ASF editorial fix: remove numero nao verificavel do card do Calendario WSL no index.html.
Preserva a informacao real do evento. Idempotente."""
p = 'index.html'
h = open(p, encoding='utf-8').read()
old = '<div style="font-size: 13px;">\U0001f3c4\u200d\u2640\ufe0f 48 mulheres competindo por vagas na elite mundial</div>'
new = '<div style="font-size: 13px;">\U0001f3c4\u200d\u2640\ufe0f Etapa do Challenger Series com as surfistas do circuito mundial</div>'
if old in h:
    open(p, 'w', encoding='utf-8').write(h.replace(old, new))
    print('Card WSL reformulado (numero nao verificavel removido)')
else:
    print('Nada a corrigir.')