#!/usr/bin/env python3
import re, sys
t = open('index.html', encoding='utf-8').read()
orig = t

# R1: banner surftrip -> lista de interesse (sem prometer grupos inexistentes)
t = t.replace(
 '<p style="font-size: 12px; opacity: 0.9; margin-top: 4px;">Cadastre-se e entre nos grupos de WhatsApp!</p>',
 '<p style="font-size: 12px; opacity: 0.9; margin-top: 4px;">Os grupos de WhatsApp estão sendo formados — deixe seu interesse abaixo e avisaremos quando o da sua região abrir.</p>')

# R2: título do formulário honesto
t = t.replace('>📱 Cadastre-se no Grupo</h4>', '>📱 Entre na lista de interesse</h4>')

# R3: botão do form -> mensagem honesta + label
old_btn = re.search(r'<button class="btn btn-primary" style="width: 100%; background: #25D360[^>]*>Enviar Cadastro</button>', t)
assert old_btn, 'R3 alvo não encontrado'
new_btn = ('<button class="btn btn-primary" style="width: 100%; background: #25D360; border: none; font-weight: bold; font-size: 14px;" '
 "onclick=\"showToast('✅ Interesse registrado!\\n\\n📱 Quando o grupo da sua região for criado, avisaremos pelo WhatsApp.\\n\\nEnquanto isso, fale com a Carol na aba Contato! 🌊🏄‍♀️')\">Registrar Interesse</button>")
t = t.replace(old_btn.group(0), new_btn)

# R4: heading de grupos honesto
t = t.replace('>🏖️ Grupos Ativos</h3>', '>🏖️ Grupos em formação</h3>')

# R5: stats falsas -> zero-state honesto
stats = re.search(r'<!-- Stats -->[\s\S]*?</div>\s*</div>\s*</div>', t)
assert stats, 'R5 stats não encontrado'
zero = ('<!-- Stats -->\n            <div style="background: var(--light); padding: 20px; margin: 20px; border-radius: 16px; text-align: center;">\n'
 '                <p style="font-size: 14px; color: var(--gray-600);">🌱 Comunidade em formação — os números reais aparecerão aqui quando os primeiros grupos forem criados. Sem dados inventados.</p>\n'
 '            </div>')
t = t.replace(stats.group(0), zero)

# R6: remover bloco Parceiro duplicado (segundo, sem fechamento de div)
dup = re.search(r'\n\n\n    <!-- Seja um Parceiro -->\s*<div style="background: linear-gradient\(135deg, #2c0a37, #4a1c5e\);[\s\S]*?📲 Falar com a Carol\s*</button>\s*', t)
assert dup, 'R6 duplicata não encontrada'
t = t.replace(dup.group(0), '\n')

# R7: remover 'Ver todos →' morto da seção Manas
t = t.replace('<a href="#" class="see-all" onclick="event.preventDefault();return false">Ver todos →</a>\n', '')

# validações
assert t != orig
for bad in ['Manas Cadastradas', 'Surftrips Realizadas', '>47<', 'Cadastre-se no Grupo', 'Enviar Cadastro']:
    assert bad not in t, f'conteúdo falso restante: {bad}'
assert t.count('Sua marca quer fazer parte') == 1, 'bloco parceiro ainda duplicado'
co = len(re.findall(r'<div\b', t)); cc = len(re.findall(r'</div>', t))
oo = len(re.findall(r'<div\b', orig)); oc = len(re.findall(r'</div>', orig))
print('divs orig:', oo, oc, '| novo:', co, cc)
assert co <= cc and (cc - co) <= 2, f'divs pioraram: {co} vs {cc}'
open('index.html', 'w', encoding='utf-8').write(t)
print('OK — patch aplicado,', len(orig), '->', len(t), 'bytes')
