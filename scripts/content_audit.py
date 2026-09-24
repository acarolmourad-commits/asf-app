#!/usr/bin/env python3
"""ASF Content Audit — validação automática pré-publicação.
Detecta: títulos duplicados, canonicals duplicados/ausentes, páginas internas
indexáveis, meta descriptions duplicadas. Gera relatório:
OK | DUPLICADO | CONFLITO | OBSOLETO | PENDÊNCIA
"""
import os, re, sys, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://acarolmourad-commits.github.io/asf-app/"
INTERNAL_DIRS = ("docs/", "scripts/", "meta-integration/", ".github/")

report = []
titles, canonicals, descriptions = {}, {}, {}

def add(path, status, msg):
    report.append({"arquivo": path, "status": status, "detalhe": msg})

html_files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    rel_dir = os.path.relpath(dirpath, ROOT)
    if rel_dir.startswith(".git"):
        continue
    for fn in filenames:
        if fn.endswith(".html"):
            html_files.append(os.path.relpath(os.path.join(dirpath, fn), ROOT))

for path in sorted(html_files):
    raw = open(os.path.join(ROOT, path), encoding="utf-8", errors="ignore").read()
    is_internal = path.startswith(INTERNAL_DIRS)
    title = (re.search(r"<title>(.*?)</title>", raw, re.S | re.I) or [None, ""])[1].strip()
    canon = (re.search(r'rel="canonical"\s+href="(.*?)"', raw, re.S | re.I) or [None, ""])[1].strip()
    desc = (re.search(r'name="description"\s+content="(.*?)"', raw, re.S | re.I) or [None, ""])[1].strip()
    noindex = "noindex" in raw.lower()

    if is_internal and not noindex:
        add(path, "OBSOLETO", "Página interna/teste sem noindex — deve ser noindex ou sair do ar")
        continue

    if title:
        if title in titles:
            add(path, "DUPLICADO", f"Título idêntico ao de {titles[title]}: '{title[:60]}'")
        else:
            titles[title] = path
    elif not is_internal:
        add(path, "PENDÊNCIA", "Página pública sem <title>")

    if canon:
        if canon in canonicals and canonicals[canon] != path:
            other = canonicals[canon]
            # canonical apontando para outra página é legítimo (consolidação)
            if canon.endswith(path.split("/")[-1]) or canon.endswith(path + "/"):
                add(path, "CONFLITO", f"Canonical idêntico ao de {other}: {canon}")
        else:
            canonicals.setdefault(canon, path)
    elif not is_internal and not noindex:
        add(path, "PENDÊNCIA", "Página pública indexável sem rel=canonical")

    if desc:
        if desc in descriptions:
            add(path, "DUPLICADO", f"Meta description idêntica à de {descriptions[desc]}")
        else:
            descriptions[desc] = path

    if not any(r["arquivo"] == path for r in report):
        add(path, "OK", "sem problemas detectados")

counts = {}
for r in report:
    counts[r["status"]] = counts.get(r["status"], 0) + 1

print("# 📋 ASF Content Audit Report")
print(f"Páginas HTML analisadas: {len(html_files)}")
for s in ["OK", "DUPLICADO", "CONFLITO", "OBSOLETO", "PENDÊNCIA"]:
    print(f"- {s}: {counts.get(s, 0)}")
print()
for r in report:
    if r["status"] != "OK":
        print(f"[{r['status']}] {r['arquivo']} — {r['detalhe']}")

os.makedirs(os.path.join(ROOT, "docs", "generated"), exist_ok=True)
with open(os.path.join(ROOT, "docs", "generated", "content-audit.json"), "w", encoding="utf-8") as f:
    json.dump({"total": len(html_files), "resumo": counts, "itens": report}, f, ensure_ascii=False, indent=2)

# Falha o job se houver DUPLICADO ou CONFLITO em páginas públicas
blocking = [r for r in report if r["status"] in ("DUPLICADO", "CONFLITO")]
sys.exit(1 if blocking else 0)
