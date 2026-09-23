# -*- coding: utf-8 -*-
"""ASF: adiciona footer com links legais (Privacidade/Cookies/Termos) ao index.html
de um site satelite ASF. Idempotente: nao duplica se ja existir. Nao altera design nem logo."""
import os

FOOTER = ('<footer style="text-align:center;padding:18px 12px;font-size:12px;color:#567;background:transparent">'
          'ASF — Associação de Surf Feminino · '
          '<a href="https://acarolmourad-commits.github.io/asf-app/privacidade.html" style="color:#00A8CC">Privacidade</a> · '
          '<a href="https://acarolmourad-commits.github.io/asf-app/cookies.html" style="color:#00A8CC">Cookies</a> · '
          '<a href="https://acarolmourad-commits.github.io/asf-app/termos-de-uso.html" style="color:#00A8CC">Termos</a>'
          '</footer>')

for name in ('index.html',):
    if not os.path.exists(name):
        print(name + ': nao encontrado')
        continue
    h = open(name, encoding='utf-8').read()
    if 'asf-app/privacidade.html' in h or 'privacidade' in h.lower():
        print(name + ': ja possui link legal, nada a fazer')
        continue
    if '</body>' in h:
        h = h.replace('</body>', FOOTER + '\n</body>', 1)
    else:
        h = h + '\n' + FOOTER + '\n'
    open(name, 'w', encoding='utf-8').write(h)
    print(name + ': footer legal adicionado')
