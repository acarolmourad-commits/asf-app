import re

p = 'index.html'
h = open(p, encoding='utf-8').read()
orig = h
log = []

# Link discreto para Hospedagens no footer (junto aos links sociais)
anchor = '<a href="https://www.tiktok.com/@Cahrol.asf"'
if 'hospedagens/' not in h and anchor in h:
    idx = h.find(anchor)
    end = h.find('</a>', idx) + 4
    link = '\n            <a href="hospedagens/" style="color: white; text-decoration: none; font-size: 13px; opacity: 0.8;">🏨 Hospedagens</a>'
    h = h[:end] + link + h[end:]
    log.append('link hospedagens no footer')

if h != orig:
    open(p, 'w', encoding='utf-8').write(h)
print('\n'.join(log) or 'NADA A FAZER')
