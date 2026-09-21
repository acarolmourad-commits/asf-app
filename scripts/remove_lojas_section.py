#!/usr/bin/env python3
"""Esvazia a secao #lojas do index.html (titulo, filtros e cards de lojas),
deixando um placeholder 'Marcas Parceiras - em breve' e mantendo o CTA
'Sua loja nao esta aqui? Cadastre-se! / Quero ser parceiro'."""
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
end = text.rfind("\n", body_start, end) + 1

placeholder = '''            <!-- Marcas parceiras: secao reservada para futuras parcerias. Listagem de lojas removida. -->
            <div class="section-header">
                <h2 class="section-title">\U0001F91D Marcas Parceiras</h2>
            </div>

            <div style="text-align: center; padding: 30px 20px; margin: 0 20px; background: var(--light); border-radius: 16px;">
                <p style="font-size: 32px; margin-bottom: 10px;">\U0001F30A</p>
                <p style="font-size: 15px; font-weight: 600; color: var(--gray-800);">Em breve: marcas parceiras da ASF!</p>
                <p style="font-size: 13px; color: var(--gray-600); margin-top: 6px;">Estamos preparando um espa\u00e7o especial para lojas e marcas que apoiam o surf feminino.</p>
            </div>

'''
new_text = text[:body_start] + placeholder + text[end:]
if new_text == text:
    print("Nada a alterar."); sys.exit(0)
with io.open(path, "w", encoding="utf-8") as f:
    f.write(new_text)
print("Secao #lojas esvaziada com sucesso.")
