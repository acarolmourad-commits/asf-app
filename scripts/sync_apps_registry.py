#!/usr/bin/env python3
"""
ASF Apps Registry Sync (Fase 9 - centralizacao de dados do monolito)

Fonte unica de verdade: data/apps.json (49 satelites; a Carteirinha e uma experiencia integrada ao hub): slug, nome, url, icone,
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
from html import escape
import json
import re
import sys

REGISTRY = "data/apps.json"
NETWORK_JS = "asf-network.js"
SATELLITES_HTML = "satellites.html"
APPS_INDEX_HTML = "apps/index.html"
VALIDATE_ONLY = ["index.html", "guia-apps.html", "rede.html", "novidades.html"]
BASE = "https://acarolmourad-commits.github.io"


def load_registry():
    with open(REGISTRY, encoding="utf-8") as f:
        return json.load(f)


# ---------- geradores ----------

def gen_network_js(apps):
    with open(NETWORK_JS, encoding="utf-8") as f:
        src = f.read()
    entries = [json.dumps({"u": a["url"], "n": a["name"]}, ensure_ascii=False) for a in apps]
    if not any(a.get("slug") == "asf-clube" for a in apps):
        entries.append(json.dumps({"u": "https://asf.surf/emitir.html", "n": "💳 ASF Clube → Carteirinha"}, ensure_ascii=False))
    entries = ", ".join(entries)
    new, n = re.subn(r"var APPS=\[.*?\];", "var APPS=[%s];" % entries, src, flags=re.S)
    if n != 1:
        print("ERRO: array APPS nao encontrado em", NETWORK_JS)
        sys.exit(2)
    with open(NETWORK_JS, "w", encoding="utf-8") as f:
        f.write(new)
    print("OK:", NETWORK_JS, "regenerado (%d satélites + Carteirinha)" % len(apps))


def _sat_card(a):
    return ('<a class="card" href="%s"><span class="ic">%s</span><h3>%s</h3><p>%s</p></a>'
            % (a["url"], a["icon"], a["title"], a["desc"]))


def gen_satellites_html(reg):
    apps, extras = reg["apps"], reg.get("extras_satellites", [])
    with open(SATELLITES_HTML, encoding="utf-8") as f:
        src = f.read()

    if re.search(r'http-equiv=[\"\']refresh[\"\']', src, re.I):
        print("OK:", SATELLITES_HTML, "redirect preservado, sem regenerar cards")
        return

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
            % tuple(escape(a[key]) for key in ("url", "icon_apps", "name_apps", "desc_apps")))


def render_apps_index(src, reg):
    start = "<!-- BEGIN ASF REGISTRY -->"
    end = "<!-- END ASF REGISTRY -->"
    if src.count(start) != 1 or src.count(end) != 1 or src.index(start) > src.index(end):
        raise ValueError("marcadores do catálogo ausentes, duplicados ou invertidos")
    by_slug = {app["slug"]: app for app in reg["apps"]}
    order = reg["apps_index_order"]
    if len(order) != len(by_slug) or set(order) != set(by_slug):
        raise ValueError("apps_index_order precisa incluir cada aplicativo uma vez")
    before, after_start = src.split(start)
    _, after = after_start.split(end)
    cards = "\n".join(_app_line(by_slug[slug]) for slug in order)
    return before + start + "\n" + cards + "\n" + end + after


def gen_apps_index_html(reg):
    with open(APPS_INDEX_HTML, encoding="utf-8") as f:
        src = f.read()
    new = render_apps_index(src, reg)
    with open(APPS_INDEX_HTML, "w", encoding="utf-8") as f:
        f.write(new)
    print("OK:", APPS_INDEX_HTML, "regenerado (%d aplicativos)" % len(reg["apps"]))


# ---------- validacao ----------

def validate(reg):
    from html.parser import HTMLParser
    from urllib.parse import urlsplit

    class Links(HTMLParser):
        def __init__(self):
            super().__init__()
            self.hrefs = set()
            self.refresh = []
            self.canonical = []
        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            if tag == "a" and attrs.get("href"):
                self.hrefs.add(attrs["href"])
            if tag == "link" and "canonical" in attrs.get("rel", "").split():
                self.canonical.append(attrs.get("href", ""))
            if tag == "meta" and attrs.get("http-equiv", "").lower() == "refresh":
                value = attrs.get("content", "")
                match = re.search(r"^\s*0\s*;\s*url\s*=\s*(.+)$", value, re.I)
                self.refresh.append(match.group(1).strip().strip("\"'") if match else "")

    apps = reg["apps"]
    slugs = [a["slug"] for a in apps]
    urls = [a["url"] for a in apps]
    ok = True
    if len(slugs) != len(set(slugs)) or len(urls) != len(set(urls)):
        print("ERRO: slugs ou URLs duplicados em", REGISTRY)
        ok = False
    if any(urlsplit(u).scheme != "https" or not urlsplit(u).netloc for u in urls):
        print("ERRO: URL insegura ou invalida no registry")
        ok = False
    consolidated = {"asf-previsao", "asf-mare", "asf-vento", "asf-swell", "asf-clube"}
    forecast = "https://previsao.asf.surf/"
    legacy_forecast = BASE + "/asf-previsao/"
    carteirinha = "https://asf.surf/emitir.html"
    guide = reg["hub"].rstrip("/") + "/guia-apps.html"

    for path in VALIDATE_ONLY + [NETWORK_JS, SATELLITES_HTML, APPS_INDEX_HTML]:
        try:
            content = open(path, encoding="utf-8").read()
        except FileNotFoundError:
            print("ERRO: consumidor nao encontrado:", path)
            ok = False
            continue
        if path == NETWORK_JS:
            missing = [a["url"] for a in apps if a["url"] not in content]
            if "https://asf.surf/emitir.html" not in content:
                print("ERRO: experiencia Carteirinha ausente em", NETWORK_JS)
                ok = False
        else:
            if path == APPS_INDEX_HTML:
                try:
                    if render_apps_index(content, reg) != content:
                        print("ERRO: catálogo desatualizado; execute scripts/sync_apps_registry.py --write")
                        ok = False
                except ValueError as exc:
                    print("ERRO:", path, str(exc))
                    ok = False
            parsed = Links()
            parsed.feed(content)
            if path in {SATELLITES_HTML, "rede.html"}:
                # Redirect pages deliberately do not duplicate the full catalog.
                if parsed.refresh == [guide] and parsed.canonical == [guide] and guide in parsed.hrefs:
                    print("OK:", path, "redirect canonical para guia validado separadamente")
                else:
                    print("ERRO: redirect/canonical/fallback divergente em", path)
                    ok = False
                continue
            missing = []
            if path == "index.html" and carteirinha not in parsed.hrefs:
                print("ERRO: experiencia Carteirinha ausente em", path)
                ok = False
            for app in apps:
                accepted = {app["url"]}
                if app["slug"] in consolidated:
                    accepted |= {forecast, legacy_forecast}
                if app["slug"] == "asf-clube":
                    accepted.add(carteirinha)
                if app["slug"] == "asf-tempo":
                    # O domínio oficial curto também é usado pelos consumidores editoriais.
                    accepted.add("https://tempo.asf.surf/")
                if not accepted.intersection(parsed.hrefs):
                    missing.append(app["url"])
        if missing:
            print("DIVERGENCIA em %s — faltam %d URL(s):" % (path, len(missing)))
            for url in sorted(missing):
                print("   -", url)
            ok = False
        else:
            print("OK:", path, "(%d entradas, aliases explicitos)" % len(apps))
    return ok


def main():
    reg = load_registry()
    apps = reg["apps"]
    print("ASF Apps Registry v%s: %d satélites + Carteirinha (hub: %s)" % (reg.get("version", "?"), len(apps), reg["hub"]))
    if "--write" in sys.argv:
        gen_network_js(apps)
        gen_satellites_html(reg)
        gen_apps_index_html(reg)
    sys.exit(0 if validate(reg) else 1)


if __name__ == "__main__":
    main()
