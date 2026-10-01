#!/usr/bin/env python3
"""Insere card do asf-swell no guia-apps.html (editorial) - idempotente."""
import io, re

p = "guia-apps.html"
s = io.open(p, encoding="utf-8").read()

if "asf-swell" in s:
    print("guia-apps.html ja contem asf-swell")
else:
    anchor = '<a class="app" href="https://acarolmourad-commits.github.io/asf-vento/"><b>💨 Vento</b><span>Vento ao vivo nas praias do litoral norte</span></a>'
    novo = anchor + '\n<a class="app" href="https://acarolmourad-commits.github.io/asf-swell/"><b>🌀 Swell</b><span>Direção e período do swell por spot + melhor janela do dia</span></a>'
    assert anchor in s, "anchor asf-vento nao encontrado"
    s = s.replace(anchor, novo, 1)
    s2, n = re.subn(r'(<span id="cont">)\d+(</span>)', lambda m: m.group(1) + str(int(re.search(r'<span id="cont">(\d+)</span>', s).group(1)) + 1) + m.group(2), s, count=1)
    s = s2
    io.open(p, "w", encoding="utf-8").write(s)
    print("Card asf-swell inserido e contador atualizado")
