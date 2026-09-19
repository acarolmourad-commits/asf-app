# ASF - Patch: inclui app.js no index.html
# Sem ele, showSection() nao existe -> nenhuma aba abre (carteirinha etc.)

src = open('index.html', encoding='utf-8').read()

assert 'app.js' not in src, 'app.js ja incluido'
old = '<script src="surf-news.js"></script>'
assert src.count(old) == 1, 'ancora surf-news.js nao encontrada'
src = src.replace(old, '<script src="app.js"></script>\n' + old)

assert '<script src="app.js"></script>' in src
open('index.html', 'w', encoding='utf-8').write(src)
print('index.html patcheado: app.js incluido')
