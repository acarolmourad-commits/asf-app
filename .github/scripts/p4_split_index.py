#!/usr/bin/env python3
"""P4: extrai CSS/JS inline do index.html para assets cacheáveis.
Gera branch refactor com validação round-trip (fidelidade byte a byte)."""
import re, os, subprocess, sys

SRC = 'index.html'
orig = open(SRC, encoding='utf-8').read()
src = orig

os.makedirs('assets/css', exist_ok=True)
os.makedirs('assets/js/inline', exist_ok=True)

# --- CSS: concatena blocos <style> em ordem, link na posição do 1º ---
style_blocks = [m.group(1) for m in re.finditer(r'<style[^>]*>([\s\S]*?)</style>', src)]
assert style_blocks, 'nenhum <style> encontrado'
css = '\n\n'.join(f'/* ==== bloco {i} (ordem original preservada) ==== */\n{body.strip()}'
                  for i, body in enumerate(style_blocks, 1)) + '\n'
# fix: fecha regra html{scroll-behavior:smooth;} que engolia o bloco :root (bug pré-existente)
css = css.replace('html{scroll-behavior:smooth;\n        :root {',
                  'html{scroll-behavior:smooth;}\n\n        :root {', 1)
assert css.count('{') == css.count('}'), 'CSS braces desbalanceadas'
open('assets/css/asf-inline.css', 'w', encoding='utf-8').write(css)

first = True
def rep_style(m):
    global first
    if first:
        first = False
        return '    <link rel="stylesheet" href="assets/css/asf-inline.css">'
    return ''
src = re.sub(r'[ \t]*<style[^>]*>[\s\S]*?</style>\n?', rep_style, src)

# --- JS: extrai <script> inline (sem src, exceto ld+json) preservando ordem ---
js_files = []
def rep_script(m):
    tag = m.group(0)
    if 'application/ld+json' in tag:
        return tag
    body = re.sub(r'^<script[^>]*>|</script>$', '', tag)
    js_files.append(body)
    return f'<script src="assets/js/inline/asf-inline-{len(js_files):02d}.js"></script>'
src = re.sub(r'<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?</script>', rep_script, src)

for n, body in enumerate(js_files, 1):
    open(f'assets/js/inline/asf-inline-{n:02d}.js', 'w', encoding='utf-8').write(body.strip('\n') + '\n')

# --- fix: remove </div> órfão pré-existente após "Resultados Recentes" ---
pat = '                </div>\n            </div>\n        </div>\n\n\n    <!-- Surf News Section -->'
if pat in src:
    src = src.replace(pat, '                </div>\n            </div>\n\n\n    <!-- Surf News Section -->', 1)

open(SRC, 'w', encoding='utf-8').write(src)

# ============ VALIDAÇÃO ROUND-TRIP ============
def norm(t): return re.sub(r'\s+', '', t)

# 1) markup idêntico (descontando o <link> inserido)
def markup(t):
    t = re.sub(r'<script[\s\S]*?</script>', '', t)
    t = re.sub(r'<style[\s\S]*?</style>', '', t)
    return norm(t)
assert markup(orig) == markup(src.replace('<link rel="stylesheet" href="assets/css/asf-inline.css">', '')), 'markup divergiu!'

# 2) JS fiel, ordem preservada
old_js = [re.sub(r'^<script[^>]*>|</script>$', '', m.group(0))
          for m in re.finditer(r'<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?</script>', orig)
          if 'ld+json' not in m.group(0)]
assert len(old_js) == len(js_files), f'contagem JS {len(old_js)} != {len(js_files)}'
for i, (o, n) in enumerate(zip(old_js, js_files), 1):
    assert norm(o) == norm(n.strip('\n')), f'JS {i} divergiu!'

# 3) CSS fiel (descontando comentários e o fix do brace)
old_css = norm('\n'.join(b.strip() for b in style_blocks))
new_css = norm(re.sub(r'/\* ==== bloco \d+[^\n]*\n', '', css).replace('smooth;}', 'smooth;'))
assert old_css == new_css, 'CSS divergiu!'

# 4) balanço estrutural
t2 = re.sub(r'<script[\s\S]*?</script>', '', src)
assert len(re.findall(r'<script\b', src)) == len(re.findall(r'</script>', src)), 'script tags desbalanceadas'
assert len(re.findall(r'<div\b', t2)) == len(re.findall(r'</div>', t2)), 'div tags desbalanceadas'

print(f'OK: index.html {len(orig)} -> {len(src)} bytes; {len(js_files)} JS + 1 CSS extraídos; round-trip validado.')
