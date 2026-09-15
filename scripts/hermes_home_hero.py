#!/usr/bin/env python3
# MISSÃO HERMES — Home: hero responde 'o que é / para quem / o que fazer' e
# conecta a Home aos novos guias editoriais. Substituições exatas e idempotentes.
import io, sys

TARGET = 'index.html'
with io.open(TARGET, encoding='utf-8') as f:
    src = f.read()
original = src

OLD_P = '<p>Dicas, comunidade, surftrips e muito mais. Juntas somos mais fortes!</p>'
NEW_P = ('<p>A comunidade digital das mulheres que surfam no Brasil: aprenda, evolua, '
         'encontre manas e descubra as melhores praias — do primeiro banho de mar ao free surf. '
         'Juntas somos mais fortes!</p>')
if OLD_P in src:
    src = src.replace(OLD_P, NEW_P, 1)
    print('✅ proposta de valor atualizada')
else:
    print('ℹ️ parágrafo do hero já atualizado')

ANCHOR = ("            <button class=\"btn btn-secondary\" onclick=\"showSection('comunidade')\">\n"
          "                👥 Comunidade\n"
          "            </button>\n"
          "        </div>")
NEW_CTA = ("            <button class=\"btn btn-secondary\" onclick=\"showSection('comunidade')\">\n"
           "                👥 Comunidade\n"
           "            </button>\n"
           "            <a class=\"btn btn-secondary\" href=\"aprender/como-comecar-a-surfar-mulheres.html\" "
           "style=\"display:inline-flex;align-items:center;text-decoration:none;\">\n"
           "                📖 Guia: como começar\n"
           "            </a>\n"
           "        </div>")
if ANCHOR in src:
    src = src.replace(ANCHOR, NEW_CTA, 1)
    print('✅ CTA editorial adicionado ao hero')
else:
    print('ℹ️ CTA editorial já presente ou estrutura alterada')

if src != original:
    with io.open(TARGET, 'w', encoding='utf-8') as f:
        f.write(src)
    print('💾 index.html atualizado')
    # sanity: styles balanceados
    assert src.count('<style') == src.count('</style>'), 'styles desbalanceados'
    print('✅ sanity check ok')
else:
    print('ℹ️ sem alterações')
