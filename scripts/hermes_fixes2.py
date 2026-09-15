#!/usr/bin/env python3
# MISSÃO HERMES — Correções de conteúdo desatualizado e botões mortos.
# 1) Remove bloco 'Evento do Mês' com datas vencidas (abr/mai) -> card evergreen de Guias ASF
# 2) Remove faixa 'Próximos Eventos' com datas vencidas
# 3) Botão morto 'Ver todas →' vira link real para o hub editorial /aprender/
# 4) updateCountdown: data de competição vencida não exibe mais 'Em andamento'
import io, re, sys

TARGET = 'index.html'
with io.open(TARGET, encoding='utf-8') as f:
    src = f.read()
original = src

# 1) Evento do Mês -> Guias ASF (evergreen, sem datas inventadas)
NEW_CARD = """<!-- Guias ASF - editorial evergreen -->
            <div style="margin: 0 20px 20px; background: linear-gradient(135deg, #00A8CC 0%, #9B59B6 100%); border-radius: 16px; padding: 16px; color: white;">
                <p style="font-size: 12px; opacity: 0.9; margin: 0;">📖 GUIAS ASF</p>
                <h3 style="font-size: 16px; font-weight: 700; margin: 4px 0 6px;">Aprenda a surfar com segurança</h3>
                <p style="font-size: 13px; opacity: 0.95; margin: 0 0 12px;">Iniciação, primeira prancha, etiqueta no mar e as melhores praias do litoral norte — guias gratuitos.</p>
                <a href="aprender/index.html" class="btn btn-primary" style="display:block; background: white; color: #0E2439; border: none; font-size: 13px; font-weight: 600; width: 100%; text-align: center; text-decoration: none; padding: 12px; border-radius: 12px;">Ver todos os guias →</a>
            </div>

            """
m = re.search(r'[ \t]*<!-- Evento do Mês - Nova Feature -->.*?\n(?=[ \t]*<!-- Próximos Eventos do Mês -->)', src, re.DOTALL)
if m:
    src = src[:m.start()] + '            ' + NEW_CARD.lstrip() + src[m.end():]
    print('✅ bloco Evento do Mês vencido substituído por Guias ASF')
else:
    print('ℹ️ bloco Evento do Mês não encontrado (ok se já tratado)')

# 2) Remover faixa Próximos Eventos vencida
m2 = re.search(r'[ \t]*<!-- Próximos Eventos do Mês -->.*?\n(?=[ \t]*<div class="cards-grid">)', src, re.DOTALL)
if m2:
    src = src[:m2.start()] + src[m2.end():]
    print('✅ faixa Próximos Eventos vencida removida')
else:
    print('ℹ️ faixa Próximos Eventos não encontrada')

# 3) Botão morto 'Ver todas' -> link real
OLD_SEEALL = '<a href="#" class="see-all" onclick="event.preventDefault();return false">Ver todas →</a>'
NEW_SEEALL = '<a href="aprender/index.html" class="see-all">Ver guias →</a>'
if OLD_SEEALL in src:
    src = src.replace(OLD_SEEALL, NEW_SEEALL, 1)
    print('✅ botão morto Ver todas agora aponta para /aprender/')
else:
    print('ℹ️ botão Ver todas já corrigido')

# 4) Countdown de competição vencida
if "el.textContent = 'Em andamento';" in src:
    src = src.replace("el.textContent = 'Em andamento';", "el.textContent = 'A definir';", 1)
    print('✅ countdown: data vencida exibe A definir')
else:
    print('ℹ️ countdown já corrigido')

if src != original:
    with io.open(TARGET, 'w', encoding='utf-8') as f:
        f.write(src)
    assert src.count('<style') == src.count('</style>')
    assert 'sorteio' not in src.lower(), 'sorteio reintroduzido?!'
    assert 'Circuito Paulista Feminino' not in src, 'evento vencido ainda presente'
    print('💾 index.html atualizado + sanity checks ok')
else:
    print('ℹ️ sem alterações')
