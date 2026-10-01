#!/usr/bin/env python3
"""Insere o satelite asf-swell no registry (data/apps.json) - idempotente."""
import json

REG = "data/apps.json"
with open(REG, encoding="utf-8") as f:
    reg = json.load(f)

slug = "asf-swell"
if any(a.get("slug") == slug for a in reg["apps"]):
    print("asf-swell ja registrado")
else:
    entry = {
        "slug": slug,
        "name": "🌀 ASF Swell",
        "url": "https://acarolmourad-commits.github.io/asf-swell/",
        "icon": "🌀",
        "title": "ASF Swell",
        "category": "🌊 Mar & Condições",
        "desc": "Direção e período do swell por spot",
        "icon_apps": "🌀",
        "name_apps": "ASF Swell",
        "desc_apps": "Análise técnica de swell: direção, período e melhor janela do dia por spot"
    }
    idx = len(reg["apps"])
    for i, a in enumerate(reg["apps"]):
        if a.get("slug") == "asf-vento":
            idx = i + 1
    reg["apps"].insert(idx, entry)
    reg["updated"] = "2026-10-01"
    with open(REG, "w", encoding="utf-8") as f:
        json.dump(reg, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("asf-swell registrado na posicao", idx, "- total:", len(reg["apps"]))
