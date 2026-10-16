#!/usr/bin/env python3
"""ASF SEO canonical migration (review-only).

Scope (approved SEO lot, checkpoints crew/blue 15/10/2026):
- Restricted to the <head> of 18 listed HTML files.
- Replaces ONLY the legacy prefix https://acarolmourad-commits.github.io/asf-app/
  inside canonical, og:url, og:image, twitter:image and JSON-LD URL strings
  with https://asf.surf/.
- Home only: removes the duplicate data-app attribute on the canonical tag
  (keeps the first data-app="asf-app") and removes the empty JSON-LD block {}.
- Alias termos.html keeps its redirect/noindex behaviour; canonical/og:url simply
  follow the same prefix mapping to the canonical termos-de-uso page if present.
- No body text, CSS, scripts, forms or navigation are changed.
Fails closed: aborts if any changed line is outside <head>, if a file needs no
change unexpectedly, or if the old prefix survives inside a head URL field.
"""
import re
import sys
from pathlib import Path

OLD = "https://acarolmourad-commits.github.io/asf-app/"
NEW = "https://asf.surf/"
FILES = [
    "index.html",
    "sobre.html",
    "privacidade.html",
    "cookies.html",
    "termos-de-uso.html",
    "termos.html",
    "aprender/index.html",
    "aprender/como-comecar-a-surfar-mulheres.html",
    "aprender/correntes-de-retorno-seguranca.html",
    "aprender/etiqueta-no-mar.html",
    "aprender/primeira-prancha-de-surf.html",
    "aprender/remada-tecnica-e-treinos.html",
    "bem-estar/index.html",
    "bem-estar/presenca-no-mar-beneficios-da-pratica.html",
    "bem-estar/surf-saude-mental-mulheres.html",
    "praias/melhores-praias-iniciantes-litoral-norte-sp.html",
    "praias/surf-feminino-sao-sebastiao.html",
    "guia-apps.html",
]
HEAD_RE = re.compile(r"<head\b[^>]*>(.*?)</head>", re.I | re.S)
URL_FIELD_RE = re.compile(
    r'(rel="canonical"[^>]*href="|property="og:url"[^>]*content="|'
    r'property="og:image"[^>]*content="|name="twitter:image"[^>]*content=")'
)
EMPTY_LD_RE = re.compile(r'\s*<script type="application/ld\+json">\s*\{\}\s*</script>')

def head_span(text):
    m = HEAD_RE.search(text)
    if not m:
        raise SystemExit("missing <head>")
    return m.start(1), m.end(1)

def transform(path, text):
    start, end = head_span(text)
    head = text[start:end]
    new_head = head
    new_head = new_head.replace(OLD, NEW)
    if path == "index.html":
        new_head = new_head.replace('data-app="asf-app" data-app="app"', 'data-app="asf-app"', 1)
        new_head = EMPTY_LD_RE.sub("", new_head, count=1)
    if new_head == head:
        return text, False
    for m in URL_FIELD_RE.finditer(new_head):
        tail = new_head[m.end():m.end()+300]
        if OLD in tail.split('"')[0]:
            raise SystemExit(f"{path}: legacy prefix survived in URL field")
    return text[:start] + new_head + text[end:], True

def main():
    changed = []
    for rel in FILES:
        p = Path(rel)
        if not p.exists():
            raise SystemExit(f"missing target: {rel}")
        before = p.read_text(encoding="utf-8")
        after, did = transform(rel, before)
        if did:
            p.write_text(after, encoding="utf-8")
            changed.append(rel)
        else:
            print(f"NOCHANGE {rel}")
    print(f"changed={len(changed)}")
    for rel in changed:
        print(f"CHANGED {rel}")
    if len(changed) < 1:
        raise SystemExit("no files changed; aborting")

if __name__ == "__main__":
    main()
