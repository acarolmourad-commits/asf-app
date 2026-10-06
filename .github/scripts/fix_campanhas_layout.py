#!/usr/bin/env python3
"""Corrige o enquadramento da secao CAMPANHAS ESPECIAIS ASF na home (idempotente).

- Remove tag quebrada/duplicada `<div class="section" ` antes de #loja
- Card Campanhas: padding/margem responsivos, max-width e box-sizing
- Grid de 3 colunas fixas -> auto-fit (nao quebra no mobile)
- Quote interna: margem lateral fixa -> vertical
- Botao CTA: max-width 100%
- Bump da versao de cache do sw.js para invalidar cache antigo
"""
import re, sys

path = "index.html"
html = open(path, encoding="utf-8").read()
orig = html

subs = [
    ('<!-- Brand Hub Section -->\n<div class="section" \n<div class="section" id="loja"',
     '<!-- Brand Hub Section -->\n<div class="section" id="loja"'),
    ('padding: 30px; margin: 20px; border-radius: 24px',
     'padding: 24px 16px; margin: 16px auto; max-width: 720px; box-sizing: border-box; overflow: hidden; border-radius: 24px'),
    ('grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px',
     'grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 25px'),
    ('padding: 16px; margin: 20px; border-radius: 12px; text-align: left',
     'padding: 16px; margin: 20px 0; border-radius: 12px; text-align: left'),
    ('padding: 16px 32px; border-radius: 50px; font-size: 16px; border: none; cursor: pointer;',
     'padding: 16px 32px; border-radius: 50px; font-size: 16px; border: none; cursor: pointer; max-width: 100%;'),
]
for old, new in subs:
    if old in html:
        html = html.replace(old, new)
        print(f"OK: {old[:60]}...")
    else:
        print(f"SKIP (nao encontrado): {old[:60]}...")

if html != orig:
    open(path, "w", encoding="utf-8").write(html)
    print("index.html atualizado")
else:
    print("index.html sem alteracoes")

# bump cache do service worker
sw_path = "sw.js"
sw = open(sw_path, encoding="utf-8").read()
m = re.search(r"(asf-[a-z-]*v)(\d+)", sw)
if m:
    new_sw = sw[:m.start()] + m.group(1) + str(int(m.group(2)) + 1) + sw[m.end():]
    open(sw_path, "w", encoding="utf-8").write(new_sw)
    print(f"sw.js cache bump: {m.group(1)}{m.group(2)} -> {m.group(1)}{int(m.group(2))+1}")
else:
    print("sw.js: padrao de versao nao encontrado, sem bump")
