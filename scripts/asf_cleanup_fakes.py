# -*- coding: utf-8 -*-
"""ASF cleanup: remove dados ficticios/mockups que pareciam reais.
Preserva toda a estrutura e funcionalidades. Idempotente."""
import re

p = 'index.html'
h = open(p, encoding='utf-8').read()
n0 = len(h)
log = []

def rep(old, new):
    global h
    c = h.count(old)
    if c:
        h = h.replace(old, new)
    log.append((c, old[:60]))

# 1. Metricas ficticias da comunidade
rep('<div style="font-size: 28px; font-weight: bold; color: #00A8CC;">10.000+</div>', '<div style="font-size: 28px; font-weight: bold; color: #00A8CC;">🌊</div>')
rep('<div style="font-size: 12px; opacity: 0.8;">Manas ASF</div>', '<div style="font-size: 12px; opacity: 0.8;">Comunidade em construção</div>')
rep('<div style="font-size: 28px; font-weight: bold; color: #FFD700;">15%</div>', '<div style="font-size: 28px; font-weight: bold; color: #FFD700;">💙</div>')
rep('<div style="font-size: 12px; opacity: 0.8;">Engajamento</div>', '<div style="font-size: 12px; opacity: 0.8;">Apoio ao surf feminino</div>')
rep('<div style="font-size: 28px; font-weight: bold; color: #2ECC71;">2019</div>', '<div style="font-size: 28px; font-weight: bold; color: #2ECC71;">🤝</div>')
rep('<div style="font-size: 12px; opacity: 0.8;">Desde</div>', '<div style="font-size: 12px; opacity: 0.8;">Seja uma das primeiras</div>')

# 2. Metricas ficticias de alcance
rep('Divulgue sua marca para +500 mulheres surfistas.', 'Conecte sua marca a uma comunidade que vive o surf feminino.')
rep('Chegue a 10.000+ surfistas mulheres com conteúdo autêntico!', 'Conecte-se com a comunidade do surf feminino de forma autêntica!')

# 3. Patrocinio ficticio no desafio
rep('<p style="font-size: 16px; opacity: 0.9; margin-bottom: 16px;">Patrocinado por <span id="brand-sponsor" style="color: #FFD700; font-weight: bold;">STHILL SURF</span></p>', '')

# 4. Badges patrocinados -> badges ASF
rep('🏆 Badges Patrocinados - Colecione e Compartilhe', '🏆 Badges ASF - Colecione e Compartilhe')
rep('>STHILL SURF</h4>', '>ASF SURF</h4>')
rep('>TRIBOSURF</h4>', '>ASF MANAS</h4>')

# 5. Notificacoes ficticias
rep("text: 'Bertioga Surf Girls: 13 manas!'", "text: 'Novo grupo de manas na comunidade!'")
rep("'Dica do Dia (2417)'", "'Dica do Dia'")

# 6. Ranking ficticio
rep('<span style="font-size: 14px;">🏅 Ranking Estadual</span>\n                        <span style="font-weight: 700; color: var(--primary);">#12</span>', '<span style="font-size: 14px;">🏅 Ranking Estadual</span>\n                        <span style="font-weight: 700; color: var(--primary);">Em breve</span>')

# 7. Metricas ficticias de campanha
rep('<div style="font-size: 24px; font-weight: bold;">150+</div>\n                <div>Fotos enviadas</div>', '<div style="font-size: 24px; font-weight: bold;">📸</div>\n                <div>Compartilhe sua foto</div>')
rep('<div style="font-size: 24px; font-weight: bold;">3.4K</div>\n                <div>Votos</div>', '<div style="font-size: 24px; font-weight: bold;">🗳️</div>\n                <div>Votações da comunidade</div>')
rep('<div style="font-size: 24px; font-weight: bold;">R$500</div>\n                <div>Em prêmios</div>', '<div style="font-size: 24px; font-weight: bold;">🎁</div>\n                <div>Brindes em campanhas pontuais</div>')

# 8. Premio ficticio no toast do desafio
old_toast = 'showToast(\'🏆 DESAFIO DA SEMANA\\n\\n📸 Tema: "Melhor foto com prancha na praia"\\n🏅 Prêmio: R$500 em produtos\\n📅 Prazo: 7 dias\\n\\nComo participar:\\n1. Tire sua foto\\n2. Poste no Instagram marcando @associacaosurffeminino\\n3. Use #ASFChallenge\\n4. Compartilhe no app!\\n\\nBoa sorte! 🏄‍♀️\');'
new_toast = 'showToast(\'🏆 DESAFIOS ASF\\n\\nOs desafios e campanhas com brindes acontecem pontualmente, quando um parceiro oferece uma ação real.\\n\\nFique de olho: novas campanhas serão anunciadas aqui e no Instagram @associacaosurffeminino. 🏄‍♀️\');'
rep(old_toast, new_toast)

# 9. Grade de ofertas ficticias -> estado honesto
i = h.find('id="brand-offers">')
if i >= 0:
    seg = h[i:]
    m = re.search(r'.*?\n\s*</div>\s*\n\s*(?=<!--)', seg, re.S)
    if m:
        new_offers = 'id="brand-offers">\n            <div class="card" style="padding:28px 20px;text-align:center">\n                <div style="font-size:40px;margin-bottom:8px">💙</div>\n                <h4 style="margin:0 0 8px 0;color:#0E2439">Benefícios em construção</h4>\n                <p style="font-size:13px;margin:0 0 6px 0;color:#555">Os benefícios são oferecidos voluntariamente pelas marcas parceiras da ASF — descontos, brindes, experiências, aulas ou condições especiais.</p>\n                <p style="font-size:12px;margin:0;color:#888">A disponibilidade, condições e validade são definidas por cada parceiro. Novos benefícios serão anunciados aqui.</p>\n            </div>\n        </div>\n    </div>\n'
        h = h[:i] + new_offers + seg[m.end():]
        log.append((1, 'brand-offers grid'))
    else:
        log.append((0, 'brand-offers grid (regex)'))
else:
    log.append((0, 'brand-offers grid (find)'))

# 10. Carrossel de marcas inventadas -> vazio com CTA
m = re.search(r'const BRANDS=\[.*?\];\nlet _current', h, re.S)
if m and 'const BRANDS=[];' not in h:
    h = h.replace(m.group(0), 'const BRANDS=[];\nlet _current', 1)
    log.append((1, 'BRANDS carousel emptied'))
else:
    log.append((0, 'BRANDS carousel'))

rep('if(!logosDiv||!rotatorDiv)return;',
    'if(!logosDiv||!rotatorDiv)return;\nif(BRANDS.length===0){logosDiv.innerHTML=\'<p style="font-size:12px;color:var(--gray-500);margin:4px 0">Em breve: marcas que apoiam o surf feminino. <a href="#brandhub" onclick="showSection(\\\'brandhub\\\')" style="color:var(--primary);font-weight:600">Quero ser parceiro →</a></p>\';return;}')

# 11. Lista de marcas com descontos inventados -> vazia
m = re.search(r'ASF_BRANDS_DATA=\[\{.*?\}\n\];\nfunction renderBrands', h, re.S)
if m:
    h = h.replace(m.group(0), 'ASF_BRANDS_DATA=[];\nfunction renderBrands', 1)
    log.append((1, 'ASF_BRANDS_DATA emptied'))
else:
    log.append((0, 'ASF_BRANDS_DATA'))

# 12. Estado vazio honesto no hub de marcas
rep('if(!grid)return;\nconst brands=filter',
    'if(!grid)return;\nif(ASF_BRANDS_DATA.length===0){\n  if(filterBar)filterBar.innerHTML=\'\';\n  grid.innerHTML=\'<div class="card" style="padding:28px 20px;text-align:center"><div style="font-size:40px;margin-bottom:8px">🤝</div><p style="margin:0 0 6px 0;font-weight:700">Marcas parceiras em construção</p><p style="font-size:13px;margin:0 0 14px 0;color:#666">Marcas e projetos que apoiam o surf feminino e oferecem benefícios para a comunidade ASF serão divulgados aqui.</p><a href="#parceiros" onclick="showSection(\\\'parceiros\\\');return false" style="display:inline-block;padding:10px 22px;border-radius:30px;background:linear-gradient(135deg,#00A8CC,#0a7aa8);color:#fff;font-size:14px;font-weight:700;text-decoration:none">🤝 Quero ser parceiro da ASF</a></div>\';\n  const cta0=document.getElementById(\'brand-cta-bar\');if(cta0)cta0.innerHTML=\'\';\n  return;\n}\nconst brands=filter')

open(p, 'w', encoding='utf-8').write(h)
print('size', n0, '->', len(h))
for c, s in log:
    print(('OK ' if c else 'SKIP'), c, s)
