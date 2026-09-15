#!/usr/bin/env python3
# MISSÃO HERMES — corrige âncoras dos artigos que apontavam para IDs inexistentes
# no app single-page: #quizzes -> #quiz (id real), #bem-estar -> #mobilidade (id real).
import io, os

FILES = [
    'aprender/como-comecar-a-surfar-mulheres.html',
    'aprender/primeira-prancha-de-surf.html',
    'aprender/etiqueta-no-mar.html',
    'praias/melhores-praias-iniciantes-litoral-norte-sp.html',
    'praias/surf-feminino-sao-sebastiao.html',
    'bem-estar/surf-saude-mental-mulheres.html',
]
FIXES = [
    ('index.html#quizzes', 'index.html#quiz'),
    ('index.html#bem-estar', 'index.html#mobilidade'),
]
changed = 0
for path in FILES:
    if not os.path.exists(path):
        print(f'⚠️ ausente: {path}'); continue
    with io.open(path, encoding='utf-8') as f:
        src = f.read()
    orig = src
    for old, new in FIXES:
        src = src.replace(old, new)
    if src != orig:
        with io.open(path, 'w', encoding='utf-8') as f:
            f.write(src)
        changed += 1
        print(f'✅ corrigido: {path}')
    else:
        print(f'ℹ️ ok: {path}')
print(f'{changed} arquivo(s) atualizado(s)')
