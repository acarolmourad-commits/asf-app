# -*- coding: utf-8 -*-
"""ASF fix: remove placeholder GA (G-XXXXXXXXXX) de index.html e app.js, corrige logo no schema.org e adiciona link da Politica de Cookies no footer. Idempotente."""

def fix(path, pairs):
    try:
        h = open(path, encoding="utf-8").read()
    except FileNotFoundError:
        print(path + ": nao encontrado, pulando")
        return
    changed = False
    for old, new in pairs:
        if old in h:
            h = h.replace(old, new, 1)
            changed = True
    if changed:
        open(path, "w", encoding="utf-8").write(h)
        print(path + ": corrigido")
    else:
        print(path + ": nada a corrigir")

OLD_GA = "window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-XXXXXXXXXX', {\n    page_title: document.title,\n    page_location: window.location.href,\n    user_id: getUserId ? getUserId() : undefined\n  });"
NEW_GA = "// ASF: Google Analytics desativado ate configurar um ID real (G-...).\n  var ASF_GA_ID = '';\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  if (ASF_GA_ID) {\n    gtag('js', new Date());\n    gtag('config', ASF_GA_ID, {\n      page_title: document.title,\n      page_location: window.location.href,\n      user_id: getUserId ? getUserId() : undefined\n    });\n  }"
OLD_LOGO = '"logo": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=200&h=200&fit=crop"'
NEW_LOGO = '"logo": "https://acarolmourad-commits.github.io/asf-app/assets/images/asf-logo.png"'
OLD_LINK = 'href="privacidade.html" target="_blank" style="color: #00A8CC; text-decoration: underline;">Política de Privacidade</a>'
NEW_LINK = 'href="privacidade.html" target="_blank" style="color: #00A8CC; text-decoration: underline;">Política de Privacidade</a> &middot; <a href="cookies.html" target="_blank" style="color: #00A8CC; text-decoration: underline;">Política de Cookies</a>'

fix("index.html", [(OLD_GA, NEW_GA), (OLD_LOGO, NEW_LOGO), (OLD_LINK, NEW_LINK)])
fix("app.js", [(OLD_GA, NEW_GA)])
