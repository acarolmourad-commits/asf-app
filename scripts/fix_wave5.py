# ASF - Patch: inclui asf-fixes.js no index.html

src = open('index.html', encoding='utf-8').read()

old = '<script src="carteirinha.js"></script>'
new = '<script src="carteirinha.js"></script>\n<script src="asf-fixes.js"></script>'
assert src.count(old) == 1, 'ancora carteirinha.js nao encontrada'
src = src.replace(old, new)

assert 'asf-fixes.js' in src
open('index.html', 'w', encoding='utf-8').write(src)
print('index.html patcheado: asf-fixes.js adicionado')
