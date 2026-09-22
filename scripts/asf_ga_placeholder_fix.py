# -*- coding: utf-8 -*-
"""ASF fix: remove o placeholder de Google Analytics G-XXXXXXXXXX do index.html.
Preserva toda a estrutura. Idempotente.
Para ativar o GA de verdade: configurar um Measurement ID real e carregar gtag.js."""

p = 'index.html'
h = open(p, encoding='utf-8').read()

old = """  gtag('config', 'G-XXXXXXXXXX', {
    page_title: document.title,
    page_location: window.location.href,
    user_id: getUserId ? getUserId() : undefined
  });"""

new = """  // ASF: Google Analytics desativado - placeholder G-XXXXXXXXXX removido.
  // Para ativar: 1) carregar o script gtag.js com um Measurement ID real (G-...);
  // 2) descomentar o bloco abaixo substituindo GA_MEASUREMENT_ID.
  // gtag('config', 'GA_MEASUREMENT_ID', {
  //   page_title: document.title,
  //   page_location: window.location.href,
  //   user_id: getUserId ? getUserId() : undefined
  // });"""

if old in h:
    h = h.replace(old, new)
    open(p, 'w', encoding='utf-8').write(h)
    print('GA placeholder removido de index.html')
else:
    print('Nada a corrigir (placeholder ausente).')