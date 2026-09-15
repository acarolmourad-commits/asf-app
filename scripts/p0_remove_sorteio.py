#!/usr/bin/env python3
# 🚨 MISSÃO HERMES — P0: Remover promessa inexistente de sorteio mensal de prancha.
# A ASF não possui programa de sorteio mensal. Esta correção remove a informação
# de index.html e valida que nenhum arquivo publicado promete sorteio.
import io, os, re, sys

TARGET = 'index.html'

# Substituições exatas: sorteio -> proposta REAL da ASF (pontos, badges, ranking)
REPLACEMENTS = [
    (
        '🎁 Sorteio mensal de prancha',
        '⭐ Destaque mensal das manas mais ativas'
    ),
    (
        "'4. Todo mês, um sorteio é feito entre manas que surfaram em grupo.',",
        "'4. Todo mês, as manas que mais surfarem em grupo ganham destaque no ranking da comunidade ASF.',"
    ),
    (
        "'5. Prêmios incluem pranchas, aulas, equipamentos e experiências de surf.',",
        "'5. A constância em grupo fortalece vínculos reais e acelera a evolução de cada surfista.',"
    ),
]

with io.open(TARGET, encoding='utf-8') as f:
    src = f.read()

original = src
for old, new in REPLACEMENTS:
    if old in src:
        src = src.replace(old, new)
        print(f'✅ substituído: {old[:60]}')
    else:
        print(f'ℹ️ não encontrado (ok se já removido): {old[:60]}')

if src != original:
    with io.open(TARGET, 'w', encoding='utf-8') as f:
        f.write(src)
    print('💾 index.html atualizado')
else:
    print('ℹ️ index.html sem alterações necessárias')

# Validação: nenhuma promessa de sorteio/prêmio inexistente nos arquivos publicados.
# NOTA: menções editoriais legítimas (ex.: premiação de campeonatos de surf nas
# dicas de busca) não são ofertas da ASF e não são bloqueadas aqui.
PUBLISHED = [
    'index.html', 'index-short.html', 'sessoes-interativas.html',
    'espacos-logo-app.html', 'hermes.html', 'app.js', 'app-posts.js',
    'tips.js', 'surf-calculator.js', 'surf-culture.js', 'surf-goals.js',
    'surf-news.js', 'manifest.json', 'data/events.json', 'sitemap.xml',
]
BANNED = re.compile(
    r'sorteio|pr[êe]mios incluem|ganhe uma prancha|ganhe prancha',
    re.IGNORECASE,
)
violations = []
for path in PUBLISHED:
    if not os.path.exists(path):
        continue
    with io.open(path, encoding='utf-8', errors='ignore') as f:
        for i, line in enumerate(f, 1):
            if BANNED.search(line):
                violations.append(f'{path}:{i}: {line.strip()[:100]}')

if violations:
    print('❌ AINDA HÁ PROMESSAS DE SORTEIO/PRÊMIO INEXISTENTE:')
    print('\n'.join(violations))
    sys.exit(1)
print('✅ Validação P0: nenhuma promessa de sorteio nos arquivos publicados')
