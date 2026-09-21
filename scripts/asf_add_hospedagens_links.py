# Adiciona links para /hospedagens/ no sitemap e nas paginas satelite.
log = []

# sitemap.xml
p = 'sitemap.xml'
s = open(p, encoding='utf-8').read()
if 'hospedagens/' not in s:
    entry = '  <url><loc>https://acarolmourad-commits.github.io/asf-app/hospedagens/</loc><lastmod>2026-09-21</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n</urlset>'
    s = s.replace('</urlset>', entry)
    open(p, 'w', encoding='utf-8').write(s)
    log.append('sitemap: hospedagens adicionada')

# surf-trip link
p = 'surf-trip/index.html'
s = open(p, encoding='utf-8').read()
anchor = '      <a href="../diario/">📓 Diário de surf — registre a trip depois</a>\n'
if 'hospedagens/' not in s and anchor in s:
    s = s.replace(anchor, anchor + '      <a href="../hospedagens/">🌍 <span>Estadias Parceiras</span> — hospedagens que apoiam o surf feminino</a>\n')
    open(p, 'w', encoding='utf-8').write(s)
    log.append('surf-trip: link adicionado')

# previsao-surf link
p = 'previsao-surf/index.html'
s = open(p, encoding='utf-8').read()
anchor = '      <a href="../sessoes-interativas.html">💬 Sessões interativas da comunidade</a>\n'
if 'hospedagens/' not in s and anchor in s:
    s = s.replace(anchor, anchor + '      <a href="../hospedagens/">🌍 <span>Estadias Parceiras</span> — hospedagens que apoiam o surf feminino</a>\n')
    open(p, 'w', encoding='utf-8').write(s)
    log.append('previsao-surf: link adicionado')

print('\n'.join(log) or 'NADA A FAZER')
