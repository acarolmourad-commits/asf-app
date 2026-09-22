#!/usr/bin/env python3
"""ASF App: preparação AdSense/SEO no index.html (idempotente).
1. Substitui o placeholder GA4 'G-XXXXXXXXXX' por stub seguro desativado
   (mantém gtag() definido para não quebrar chamadas existentes; nenhum dado é enviado
   enquanto window.ASF_GA_ID não for definido com um ID real).
2. Corrige o 'logo' do schema.org (SportsOrganization), que apontava para uma foto
   genérica do Unsplash, para a logo oficial ASF hospedada no próprio site.
Não altera layout, identidade visual nem funcionalidades.
"""
import re, sys

p = "index.html"
s = open(p, encoding="utf-8").read()
orig = s

# 1) Stub gtag seguro (só envia se ASF_GA_ID real estiver definido)
s, n1 = re.subn(
    r"function gtag\(\)\{dataLayer\.push\(arguments\);\}",
    "function gtag(){ if (window.ASF_GA_ID) { window.dataLayer.push(arguments); } }",
    s,
)

# 2) Remove bloco de config com ID placeholder e substitui por ativação condicional
pattern_config = re.compile(
    r"gtag\('js', new Date\(\)\);\s*gtag\('config', 'G-XXXXXXXXXX', \{\s*"
    r"page_title: document\.title,\s*page_location: window\.location\.href,\s*"
    r"user_id: getUserId \? getUserId\(\) : undefined\s*\}\);",
    re.S,
)
new_block = (
    "// GA4 desativado: nenhum ID real configurado (placeholder G-XXXXXXXXXX removido).\n"
    "  // Para ativar: defina window.ASF_GA_ID = 'G-SEU-ID-REAL' antes deste bloco.\n"
    "  if (window.ASF_GA_ID) {\n"
    "    var _ga = document.createElement('script'); _ga.async = true;\n"
    "    _ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.ASF_GA_ID;\n"
    "    document.head.appendChild(_ga);\n"
    "    gtag('js', new Date());\n"
    "    gtag('config', window.ASF_GA_ID, {\n"
    "      page_title: document.title,\n"
    "      page_location: window.location.href,\n"
    "      user_id: getUserId ? getUserId() : undefined\n"
    "    });\n"
    "  }"
)
s, n2 = pattern_config.subn(new_block, s)

# 3) Logo do schema.org -> logo oficial ASF
old_logo = '"logo": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=200&h=200&fit=crop"'
new_logo = '"logo": "https://acarolmourad-commits.github.io/asf-app/assets/images/asf-logo.png"'
n3 = s.count(old_logo)
s = s.replace(old_logo, new_logo)
if n3 == 0:
    s, n3 = re.subn(
        r'"logo": "https://images\.unsplash\.com[^"]*"',
        new_logo,
        s,
    )

print(f"gtag stub: {n1} | config placeholder: {n2} | logo schema: {n3}")

if s != orig:
    open(p, "w", encoding="utf-8").write(s)
    print("index.html atualizado.")
    if "G-XXXXXXXXXX" in s:
        print("AVISO: ainda resta ocorrência de G-XXXXXXXXXX", file=sys.stderr)
        sys.exit(1)
else:
    print("Nada a alterar (já corrigido).")
