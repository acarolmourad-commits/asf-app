# -*- coding: utf-8 -*-
"""FASE 8 one-shot: integra Mural das Manas / bottom nav / SW / chips de categoria.
Aditivo: so acrescenta. Idempotente: pula se marcadores ja existirem."""
import io, sys

FASE8 = '''

/* ---------- FASE 8 - Mural das Manas / Bottom Nav / SW offline (01/10/2026) ----------
   Injeta os modulos novos de forma aditiva: CSS do mural, bottom nav fixa,
   asf-mural.js apenas se existir #mural-manas, e registra o Service Worker.
   Nao remove nem altera nada existente. */
(function () {
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    if (document.getElementById('asf-fase8')) return;
    var m = document.createElement('meta'); m.id = 'asf-fase8'; m.name = 'asf-fase8'; document.head.appendChild(m);
    window.ASF_BASE = window.ASF_BASE || '/asf-app/';
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

CHIPS = '''<script>
/* Chips de categoria do Guia de Apps (aditivo; funciona junto com a busca filtra()) */
(function(){
  const hero=document.querySelector('.hero-card');
  if(!hero) return;
  const cats=[...document.querySelectorAll('.cat[data-cat]')];
  if(!cats.length) return;
  const bar=document.createElement('div');
  bar.id='chips-cat';
  bar.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin-top:10px';
  const busca=document.getElementById('busca');
  const cont=document.getElementById('cont');
  const mk=(label,fn)=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=label;
    b.addEventListener('click',()=>{bar.querySelectorAll('.chip').forEach(c=>c.classList.remove('ativo'));b.classList.add('ativo');
      if(busca)busca.value=''; fn();});return b;};
  bar.appendChild(mk('Todas',()=>{cats.forEach(c=>{c.style.display='';c.querySelectorAll('.app').forEach(a=>a.style.display='');});
    if(cont)cont.textContent=document.querySelectorAll('.app').length;}));
  cats.forEach(c=>{const t=c.querySelector('h2');if(!t)return;
    bar.appendChild(mk(t.textContent.trim(),()=>{cats.forEach(x=>x.style.display=x===c?'':'none');
      if(cont)cont.textContent=c.querySelectorAll('.app').length;}));});
  hero.appendChild(bar);
})();
</script>
'''

BOTTOMNAV_V2 = open('scripts/asf_bottomnav_v2.js', encoding='utf-8').read()

changed = []

def rw(path, fn):
    txt = io.open(path, encoding='utf-8').read()
    new = fn(txt)
    if new != txt:
        io.open(path, 'w', encoding='utf-8').write(new)
        changed.append(path)

rw('asf-ux.js', lambda t: t if 'FASE 8' in t else t + FASE8)
rw('asf-redesign.js', lambda t: t if 'FASE 8' in t else t + FASE8)
rw('asf-bottomnav.js', lambda t: t if 'ASF_BASE' in t else BOTTOMNAV_V2)
rw('guia-apps.html', lambda t: t if 'chips-cat' in t else t.replace('</body>', CHIPS + '</body>', 1))

print('CHANGED:' + ','.join(changed))
if not changed:
    print('NOTHING_TO_DO')
    sys.exit(0)
