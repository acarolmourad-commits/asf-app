#!/usr/bin/env python3
"""
Fase 9 etapa 3 - centraliza dados inline do index.html em data/:
  - const MOCK_MANAS {...}   -> data/mock-manas.js
  - const translations {...} -> data/translations.js

Idempotente: se os blocos ja foram extraidos, nao faz nada.
Roda no CI (workflow centralize-index-data.yml) porque index.html e grande demais
para edicao via API de conteudo.
"""
import re
import sys

INDEX = "index.html"


def extract_block(src, marker):
    """Retorna (start, end, block) do 'const X = {...};' ou None."""
    start = src.find(marker)
    if start == -1:
        return None
    m = re.search(r"\n\s*\};", src[start:])
    if not m:
        print("ERRO: fim do bloco nao encontrado para", marker)
        sys.exit(2)
    end = start + m.end()
    return start, end, src[start:end]


def main():
    with open(INDEX, encoding="utf-8") as f:
        html = f.read()

    changed = False

    # --- MOCK_MANAS: bloco inteiro dentro de <script type="text/javascript"> proprio ---
    res = extract_block(html, "const MOCK_MANAS")
    if res:
        start, end, block = res
        with open("data/mock-manas.js", "w", encoding="utf-8") as f:
            f.write("// ASF data (Fase 9) - fonte unica: extraido de index.html\n" + block.strip() + "\n")
        # o <script> que contem MOCK_MANAS so contem isso: substitui o bloco todo pelo script externo
        tag_open = html.rfind('<script type="text/javascript">', 0, start)
        tag_close = html.find("</script>", end) + len("</script>")
        html = html[:tag_open] + '<script src="data/mock-manas.js"></script>' + html[tag_close:]
        changed = True
        print("OK: MOCK_MANAS -> data/mock-manas.js (%d chars)" % len(block))

    # --- translations: dentro de um <script> maior; remove o const e injeta script externo antes ---
    res = extract_block(html, "const translations")
    if res:
        start, end, block = res
        with open("data/translations.js", "w", encoding="utf-8") as f:
            f.write("// ASF data (Fase 9) - fonte unica: extraido de index.html\n" + block.strip() + "\n")
        html = html[:start] + "/* translations -> data/translations.js */" + html[end:]
        tag_open = html.rfind("<script>", 0, start)
        html = html[:tag_open] + '<script src="data/translations.js"></script>\n' + html[tag_open:]
        changed = True
        print("OK: translations -> data/translations.js (%d chars)" % len(block))

    if changed:
        with open(INDEX, "w", encoding="utf-8") as f:
            f.write(html)
        print("index.html atualizado")
    else:
        print("Nada a extrair (ja centralizado)")


if __name__ == "__main__":
    main()
