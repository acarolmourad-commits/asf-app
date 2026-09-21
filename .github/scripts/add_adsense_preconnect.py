#!/usr/bin/env python3
"""Adiciona preconnect + dns-prefetch do Google AdSense ao <head> do index.html."""
import re

p = 'index.html'
t = open(p, encoding='utf-8').read()

if 'pagead2.googlesyndication.com">' in t and 'rel="preconnect" href="https://pagead2.googlesyndication.com"' in t:
    print('preconnect ja existe — nada a fazer')
    raise SystemExit(0)

snippet = ('    <link rel="preconnect" href="https://pagead2.googlesyndication.com">\n'
           '    <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com">\n'
           '    <link rel="preconnect" href="https://www.googletagservices.com">\n')

anchor = '    <link rel="preconnect" href="https://www.googletagmanager.com">'
assert anchor in t, 'anchor nao encontrado'
t = t.replace(anchor, anchor + '\n' + snippet, 1)

assert t.count('rel="preconnect" href="https://pagead2.googlesyndication.com"') == 1
assert len(re.findall(r'<div\b', t)) == len(re.findall(r'</div>', t)), 'divs desbalanceadas!'

open(p, 'w', encoding='utf-8').write(t)
print('OK — preconnect AdSense adicionado.')
