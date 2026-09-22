import re

p = 'index.html'
h = open(p, encoding='utf-8').read()
orig = h
log = []

def rep(old, new, name):
    global h
    if old in h:
        h = h.replace(old, new, 1)
        log.append('OK ' + name)
    else:
        log.append('SKIP (ja aplicado/ausente) ' + name)

# 1. Desafio da Semana -> Campanhas Especiais (sem stats/patrocinador ficticios)
rep('<h3 style="font-size: 24px; margin-bottom: 8px; font-weight: 700;">DESAFIO DA SEMANA</h3>',
    '<h3 style="font-size: 24px; margin-bottom: 8px; font-weight: 700;">CAMPANHAS ESPECIAIS ASF</h3>', 'titulo desafio')
rep('<p style="font-size: 16px; opacity: 0.9; margin-bottom: 16px;">Patrocinado por <span id="brand-sponsor" style="color: #FFD700; font-weight: bold;">STHILL SURF</span></p>',
    '<p style="font-size: 16px; opacity: 0.9; margin-bottom: 16px;">Brindes e experiências oferecidos por marcas parceiras, em campanhas pontuais anunciadas nos canais oficiais.</p>', 'linha patrocinio')
m = re.search(r'<div style="display: grid; grid-template-columns: repeat\(3, 1fr\); gap: 15px; margin-bottom: 25px;">.*?Em pr\u00eamios</div>\s*</div>\s*</div>', h, re.S)
if m:
    h = h.replace(m.group(0), """<div style="background: rgba(255,255,255,0.25); padding: 18px; border-radius: 12px; margin-bottom: 25px;">
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 6px;">🌊 Em construção</div>
            <div style="font-size: 14px; opacity: 0.95;">Nenhuma campanha ativa no momento. Quando uma marca parceira oferecer brindes ou experiências, avisaremos aqui e no Instagram da ASF — com condições, período e como participar.</div>
        </div>""", 1)
    log.append('OK stats desafio -> em construcao')
rep('📸 Participar do Desafio', '📸 Quero participar das campanhas', 'botao desafio')
m = re.search(r"function showBrandChallenge\(\) \{\s*showToast\('.*?\'\);\s*\}", h, re.S)
if m and 'CAMPANHAS ESPECIAIS' not in m.group(0):
    h = h.replace(m.group(0), """function showBrandChallenge() {
            showToast('🏆 CAMPANHAS ESPECIAIS ASF\\n\\nNenhuma campanha ativa no momento.\\n\\nQuando houver, será uma campanha pontual com brinde ou experiência oferecida por uma marca parceira — sempre com condições, período e regras de participação publicados aqui e no Instagram @associacaosurffeminino.\\n\\nA ASF não realiza sorteios mensais permanentes. 💙');
        }""", 1)
    log.append('OK showBrandChallenge reescrita')

# 2. Stats de comunidade ficticios (10.000+ manas / 15% engajamento)
m = re.search(r'<!-- Stats about community -->.*?</div>\s*</div>\s*</div>', h, re.S)
if m:
    h = h.replace(m.group(0), """<!-- Comunidade: sem metricas ficticias -->
        <div style="background: rgba(0,168,204,0.08); padding: 16px; border-radius: 12px; margin-top: 20px; text-align: center;">
            <div style="font-size: 15px; font-weight: 600; color: #0E2439;">🌱 A comunidade ASF está começando</div>
            <div style="font-size: 13px; opacity: 0.8; margin-top: 4px;">Seja uma das primeiras manas! Os dados da comunidade serão atualizados aqui conforme crescemos — sem números inventados.</div>
        </div>""", 1)
    log.append('OK stats comunidade')

# 3. Pitch com numero ficticio
h = h.replace('Chegue a 10.000+ surfistas mulheres com conteúdo autêntico!',
              'Conecte sua marca à comunidade do surf feminino com conteúdo autêntico e propósito!')
log.append('OK pitch parceiro')

# 4. Ofertas Exclusivas ficticias -> Beneficios ASF (em construcao)
m = re.search(r'<!-- Ofertas Exclusivas -->.*?</div>\s*</div>\s*(?=<!-- Galeria UGC)', h, re.S)
if m:
    h = h.replace(m.group(0), """<!-- Benefícios das Associadas -->
    <div style="margin: 0 20px 30px;">
        <h3 style="margin-bottom: 15px;">💙 Benefícios ASF</h3>
        <div class="card" style="border-left: 4px solid var(--primary); text-align: center; padding: 24px;">
            <div style="font-size: 32px; margin-bottom: 8px;">🌊</div>
            <p style="font-size: 14px; margin: 0 0 8px;"><strong>Em breve: os primeiros benefícios para associadas!</strong></p>
            <p style="font-size: 13px; color: var(--gray-600); margin: 0;">Associadas ASF poderão encontrar aqui descontos, brindes, experiências e condições especiais oferecidos voluntariamente por marcas parceiras. Os benefícios são oferecidos diretamente pelos parceiros — disponibilidade, condições e validade são definidas por cada um. Sem mensalidade e sem cobrança para acessar. 💙</p>
        </div>
    </div>

    """, 1)
    log.append('OK ofertas fake -> Beneficios ASF')

# 5. Meus Resultados ficticios
h = h.replace('>3</div>\n                        <div style="font-size: 11px;">Ouro</div>', '>–</div>\n                        <div style="font-size: 11px;">Ouro</div>')
h = h.replace('>2</div>\n                        <div style="font-size: 11px;">Prata</div>', '>–</div>\n                        <div style="font-size: 11px;">Prata</div>')
h = h.replace('>4</div>\n                        <div style="font-size: 11px;">Bronze</div>', '>–</div>\n                        <div style="font-size: 11px;">Bronze</div>')
h = h.replace('<span style="font-weight: 700; color: var(--primary);">#12</span>', '<span style="font-weight: 700; color: var(--primary);">—</span>')
h = h.replace('<span style="font-weight: 700; color: var(--primary);">2.450</span>', '<span style="font-weight: 700; color: var(--primary);">—</span>')
if 'Seus resultados aparecem aqui' not in h:
    rep('<h3 style="font-size: 16px; margin-bottom: 12px; color: var(--secondary);">📊 Meus Resultados</h3>',
        '<h3 style="font-size: 16px; margin-bottom: 12px; color: var(--secondary);">📊 Meus Resultados</h3>\n                <p style="font-size: 12px; color: var(--gray-500); margin: 0 0 10px;">Seus resultados aparecem aqui quando você participar de competições. Dados serão atualizados.</p>', 'nota resultados')

# 6. Notificacao mock com numero ficticio
rep("text: 'Bertioga Surf Girls: 13 manas!'", "text: 'Novo grupo de manas na sua região!'", 'notif mock')

# 7. ASF_SHOP sem produtos proprios e sem checkout
m = re.search(r"const ASF_SHOP = \{\nprodutos:\[.*?\],\ngetCart", h, re.S)
if m and 'produtos:[]' not in m.group(0):
    h = h.replace(m.group(0), "const ASF_SHOP = {\nprodutos:[],\ngetCart", 1)
    log.append('OK produtos esvaziados')
rep("checkoutWhatsApp(){\nconst cart=this.getCart();\nif(cart.length===0)return showToast('&#x1F6D2; Carrinho vazio!');",
    "checkoutWhatsApp(){\nreturn showToast('&#x1F6D2; A ASF não vende produtos. Quando houver marcas parceiras, você será direcionada ao canal oficial de cada uma! 💙');\n/* checkout próprio desativado — ASF é sem fins lucrativos */\nconst cart=this.getCart();\nif(cart.length===0)return;", 'checkout')
rep("const prods=catFilter==='all'?this.produtos:this.produtos.filter(p=>p.categoria===catFilter);\nconst cart=this.getCart();\nreturn prods.map(p=>{",
    "const prods=catFilter==='all'?this.produtos:this.produtos.filter(p=>p.categoria===catFilter);\nif(prods.length===0){return '<div class=\"card\" style=\"text-align:center;padding:28px\"><div style=\"font-size:36px;margin-bottom:8px\">🌊</div><p style=\"font-weight:600;color:var(--secondary);margin:0 0 6px\">Vitrine em construção</p><p style=\"font-size:13px;color:var(--gray-600);margin:0\">A ASF não é uma loja. Aqui divulgaremos marcas parceiras que apoiam o surf feminino, com link para os canais oficiais de cada uma. Sem checkout, sem venda direta. 💙</p></div>';}\nconst cart=this.getCart();\nreturn prods.map(p=>{", 'render vazio')
rep('<h2 class="section-title">🛒 Loja ASF</h2>\n    <p class="section-subtitle">Produtos recomendados para surfistas. Comprando aqui, você apoia a ASF! 💙</p>',
    '<h2 class="section-title">🛍️ Parceiros & Benefícios</h2>\n    <p class="section-subtitle">Vitrine de marcas que apoiam o surf feminino. A ASF não vende produtos — você compra direto no canal do parceiro. 💙</p>', 'loja header')

# 8. Dados de marcas ilustrativas -> vazio (estrutura pronta p/ cadastro futuro)
m = re.search(r"const ASF_BRANDS_DATA=\[.*?\];", h, re.S)
if m and 'sem marcas cadastradas' not in m.group(0):
    h = h.replace(m.group(0), "const ASF_BRANDS_DATA=[/* sem marcas cadastradas ainda — parceiras reais serão incluídas aqui após confirmação oficial */];", 1)
    log.append('OK ASF_BRANDS_DATA esvaziado')
m = re.search(r"const AFFILIATE_PRODUCTS = \[.*?\];", h, re.S)
if m and 'vitrine em construção' not in m.group(0):
    h = h.replace(m.group(0), "const AFFILIATE_PRODUCTS = [/* vitrine em construção — somente produtos de parceiros confirmados serão listados aqui, com link para o canal oficial do parceiro */];", 1)
    log.append('OK AFFILIATE_PRODUCTS esvaziado')

# 9. Remover blocos duplicados de Badges Patrocinados (marcas ilustrativas)
pat = re.compile(r'[ \t]*<!-- Badges Patrocinados -->.*?registre suas sessions para desbloquear badges!\s*</p>\s*</div>\s*\n', re.S)
n = len(pat.findall(h))
if n:
    h = pat.sub('', h)
    log.append(f'OK removidos {n} blocos de badges patrocinados')

if h != orig:
    open(p, 'w', encoding='utf-8').write(h)
print('\n'.join(log) or 'NADA A FAZER')
