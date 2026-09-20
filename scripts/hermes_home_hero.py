#!/usr/bin/env python3
# MISSÃO HERMES — Home: hero responde 'o que é / para quem / o que fazer' e
# conecta a Home aos novos guias editoriais. Substituições exatas e idempotentes.
# UPDATE 3: remove TODAS as imagens do hero da home (banner + emoji fundadora).
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

# --- Remover banner hero-surf.jpg da home ---
BANNER = ('        <img loading="lazy" src="assets/images/hero-surf.jpg" '
          'alt="Surfista feminina em ação no mar - ASF" '
          'style="width:100%; border-radius:12px; margin-top:12px; object-fit:cover; max-height:150px;" '
          'decoding="async">')
if BANNER in src:
    src = src.replace(BANNER, '', 1)
    print('✅ banner hero-surf removido da home')
else:
    print('ℹ️ banner hero-surf já removido ou estrutura alterada')

# --- Remover imagem emoji da fundadora do hero (string exata, sem regex) ---
EMOJI = ('        <img loading="lazy" src="data:image/svg+xml,%3Csvg xmlns='
         "'http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E"
         "%3Ccircle cx='40' cy='40' r='38' fill='%2300A8CC'/%3E"
         "%3Ctext x='40' y='56' text-anchor='middle' font-size='36'%3E🏄‍♀️%3C/text%3E%3C/svg%3E"
         '" alt="Fundadora ASF" style="width:80px; height:80px; border-radius:50%; '
         'margin-top:12px; object-fit:cover; border: 3px solid white; '
         'box-shadow: 0 4px 12px rgba(0,0,0,0.2);" decoding="async">')
if EMOJI in src:
    src = src.replace(EMOJI, '', 1)
    print('✅ imagem emoji da fundadora removida do hero')
else:
    print('ℹ️ imagem emoji da fundadora não encontrada ou já removida')

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
