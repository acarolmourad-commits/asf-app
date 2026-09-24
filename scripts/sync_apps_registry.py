#!/usr/bin/env python3
"""
ASF Apps Registry Sync (Fase 9 - centralizacao de dados do monolito)

Fonte unica de verdade: data/apps.json (lista dos 52 satelites + hub).
Este script:
  1. Regenera o array APPS em asf-network.js a partir do registry (--write).
  2. Valida que os consumidores full-list contem todos os URLs do registry.
     (modo padrao = somente validacao, exit 1 em caso de divergencia)

Uso:
  python3 scripts/sync_apps_registry.py          # valida (CI)
  python3 scripts/sync_apps_registry.py --write  # propaga registry -> asf-network.js
"""
import json
import re
import sys

REGISTRY = "data/apps.json"
NETWORK_JS = "asf-network.js"
FULL_LIST_CONSUMERS = [
    "satellites.html",
    "guia-apps.html",
    "rede.html",
    "novidades.html",
    "apps/index.html",
    NETWORK_JS,
]


def load_registry():
    with open(REGISTRY, encoding="utf-8") as f:
        return json.load(f)


def regenerate_network_js(apps):
    """Reescreve o array APPS em asf-network.js preservando o restante do arquivo."""
    with open(NETWORK_JS, encoding="utf-8") as f:
        src = f.read()
    entries = ", ".join(
        '{"u": "%s", "n": "%s"}' % (a["url"], a["name"]) for a in apps
    )
    new, n = re.subn(r"var APPS=\[.*?\];", "var APPS=[%s];" % entries, src, flags=re.S)
    if n != 1:
        print("ERRO: array APPS nao encontrado em", NETWORK_JS)
        sys.exit(2)
    with open(NETWORK_JS, "w", encoding="utf-8") as f:
        f.write(new)
    print("OK:", NETWORK_JS, "regenerado com", len(apps), "apps")


def validate(apps):
    urls = {a["url"] for a in apps}
    slugs = [a["slug"] for a in apps]
    ok = True
    if len(slugs) != len(set(slugs)):
        print("ERRO: slugs duplicados em", REGISTRY)
        ok = False
    for path in FULL_LIST_CONSUMERS:
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
    registry = load_registry()
    apps = registry["apps"]
    print("ASF Apps Registry: %d satelites (hub: %s)" % (len(apps), registry["hub"]))
    if "--write" in sys.argv:
        regenerate_network_js(apps)
    sys.exit(0 if validate(apps) else 1)


if __name__ == "__main__":
    main()
