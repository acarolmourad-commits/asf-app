#!/usr/bin/env python3
"""
ASF — Refatoração do index.html (executar localmente com `git`).

O index.html tem ~1,1 MB com milhares de estilos inline e 7 blocos <style>.
Este script:
  1. Adiciona viewport-fit=cover à tag viewport (safe-area em iPhones);
  2. Extrai os blocos <style> para css/index-extracted.css (preservando a ordem);
  3. Substitui os blocos por um único <link rel="stylesheet">;
  4. Move imagens base64 embutidas para assets/images/ (opcional, --images).

Uso:
    git clone https://github.com/acarolmourad-commits/asf-app.git
    cd asf-app
    python scripts/refactor_index.py
    git add -A && git commit -m "refactor: extract inline styles from index.html" && git push

Depois revise o diff (`git diff HEAD~1`) e valide o site antes de fazer push.
"""
import re
import base64
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
CSS_OUT = ROOT / "css" / "index-extracted.css"


def fix_viewport(html: str) -> str:
    old = '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    new = '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">'
    if new in html:
        print("viewport: já corrigido")
        return html
    assert old in html, "tag viewport esperada não encontrada"
    print("viewport: viewport-fit=cover adicionado")
    return html.replace(old, new, 1)


def extract_styles(html: str) -> str:
    blocks = re.findall(r"<style>(.*?)</style>", html, flags=re.S)
    if not blocks:
        print("styles: nenhum bloco <style> encontrado")
        return html
    CSS_OUT.parent.mkdir(exist_ok=True)
    CSS_OUT.write_text(
        "/* Extraído de index.html — manter ordem (cascata) */\n\n"
        + "\n\n".join(b.strip() for b in blocks),
        encoding="utf-8",
    )
    link = '    <link rel="stylesheet" href="css/index-extracted.css">'
    html = re.sub(r"<style>.*?</style>", "", html, flags=re.S)
    html = html.replace('<link rel="stylesheet" href="subscriber-styles.css">',
                        '<link rel="stylesheet" href="subscriber-styles.css">\n' + link, 1)
    print(f"styles: {len(blocks)} blocos extraídos para {CSS_OUT.relative_to(ROOT)}")
    return html


def extract_images(html: str) -> str:
    """Opcional: move data:image/...;base64 para arquivos (chame com --images)."""
    out_dir = ROOT / "assets" / "images" / "extracted"
    out_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    def repl(m):
        nonlocal count
        ext = {"jpeg": "jpg"}.get(m.group(1), m.group(1))
        count += 1
        name = f"inline-{count}.{ext}"
        (out_dir / name).write_bytes(base64.b64decode(m.group(2)))
        return f"assets/images/extracted/{name}"

    html = re.sub(r"data:image/(png|jpeg|gif|webp);base64,([A-Za-z0-9+/=\s]+?)(?=[\"')])", repl, html)
    print(f"images: {count} imagens base64 extraídas")
    return html


def main():
    html = INDEX.read_text(encoding="utf-8")
    before = len(html)
    html = fix_viewport(html)
    html = extract_styles(html)
    if "--images" in sys.argv:
        html = extract_images(html)
    INDEX.write_text(html, encoding="utf-8")
    print(f"index.html: {before:,} -> {len(html):,} bytes")
    print("Revise com `git diff` e teste o site antes do push.")


if __name__ == "__main__":
    main()
