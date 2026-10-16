#!/usr/bin/env python3
"""One-shot consolidation: ASF Clube -> Carteirinha ASF hub anchor."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ANCHOR = "https://asf.surf/#carteirinha"
LEGACY = "https://acarolmourad-commits.github.io/asf-clube/"

def load(rel):
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))

def save(rel, data):
    (ROOT / rel).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def replace(rel, old, new, expected=1):
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    found = text.count(old)
    if found != expected:
        raise SystemExit(f"{rel}: expected {expected} occurrence(s), found {found} for {old[:80]!r}")
    path.write_text(text.replace(old, new), encoding="utf-8")

apps = load("data/apps.json")
found = False
for app in apps["apps"]:
    if app.get("slug") == "asf-clube":
        app.update({
            "url": ANCHOR,
            "name": "💳 ASF Clube → Carteirinha",
            "title": "ASF Clube → Carteirinha",
            "name_apps": "ASF Clube → Carteirinha",
            "desc": "Clube desativado; carteirinha digital e benefícios centralizados na hub ASF",
            "desc_apps": "Clube desativado; acesse a carteirinha digital e os benefícios na hub ASF",
        })
        found = True
if not found:
    raise SystemExit("asf-clube not found in data/apps.json")
save("data/apps.json", apps)

links = load("data/app-links.json")
links["apps"]["asf-clube"] = {
    "github_io": LEGACY,
    "asf_surf": ANCHOR,
    "note": "Consolidado na Carteirinha ASF (hub #carteirinha); pagina antiga do Clube desativada",
}
save("data/app-links.json", links)

replace(
    "scripts/sync_apps_registry.py",
    '    consolidated = {"asf-previsao", "asf-mare", "asf-vento", "asf-swell"}\n    forecast = "https://previsao.asf.surf/"\n    legacy_forecast = BASE + "/asf-previsao/"\n',
    '    consolidated = {"asf-previsao", "asf-mare", "asf-vento", "asf-swell", "asf-clube"}\n    forecast = "https://previsao.asf.surf/"\n    legacy_forecast = BASE + "/asf-previsao/"\n    carteirinha = "https://asf.surf/#carteirinha"\n',
)
replace(
    "scripts/sync_apps_registry.py",
    '                if app["slug"] in consolidated:\n                    accepted |= {forecast, legacy_forecast}\n',
    '                if app["slug"] in consolidated:\n                    accepted |= {forecast, legacy_forecast}\n                if app["slug"] == "asf-clube":\n                    accepted.add(carteirinha)\n',
)
replace("guia-apps.html", LEGACY, ANCHOR)
replace(
    "guia-apps.html",
    "<b>💳 Clube</b><span>Carteirinha digital e benefícios da associada</span>",
    "<b>💳 Clube → Carteirinha</b><span>Clube desativado; carteirinha digital e benefícios centralizados na hub ASF</span>",
)
replace("novidades.html", LEGACY, ANCHOR, expected=2)
replace(
    "novidades.html",
    'pegue sua carteirinha digital no <a href="https://asf.surf/#carteirinha">ASF Clube</a>',
    'acesse sua carteirinha digital na <a href="https://asf.surf/#carteirinha">Carteirinha ASF</a>',
)
replace(
    "novidades.html",
    "<h3>ASF Clube</h3><p>Carteirinha digital e benefícios</p>",
    "<h3>ASF Clube → Carteirinha</h3><p>Clube desativado; carteirinha digital e benefícios centralizados na hub ASF</p>",
)
print("Clube -> Carteirinha source edits applied")
