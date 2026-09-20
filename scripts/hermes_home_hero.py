#!/usr/bin/env python3
# MISSÃO HERMES — Home: hero responde 'o que é / para quem / o que fazer' e
# conecta a Home aos novos guias editoriais. Substituições exatas e idempotentes.
# UPDATE 6: adiciona logo oficial ASF pequena (64px) no hero, sem sobrepor conteúdo.
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

# --- Remover header completo (logo ASF + botoes de icone) ---
START_MARK = '<!-- Header -->'
END_MARK = '</header>'
if START_MARK in src and END_MARK in src:
    i = src.index(START_MARK)
    j = src.index(END_MARK, i) + len(END_MARK)
    src = src[:i] + src[j:]
    print('✅ header (logo + icones) removido do topo da home')
else:
    print('ℹ️ header não encontrado ou já removido')

# --- Proteger acessos JS ao darkModeToggle removido ---
UNSAFE = "document.getElementById('darkModeToggle').textContent"
SAFE = "(document.getElementById('darkModeToggle')||{textContent:''}).textContent"
n = src.count(UNSAFE)
if n:
    src = src.replace(UNSAFE, SAFE)
    print(f'✅ {n} acessos ao darkModeToggle protegidos')
else:
    print('ℹ️ nenhum acesso desprotegido ao darkModeToggle')

# --- Adicionar logo oficial ASF pequena no hero ---
H1 = '<h1>Conectando <span>Mulheres Surfistas</span></h1>'
LOGO = ('        <img loading="lazy" src="assets/images/asf-logo-small.png" '
        'alt="Logo oficial ASF - Associação de Surf Feminino" '
        'style="width:64px; height:auto; display:block; margin:16px auto 8px;" '
        'decoding="async">\n')
if 'asf-logo-small.png' not in src and H1 in src:
    src = src.replace(H1, LOGO + H1, 1)
    print('✅ logo ASF pequena adicionada ao hero')
else:
    print('ℹ️ logo já presente ou H1 não encontrado')

if src != original:
    with io.open(TARGET, 'w', encoding='utf-8') as f:
        f.write(src)
    print('💾 index.html atualizado')
    # sanity: styles balanceados
    assert src.count('<style') == src.count('</style>'), 'styles desbalanceados'
    print('✅ sanity check ok')
else:
    print('ℹ️ sem alterações')
