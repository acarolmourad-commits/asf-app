#!/usr/bin/env python3
# MISSÃO HERMES — Linkagem interna: bloco 'Guias ASF' na Home com os 6 artigos
# editoriais + ajuste dos toasts de quiz para apontar aos guias. Idempotente.
import io

TARGET = 'index.html'
src = io.open(TARGET, encoding='utf-8').read()
original = src

GUIDES_BLOCK = '''
    <!-- Guias ASF - Conteudo editorial -->
    <div class="card" style="margin: 4px 20px 16px; padding: 18px 20px; border-radius: 16px;">
        <h3 style="margin: 0 0 4px; font-size: 16px; color: var(--secondary, #0E2439);">📖 Guias ASF</h3>
        <p style="font-size: 12.5px; margin: 0 0 12px; opacity: 0.8;">Conteúdo confiável para aprender, evoluir e curtir o mar com segurança.</p>
        <div style="display: grid; gap: 8px;">
            <a href="aprender/como-comecar-a-surfar-mulheres.html" style="display:block; padding: 12px 14px; border-radius: 12px; background: rgba(0,168,204,0.08); text-decoration:none; color: inherit; font-size: 13.5px;">🏄‍♀️ <strong>Como começar a surfar</strong> — guia completo para mulheres</a>
            <a href="aprender/primeira-prancha-de-surf.html" style="display:block; padding: 12px 14px; border-radius: 12px; background: rgba(0,168,204,0.08); text-decoration:none; color: inherit; font-size: 13.5px;">🏄 <strong>Sua primeira prancha</strong> — como escolher sem errar</a>
            <a href="aprender/etiqueta-no-mar.html" style="display:block; padding: 12px 14px; border-radius: 12px; background: rgba(0,168,204,0.08); text-decoration:none; color: inherit; font-size: 13.5px;">🤝 <strong>Etiqueta no mar</strong> — regras de prioridade sem tecnicismo</a>
            <a href="praias/melhores-praias-iniciantes-litoral-norte-sp.html" style="display:block; padding: 12px 14px; border-radius: 12px; background: rgba(155,89,182,0.08); text-decoration:none; color: inherit; font-size: 13.5px;">🗺️ <strong>Praias para iniciantes</strong> — litoral norte de SP</a>
            <a href="praias/surf-feminino-sao-sebastiao.html" style="display:block; padding: 12px 14px; border-radius: 12px; background: rgba(155,89,182,0.08); text-decoration:none; color: inherit; font-size: 13.5px;">📍 <strong>Surf feminino em São Sebastião</strong> — comunidade e projetos</a>
            <a href="bem-estar/surf-saude-mental-mulheres.html" style="display:block; padding: 12px 14px; border-radius: 12px; background: rgba(155,89,182,0.08); text-decoration:none; color: inherit; font-size: 13.5px;">🧘 <strong>Surf e bem-estar</strong> — o que o mar faz pela mente</a>
        </div>
    </div>
'''

ANCHOR = '    <!-- Live Surf Conditions -->'
if 'Guias ASF - Conteudo editorial' in src:
    print('ℹ️ bloco de guias já presente')
elif ANCHOR in src:
    src = src.replace(ANCHOR, GUIDES_BLOCK + '\n' + ANCHOR, 1)
    print('✅ bloco Guias ASF inserido na Home')
else:
    print('⚠️ âncora do bloco não encontrada — nada alterado')

# Quiz toasts: 'menu Aprender' não existe — apontar para os Guias ASF na Home
src = src.replace('(menu Aprender)', '(bloco Guias ASF na Home)')

if src != original:
    io.open(TARGET, 'w', encoding='utf-8').write(src)
    assert src.count('<style') == src.count('</style>')
    assert 'sorteio' not in src.lower()
    print('💾 index.html atualizado e validado')
else:
    print('ℹ️ sem alterações')
