#!/usr/bin/env python3
"""Divide index.html: extrai <style> e <script> inline para assets externos.
Preserva ordem de carregamento e cascata CSS. Mantém JSON-LD inline.
Idempotente: se já dividido, não faz nada.
"""
import re, os, subprocess, sys

p = 'index.html'
t = open(p, encoding='utf-8').read()

if 'assets/js/inline/asf-inline-01.js' in t:
    print('index.html já dividido — nada a fazer.')
    sys.exit(0)

os.makedirs('assets/css', exist_ok=True)
os.makedirs('assets/js/inline', exist_ok=True)

# --- CSS: todos os <style> num único arquivo, link na posição do primeiro ---
style_blocks = []
def style_repl(m):
    style_blocks.append(m.group(0))
    return '\x00STYLE\x00' if len(style_blocks) == 1 else ''
t = re.sub(r'<style[^>]*>[\s\S]*?</style>', style_repl, t)
if style_blocks:
    css = '\n\n'.join(re.sub(r'</?style[^>]*>', '', s) for s in style_blocks)
    open('assets/css/asf-inline.css', 'w', encoding='utf-8').write(
        '/* Extraído de index.html — ordem original preservada (cascata CSS) */\n' + css)
    t = t.replace('\x00STYLE\x00', '<link rel="stylesheet" href="assets/css/asf-inline.css">')

# --- JS inline: cada bloco vira um arquivo, substituído no mesmo lugar ---
idx = [0]
def script_repl(m):
    block = m.group(0)
    if 'application/ld+json' in block:
        return block
    inner = re.sub(r'^<script[^>]*>', '', block)
    inner = re.sub(r'</script>$', '', inner)
    if '</script' in inner.lower():
        raise SystemExit('ERRO: script aninhado detectado — abortando para não corromper.')
    idx[0] += 1
    fn = f'assets/js/inline/asf-inline-{idx[0]:02d}.js'
    open(fn, 'w', encoding='utf-8').write(
        f'/* Extraído de index.html — bloco inline #{idx[0]} (ordem preservada) */\n' + inner)
    return f'<script src="{fn}"></script>'
t = re.sub(r'<script(?![^>]*src)[^>]*>[\s\S]*?</script>', script_repl, t)

# --- validações ---
assert '\x00' not in t, 'marcador residual!'
rest = re.findall(r'<script(?![^>]*src)[^>]*>[\s\S]*?</script>', t)
assert all('ld+json' in s for s in rest), 'script inline não-JSON-LD restante!'

orig = subprocess.check_output(['git', 'show', 'HEAD:index.html']).decode()
def markup(x):
    x = re.sub(r'<script[\s\S]*?</script>', '', x)
    x = re.sub(r'<style[\s\S]*?</style>', '', x)
    return x
o, n = markup(orig), markup(t)
for tag in ['div', 'section', 'button', 'span', 'a', 'img', 'header', 'footer', 'main', 'nav']:
    co = len(re.findall(rf'<{tag}\b', o)), len(re.findall(rf'</{tag}>', o))
    cn = len(re.findall(rf'<{tag}\b', n)), len(re.findall(rf'</{tag}>', n))
    assert co == cn, f'marcação <{tag}> diverge: {co} vs {cn}'

open(p, 'w', encoding='utf-8').write(t)
print(f'OK — {len(style_blocks)} styles → assets/css/asf-inline.css ({sum(len(s) for s in style_blocks)} B)')
print(f'OK — {idx[0]} scripts inline → assets/js/inline/')
print(f'index.html: {len(orig)} → {len(t)} bytes ({100 - len(t)*100//len(orig)}% menor)')
