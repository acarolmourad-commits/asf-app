BLOCO_PARCEIROS = '''
        <!-- Posicionamento Parceiros & Beneficios ASF -->
        <div style="margin: 20px; padding: 20px; background: #F4FBFD; border: 1px solid #DBF0F6; border-radius: 16px;">
            <h3 style="font-size: 16px; color: var(--secondary); margin-bottom: 8px;">🤝 Parceiros &amp; Benefícios ASF</h3>
            <p style="font-size: 13px; color: var(--gray-600); line-height: 1.6; margin-bottom: 12px;">Marcas e projetos que apoiam o surf feminino e oferecem benefícios para a comunidade ASF. A ASF é uma associação <strong>sem fins lucrativos</strong>: não vendemos produtos, não cobramos mensalidade e não intermediamos pagamentos. Divulgamos e fortalecemos quem apoia as manas.</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;">
                <span style="background: white; border: 1px solid #DBF0F6; border-radius: 20px; padding: 5px 10px; font-size: 11px;">🏄 Surfwear</span>
                <span style="background: white; border: 1px solid #DBF0F6; border-radius: 20px; padding: 5px 10px; font-size: 11px;">🏄‍♀️ Equipamentos</span>
                <span style="background: white; border: 1px solid #DBF0F6; border-radius: 20px; padding: 5px 10px; font-size: 11px;">🧴 Saúde e bem-estar</span>
                <span style="background: white; border: 1px solid #DBF0F6; border-radius: 20px; padding: 5px 10px; font-size: 11px;">🏨 Hospedagem</span>
                <span style="background: white; border: 1px solid #DBF0F6; border-radius: 20px; padding: 5px 10px; font-size: 11px;">🍴 Alimentação</span>
                <span style="background: white; border: 1px solid #DBF0F6; border-radius: 20px; padding: 5px 10px; font-size: 11px;">🧘 Yoga/fitness</span>
                <span style="background: white; border: 1px solid #DBF0F6; border-radius: 20px; padding: 5px 10px; font-size: 11px;">📸 Fotografia</span>
                <span style="background: white; border: 1px solid #DBF0F6; border-radius: 20px; padding: 5px 10px; font-size: 11px;">🚐 Surf trips</span>
                <span style="background: white; border: 1px solid #DBF0F6; border-radius: 20px; padding: 5px 10px; font-size: 11px;">🌎 Turismo</span>
                <span style="background: white; border: 1px solid #DBF0F6; border-radius: 20px; padding: 5px 10px; font-size: 11px;">🏪 Lojas locais</span>
                <span style="background: white; border: 1px solid #DBF0F6; border-radius: 20px; padding: 5px 10px; font-size: 11px;">🤝 Projetos sociais</span>
            </div>
            <div style="background: white; border-radius: 12px; padding: 14px; border: 1px dashed #DBF0F6;">
                <p style="font-size: 13px; font-weight: 700; color: var(--secondary); margin-bottom: 4px;">💙 Benefícios das associadas</p>
                <p style="font-size: 12px; color: var(--gray-600); line-height: 1.6; margin: 0;">Associadas ASF podem encontrar benefícios oferecidos voluntariamente pelas marcas parceiras — como descontos, brindes, experiências, aulas, hospedagem, produtos ou condições especiais. <strong>Os benefícios são oferecidos diretamente pelas marcas parceiras.</strong> A disponibilidade, as condições e a validade são definidas por cada parceiro. <em>Área em construção — novos benefícios serão anunciados na comunidade.</em></p>
            </div>
        </div>
'''

# ASF Evolucao Fase 1: limpeza de metricas ficticias + posicionamento Parceiros/Beneficios (idempotente)
path = 'index.html'
h = open(path, encoding='utf-8').read()
orig = h
changes = []

def rep(old, new, tag):
    global h
    if old in h:
        h = h.replace(old, new, 1)
        changes.append(tag)

# 1. Perfil mockado -> estado inicial neutro (o JS atualiza com dados reais do dispositivo)
rep('Nível 5 • 2.450 pontos', 'Nível 1 • 0 pontos', 'perfil-pontos')
rep('65% para Nível 6', '0% para Nível 2', 'perfil-nivel')

# 2. Parceiros: remover numero ficticio de surfistas
rep('Divulgue sua marca para +500 mulheres surfistas.',
    'Conecte sua marca à comunidade ASF e apoie o surf feminino — sem fins lucrativos.', 'parceiros-500')

# 3. Notificacao mock com numero de manas
rep("text: 'Bertioga Surf Girls: 13 manas!'",
    "text: 'Bertioga Surf Girls: novo grupo na comunidade!'", 'notif-manas')

# 4. Resultados de competicoes: marcar como ilustrativos
rep('📋 Resultados Recentes</h3>',
    '📋 Resultados Recentes</h3>\n                <p style="font-size: 12px; color: var(--gray-400); margin-bottom: 12px;">Exemplos ilustrativos de como os resultados aparecerão aqui. Resultados oficiais serão publicados a partir das fontes das competições.</p>', 'competicoes-nota')

# 5. Progresso: zerar numeros mockados
rep('<p style="font-size: 12px; opacity: 0.8;">350 pontos</p>',
    '<p style="font-size: 12px; opacity: 0.8;">0 pontos</p>', 'progresso-pontos')
rep('<p style="font-size: 12px;">Nível 3</p>', '<p style="font-size: 12px;">Nível 1</p>', 'progresso-nivel')
rep('height: 100%; width: 65%;', 'height: 100%; width: 0%;', 'progresso-barra')
rep('350 / 500 pontos para o próximo nível', '0 / 500 pontos para o próximo nível', 'progresso-texto')

# 6. Bloco Parceiros & Beneficios (posicionamento sem fins lucrativos + categorias)
anchor = '<h2 class="section-title">🤝 Cadastro de Parceiros</h2>\n        </div>\n'
if 'Parceiros &amp; Benefícios ASF' not in h and anchor in h:
    block = anchor + BLOCO_PARCEIROS
    h = h.replace(anchor, block, 1)
    changes.append('parceiros-bloco')

if h != orig:
    open(path, 'w', encoding='utf-8').write(h)
print('Alteracoes aplicadas:', changes if changes else 'nenhuma (ja aplicado)')
