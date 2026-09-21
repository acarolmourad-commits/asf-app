#!/usr/bin/env python3
"""P3: remove Infolinks do index.html, mantendo Google AdSense."""
import re

p = 'index.html'
t = open(p, encoding='utf-8').read()
before = len(t)

# 1) preconnect do Infolinks
t = re.sub(r'[ \t]*<link rel="preconnect" href="https://resources\.infolinks\.com">\n?', '', t)

# 2) bloco de config (comentário + script com infolinks_pid/wsid)
t = re.sub(
    r'[ \t]*<!-- Infolinks[^>]*-->\s*<script[^>]*>\s*var infolinks_pid[^<]*</script>\n?',
    '', t, flags=re.S)

# 3) script tag principal
t = re.sub(r'[ \t]*<script[^>]*src="https://resources\.infolinks\.com[^"]*"[^>]*></script>\n?', '', t)

# 4) comentário residual
t = t.replace('<!-- Infolinks (Free Ads) - DISABLED -->',
              '<!-- Monetização consolidada no Google AdSense (auditoria P3) -->')

assert 'resources.infolinks.com' not in t, 'infolinks ainda presente!'
assert 'infolinks_pid' not in t, 'config infolinks ainda presente!'
assert 'adsbygoogle.js?client=ca-pub-3811729023785282' in t, 'AdSense removido por engano!'
assert len(re.findall(r'<div\b', t)) == len(re.findall(r'</div>', t)), 'divs desbalanceadas!'

open(p, 'w', encoding='utf-8').write(t)
print(f'OK — removidos {before - len(t)} bytes; AdSense intacto; divs balanceadas.')
