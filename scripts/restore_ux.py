#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Restaura asf-ux.js do commit anterior a f71f51e (que o truncou, quebrando menu/busca/carteirinha)
e reaplica o bloco FASE 8 com ASF_BASE corrigido. Idempotente."""
import pathlib, subprocess

FULL = subprocess.check_output(
    ["git", "show", "f71f51e7380092c9b1333abc8b6d97b659a1751b^:asf-ux.js"]).decode("utf-8")
assert "FASE 5.1" in FULL and "FASE 9" in FULL, "versao historica inesperada"

FASE8 = '''

/* ---------- FASE 8 - Mural das Manas / Bottom Nav / SW offline (01/10/2026) ----------
   Injeta os modulos novos de forma aditiva. ASF_BASE detecta dominio custom
   (asf.surf -> /) vs GitHub Pages de projeto (/asf-app/). */
(function () {
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    if (document.getElementById('asf-fase8')) return;
    var m = document.createElement('meta'); m.id = 'asf-fase8'; m.name = 'asf-fase8'; document.head.appendChild(m);
    window.ASF_BASE = window.ASF_BASE || (location.pathname.indexOf('/asf-app/') === 0 ? '/asf-app/' : '/');
    var base = window.ASF_BASE;
    if (!document.querySelector('link[href*="asf-mural.css"]')) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = base + 'asf-mural.css'; document.head.appendChild(l);
    }
    if (!document.querySelector('script[src*="asf-bottomnav.js"]')) {
      var s = document.createElement('script'); s.src = base + 'asf-bottomnav.js'; s.defer = true; document.body.appendChild(s);
    }
    if (document.getElementById('mural-manas') && !document.querySelector('script[src*="asf-mural.js"]')) {
      var s2 = document.createElement('script'); s2.src = base + 'asf-mural.js'; s2.defer = true; document.body.appendChild(s2);
    }
    if ('serviceWorker' in navigator) navigator.serviceWorker.register(base + 'sw.js').catch(function () {});
  });
})();
'''

novo = FULL if 'FASE 8' in FULL else FULL + FASE8
atual = pathlib.Path('asf-ux.js').read_text(encoding='utf-8')
if novo != atual:
    pathlib.Path('asf-ux.js').write_text(novo, encoding='utf-8')
    print('asf-ux.js restaurado:', len(atual), '->', len(novo))
else:
    print('nada a fazer')
