#!/usr/bin/env python3
"""Registra o asf-swell como 53o satelite (apps.json + guia-apps.html). Idempotente."""
import json, io

# 1) registry
p = "data/apps.json"
data = json.load(io.open(p, encoding="utf-8"))
if any(a.get("slug") == "asf-swell" for a in data["apps"]):
    print("asf-swell ja registrado no apps.json")
else:
    entry = {
        "slug": "asf-swell",
        "name": "\U0001F30A ASF Swell",
        "url": "https://acarolmourad-commits.github.io/asf-swell/",
        "icon": "\U0001F30A",
        "title": "ASF Swell",
        "category": "\U0001F30A Mar & Condi\u00e7\u00f5es",
        "desc": "Dire\u00e7\u00e3o de swell, \u00e2ngulo de quebra e janela de pico por spot",
        "icon_apps": "\U0001F30A",
        "name_apps": "ASF Swell",
        "desc_apps": "Dire\u00e7\u00e3o e per\u00edodo do swell por spot, com janela de pico do dia"
    }
    idx = next((i for i, a in enumerate(data["apps"]) if a.get("slug") == "asf-vento"), 9)
    data["apps"].insert(idx + 1, entry)
    data["updated"] = "2026-10-01"
    io.open(p, "w", encoding="utf-8").write(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"OK: asf-swell registrado na posicao {idx+2} (total {len(data['apps'])})")

# 2) guia-apps.html (markup editorial proprio)
g = "guia-apps.html"
src = io.open(g, encoding="utf-8").read()
anchor = '<a class="app" href="https://acarolmourad-commits.github.io/asf-vento/"><b>\U0001F4A8 Vento</b><span>Vento ao vivo nas praias do litoral norte</span></a>'
card = anchor + '\n<a class="app" href="https://acarolmourad-commits.github.io/asf-swell/"><b>\U0001F30A Swell</b><span>Dire\u00e7\u00e3o de swell e janela de pico por spot</span></a>'
if "asf-swell" in src:
    print("asf-swell ja presente no guia-apps.html")
elif src.count(anchor) == 1:
    io.open(g, "w", encoding="utf-8").write(src.replace(anchor, card))
    print("OK: card asf-swell inserido no guia-apps.html")
else:
    print(f"AVISO: anchor asf-vento encontrado {src.count(anchor)}x; guia-apps.html nao alterado")
