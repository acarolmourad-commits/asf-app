(function(){'use strict';function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn()}ready(function(){var main=document.querySelector('main')||document.querySelector('.content')||document.body;if(main&&!document.querySelector('.asf-skip-link')){var skip=document.createElement('a');skip.className='asf-skip-link';skip.href='#asf-main';skip.textContent='Pular para o conteúdo';document.body.prepend(skip);if(!main.id)main.id='asf-main'}var bottom=document.querySelector('.bottom-nav');if(bottom&&!bottom.dataset.asfOverflow){bottom.dataset.asfOverflow='1';var items=[].slice.call(bottom.querySelectorAll(':scope > .nav-item'));if(items.length>6){var more=document.createElement('button');more.type='button';more.className='nav-item asf-more-toggle';more.setAttribute('aria-label','Abrir menu completo');more.setAttribute('aria-expanded','false');more.innerHTML='<span class="icon">⇰</span><span class="label">Mais</span>';var menu=document.createElement('div');menu.className='asf-more-menu';menu.setAttribute('aria-label','Mais seções');items.slice(5).forEach(function(item){menu.appendChild(item)});bottom.appendChild(more);document.body.appendChild(menu);more.addEventListener('click',function(){var open=menu.classList.toggle('open');more.setAttribute('aria-expanded',open?'true':'false')});menu.addEventListener('click',function(e){if(e.target.closest('.nav-item')){menu.classList.remove('open');more.setAttribute('aria-expanded','false')}});document.addEventListener('click',function(e){if(!menu.contains(e.target)&&!more.contains(e.target)){menu.classList.remove('open');more.setAttribute('aria-expanded','false')}})}}});})();

/* ASF nav global: pill "Voltar ao app" em paginas sem menu proprio (28/09/2026) */
(function(){'use strict';function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn()}ready(function(){
  if(document.getElementById('header-menu')||document.querySelector('.bottom-nav')||document.querySelector('.asf-back-pill'))return;
  var a=document.createElement('a');
  a.className='asf-back-pill';a.href=(location.pathname.indexOf('/asf-app')===0?'/asf-app/':'/');a.setAttribute('aria-label','Voltar ao app ASF');
  a.textContent='\u2190 App ASF';
  document.body.appendChild(a);
});})();


/* ------------ FASE 8 - Mural das Manas / Bottom Nav / SW offline (01/10/2026) ------------
   Injeta os modulos novos de forma aditiva: CSS do mural, bottom nav fixa,
   asf-mural.js apenas se existir #mural-manas, e registra o Service Worker.
   Nao remove nem altera nada existente. */
(function () {
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    if (document.getElementById('asf-fase8')) return;
    var m = document.createElement('meta'); m.id = 'asf-fase8'; m.name = 'asf-fase8'; document.head.appendChild(m);
    window.ASF_BASE = window.ASF_BASE || (location.pathname.indexOf('/asf-app') === 0 ? '/asf-app/' : '/');
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

/* ------------ Destaque editorial: "Presenca no Mar" na home (02/10/2026) ------------
   Aditivo e idempotente: so injeta o card na pagina inicial, sem tocar no HTML estatico. */
(function () {
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    var base = (location.pathname.indexOf('/asf-app') === 0 ? '/asf-app/' : '/');
    var isHome = /(\/asf-app\/)?(index\.html)?$/.test(location.pathname);
    if (!isHome || document.getElementById('asf-destaque-presenca')) return;
    var ref = document.querySelector('a[href="apps-em-destaque.html"]');
    if (!ref) return;
    var a = document.createElement('a');
    a.id = 'asf-destaque-presenca';
    a.href = base + 'bem-estar/presenca-no-mar-beneficios-da-pratica.html';
    a.style.cssText = 'display:flex;gap:14px;align-items:center;background:linear-gradient(135deg,#0E2439,#00A8CC);border-radius:16px;padding:18px;margin:12px 20px;text-decoration:none;color:#fff;box-shadow:0 4px 14px rgba(0,168,204,.3)';
    a.innerHTML = '<span style="font-size:2rem">\u{1F305}</span><span><b style="display:block">Presen\u00e7a no Mar <span style="background:#f4d03f;color:#0E2439;font-size:10px;padding:2px 8px;border-radius:10px;vertical-align:middle;margin-left:6px">NOVO</span></b><small style="color:rgba(255,255,255,.9)">\u00c1gua com sal, sol nascendo no line-up, vida marinha ao lado \u2014 por que a pr\u00e1tica \u00e9 o que manda na evolu\u00e7\u00e3o</small></span>';
    ref.insertAdjacentElement('afterend', a);
  });
})();
