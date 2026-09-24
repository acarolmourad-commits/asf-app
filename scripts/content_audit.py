#!/usr/bin/env python3
"""ASF Content Audit — validação automática pré-publicação.
Detecta: títulos duplicados em páginas indexáveis, canonicals conflitantes,
páginas internas indexáveis, meta descriptions duplicadas.
Relatório: OK | DUPLICADO | CONFLITO | OBSOLETO | PENDÊNCIA
Regras: canonical apontando para OUTRA página é consolidação legítima;
conflito só ocorre quando DUAS páginas reivindicam a MESMA canonical própria.
"""
import os, re, sys, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://acarolmourad-commits.github.io/asf-app/"
INTERNAL_DIRS = ("docs/", "scripts/", "meta-integration/", ".github/")

report = []
titles, descriptions = {}, {}
self_canonical = {}  # canonical url -> path que a reivindica como própria

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

    # Títulos duplicados só importam entre páginas indexáveis
    if title and not noindex:
        if title in titles:
            add(path, "DUPLICADO", f"Título idêntico ao de {titles[title]}: '{title[:60]}'")
        else:
            titles[title] = path
    elif not title and not is_internal and not noindex:
        add(path, "PENDÊNCIA", "Página pública sem <title>")

    # Canonical: conflito só se duas páginas reivindicam a mesma canonical como própria
    if canon:
        page_url = BASE + path
        is_self = canon.rstrip("/") in (page_url.rstrip("/"), page_url.replace("index.html", "").rstrip("/"))
        if is_self:
            if canon in self_canonical:
                add(path, "CONFLITO", f"Canonical própria também reivindicada por {self_canonical[canon]}: {canon}")
            else:
                self_canonical[canon] = path
        # canonical para outra página = consolidação intencional, OK
    elif not is_internal and not noindex:
        add(path, "PENDÊNCIA", "Página pública indexável sem rel=canonical")

    if desc and not noindex:
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

blocking = [r for r in report if r["status"] in ("DUPLICADO", "CONFLITO")]
sys.exit(1 if blocking else 0)
