#!/usr/bin/env python3
"""Remove o conteudo da secao #lojas do index.html (titulo, filtros e cards),
mantendo o bloco de CTA "Quero ser parceiro" para futuras marcas parceiras."""
import io, sys

path = "index.html"
with io.open(path, encoding="utf-8") as f:
    text = f.read()

start_marker = '<div class="section" id="lojas">'
cta_marker = '<div style="text-align: center; margin-top: 20px; padding: 20px; background: var(--light); border-radius: 16px;">'

start = text.find(start_marker)
if start == -1:
    sys.exit("secao #lojas nao encontrada")
body_start = text.index("\n", start) + 1
end = text.find(cta_marker, body_start)
if end == -1:
    sys.exit("bloco CTA nao encontrado")

# recua o 'end' para o inicio da linha do CTA
end = text.rfind("\n", body_start, end) + 1

placeholder = "            <!-- Marcas parceiras: secao reservada para futuras parcerias. Listagem de lojas removida. -->\n"
new_text = text[:body_start] + placeholder + text[end:]

if new_text != text:
    with io.open(path, "w", encoding="utf-8") as f:
        f.write(new_text)
    print("Secao #lojas esvaziada com sucesso.")
else:
    print("Nada a alterar.")
