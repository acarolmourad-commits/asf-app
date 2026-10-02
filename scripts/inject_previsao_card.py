#!/usr/bin/env python3
"""Injeta o script asf-previsao-card.js na home (aditivo, idempotente)."""
import pathlib

TAG = '  <script defer src="./asf-previsao-card.js"></script>\n'

p = pathlib.Path("index.html")
t = p.read_text(encoding="utf-8")
if "asf-previsao-card.js" in t:
    print("index.html: ja atualizado, nada a fazer")
else:
    assert t.count("</body>") == 1
    t = t.replace("</body>", TAG + "</body>")
    p.write_text(t, encoding="utf-8")
    print("index.html: card de previsao incluido")
