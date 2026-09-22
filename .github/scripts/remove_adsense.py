#!/usr/bin/env python3
"""Remove Google AdSense do index.html (ASF sem fins lucrativos - sem publicidade). Idempotente."""
import re
p = "index.html"
s = open(p, encoding="utf-8").read()
pats = [
    r'\s*<link rel="preconnect" href="https://pagead2\.googlesyndication\.com">',
    r'\s*<link rel="dns-prefetch" href="https://pagead2\.googlesyndication\.com">',
    r'\s*<link rel="preconnect" href="https://www\.googletagservices\.com">',
    r'\s*<script async src="https://pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js\?client=ca-pub-3811729023785282" crossorigin="anonymous"></script>',
    r'\s*<!-- Monetiza[^>]*AdSense[^>]*-->',
]
changed = False
for pat in pats:
    s, n = re.subn(pat, "", s)
    if n:
        changed = True
        print("removido:", pat[:60], n)
if changed:
    open(p, "w", encoding="utf-8").write(s)
    print("index.html atualizado")
else:
    print("nada a remover")
