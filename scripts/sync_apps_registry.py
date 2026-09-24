#!/usr/bin/env python3
"""
ASF Apps Registry Sync (Fase 9 - centralizacao de dados do monolito)

Fonte unica de verdade: data/apps.json (52 satelites: slug, nome, url, icone,
categoria, descricoes por contexto, ordens e extras).

Modos:
  python3 scripts/sync_apps_registry.py           # valida tudo (CI), exit 1 se drift
  python3 scripts/sync_apps_registry.py --write   # regenera consumidores a partir do registry

Consumidores regenerados com --write:
  - asf-network.js        (array APPS)
  - satellites.html       (cards por categoria, preservando extras)
  - apps/index.html       (lista alfabetica, na ordem registrada)

Consumidores somente validados (markup editorial proprio):
  - guia-apps.html, rede.html, novidades.html
"""
import json
import re
import sys

REGISTRY = "data/apps.json"
NETWORK_JS = "asf-network.js"
SATELLITES_HTML = "satellites.html"
APPS_INDEX_HTML = "apps/index.html"
VALIDATE_ONLY = ["guia-apps.html", "rede.html", "novidades.html"]
BASE = "https://acarolmourad-commits.github.io"


def load_registry():
    with open(REGISTRY, encoding="utf-8") as f:
        return json.load(f)


# ---------- geradores ----------

def gen_network_js(apps):
    with open(NETWORK_JS, encoding="utf-8") as f:
        src = f.read()
    entries = ", ".join('{"u": "%s", "n": "%s"}' % (a["url"], a["name"]) for a in apps)
    new, n = re.subn(r"var APPS=\[.*?\];", "var APPS=[%s];" % entries, src, flags=re.S)
    if n != 1:
        print("ERRO: array APPS nao encontrado em", NETWORK_JS)
        sys.exit(2)
    with open(NETWORK_JS, "w", encoding="utf-8") as f:
        f.write(new)
    print("OK:", NETWORK_JS, "regenerado (%d apps)" % len(apps))


def _sat_card(a):
    return ('<a class="card" href="%s"><span class="ic">%s</span><h3>%s</h3><p>%s</p></a>'
            % (a["url"], a["icon"], a["title"], a["desc"]))


def gen_satellites_html(reg):
    apps, extras = reg["apps"], reg.get("extras_satellites", [])
    with open(SATELLITES_HTML, encoding="utf-8") as f:
        src = f.read()

    def block(cat):
        out = []
        for a in apps:
            if a["category"] != cat:
                continue
            out.append(_sat_card(a))
            out.extend(e["html"] for e in extras if e["after_slug"] == a["slug"])
        return "\n".join(out) + "\n"

    blocks = iter(block(c) for c in reg["categories"])
    new = re.sub(r"(?<=<main>\n).*?(?=</main>)", lambda m: next(blocks), src, flags=re.S)
    with open(SATELLITES_HTML, "w", encoding="utf-8") as f:
        f.write(new)
    print("OK:", SATELLITES_HTML, "regenerado (%d secoes)" % len(reg["categories"]))


def _app_line(a):
    return ('  <a class="app" href="%s" target="_blank" rel="noopener">'
            '<span class="ic">%s</span><span><b>%s</b><small>%s</small></span></a>'
            % (a["url"], a["icon_apps"], a["name_apps"], a["desc_apps"]))


def gen_apps_index_html(reg):
    by_slug = {a["slug"]: a for a in reg["apps"]}
    with open(APPS_INDEX_HTML, encoding="utf-8") as f:
        src = f.read()
    lines = re.findall(r"^  <a class=\"app\" href=\"%s/asf-[^\"]*\".*$" % BASE, src, re.M)
    if not lines:
        print("ERRO: bloco de apps nao encontrado em", APPS_INDEX_HTML)
        sys.exit(2)
    block_old = "\n".join(lines)
    block_new = "\n".join(_app_line(by_slug[s]) for s in reg["apps_index_order"])
    with open(APPS_INDEX_HTML, "w", encoding="utf-8") as f:
        f.write(src.replace(block_old, block_new))
    print("OK:", APPS_INDEX_HTML, "regenerado (%d apps)" % len(lines))


# ---------- validacao ----------

def validate(reg):
    apps = reg["apps"]
    urls = {a["url"] for a in apps}
    slugs = [a["slug"] for a in apps]
    ok = True
    if len(slugs) != len(set(slugs)):
        print("ERRO: slugs duplicados em", REGISTRY)
        ok = False
    for path in VALIDATE_ONLY + [NETWORK_JS, SATELLITES_HTML, APPS_INDEX_HTML]:
        try:
            with open(path, encoding="utf-8") as f:
                content = f.read()
        except FileNotFoundError:
            print("ERRO: consumidor nao encontrado:", path)
            ok = False
            continue
        missing = sorted(u for u in urls if u not in content)
        if missing:
            ok = False
            print("DIVERGENCIA em %s — faltam %d URL(s):" % (path, len(missing)))
            for u in missing:
                print("   -", u)
        else:
            print("OK:", path, "(%d apps)" % len(urls))
    return ok


def main():
    reg = load_registry()
    apps = reg["apps"]
    print("ASF Apps Registry v%s: %d satelites (hub: %s)" % (reg.get("version", "?"), len(apps), reg["hub"]))
    if "--write" in sys.argv:
        gen_network_js(apps)
        gen_satellites_html(reg)
        gen_apps_index_html(reg)
    sys.exit(0 if validate(reg) else 1)


if __name__ == "__main__":
    main()
