// Post publishing and create menu functions

// Escapa HTML para evitar injeção via texto do usuário (XSS)
function escHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function publishPost() {
    const textarea = document.getElementById('new-post-text');
    const text = textarea.value.trim();
    if (!text) {
        if (typeof showToast === 'function') showToast('Escreva algo antes de publicar!', 'error');
        return;
    }
    const posts = JSON.parse(localStorage.getItem('asf-posts') || '[]');
    posts.unshift({
        id: Date.now(),
        author: 'Você',
        avatar: '🟡',
        content: text,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0
    });
    localStorage.setItem('asf-posts', JSON.stringify(posts));
    textarea.value = '';
    if (typeof showToast === 'function') showToast('Post publicado! 🏄‍♀️');
    loadUserPosts();
}

function sharePostById(id) {
    const posts = JSON.parse(localStorage.getItem('asf-posts') || '[]');
    const p = posts.find(x => x.id === id);
    if (!p) return;
    if (typeof sharePost === 'function') sharePost(p.content);
}

function loadUserPosts() {
    const container = document.getElementById('user-posts');
    if (!container) return;
    const posts = JSON.parse(localStorage.getItem('asf-posts') || '[]');
    if (posts.length === 0) return;
    container.innerHTML = posts.map(p => `
        <div class="post" style="margin: 0 20px 16px;">
            <div class="post-header">
                <div class="post-avatar">${escHtml(p.avatar || '🟡')}</div>
                <div class="post-info">
                    <h4>${escHtml(p.author)} <span style="font-size:11px;color:var(--gray-400)">• agora</span></h4>
                </div>
            </div>
            <div class="post-content">${escHtml(p.content)}</div>
            <div class="post-actions">
                <button class="post-action"><span>🤍</span> ${Number(p.likes) || 0}</button>
                <button class="post-action"><span>💬</span> ${Number(p.comments) || 0}</button>
                <button class="post-action" onclick="sharePostById(${Number(p.id)})"><span>🔗</span> Compartilhar</button>
            </div>
        </div>
    `).join('');
}

// Create menu for FAB
function showCreateMenu() {
    const menu = `
        <div id="create-menu" style="position: fixed; bottom: 80px; right: 24px; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 1000; padding: 16px; min-width: 200px;">
            <div style="margin-bottom: 12px;">
                <button onclick="showSection('sessoes'); hideCreateMenu()" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; margin-bottom: 8px; cursor: pointer;">💬 Criar Sessão</button>
                <button onclick="document.getElementById('new-post-text').focus(); hideCreateMenu()" style="width: 100%; padding: 12px; background: var(--accent); color: var(--secondary); border: none; border-radius: 8px; margin-bottom: 8px; cursor: pointer;">📝 Novo Post</button>
                <button onclick="showAddGoalModal(); hideCreateMenu()" style="width: 100%; padding: 12px; background: var(--purple); color: white; border: none; border-radius: 8px; cursor: pointer;">🎯 Nova Meta</button>
            </div>
            <button onclick="hideCreateMenu()" style="width: 100%; padding: 8px; background: var(--gray-100); border: none; border-radius: 8px; font-size: 12px;">Cancelar</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', menu);
}

function hideCreateMenu() {
    const menu = document.getElementById('create-menu');
    if (menu) menu.remove();
}

// Load posts on page load
document.addEventListener('DOMContentLoaded', loadUserPosts);

/* ===== ASF Navigation Enhancement ===== */
/* Collapses the 11-item bottom nav into 5 primary shortcuts
   + a "Menu" button that opens an accessible bottom sheet
   with the remaining sections. Sheet items proxy the original
   buttons' click behavior, so no handler changes are needed. */
(function () {
    'use strict';

    var PRIMARY_COUNT = 5; // Dicas, Próximas, Saúde, Pontos, Trips stay in the bar

    function init() {
        var nav = document.querySelector('.bottom-nav');
        if (!nav) return;
        var items = Array.prototype.slice.call(nav.querySelectorAll('.nav-item'));
        if (items.length <= PRIMARY_COUNT + 1) return;

        var overflow = items.slice(PRIMARY_COUNT);

        var backdrop = document.createElement('div');
        backdrop.className = 'asf-nav-sheet-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');

        var sheet = document.createElement('div');
        sheet.className = 'asf-nav-sheet';
        sheet.setAttribute('role', 'dialog');
        sheet.setAttribute('aria-modal', 'true');
        sheet.setAttribute('aria-label', 'Menu completo');

        var handle = document.createElement('div');
        handle.className = 'sheet-handle';
        var title = document.createElement('div');
        title.className = 'sheet-title';
        title.textContent = 'Todas as seções';
        var grid = document.createElement('div');
        grid.className = 'sheet-grid';

        overflow.forEach(function (btn) {
            var icon = btn.querySelector('.icon');
            var label = btn.querySelector('.label');
            var item = document.createElement('button');
            item.className = 'sheet-item';
            item.innerHTML =
                '<span class="icon">' + (icon ? icon.textContent : '•') + '</span>' +
                '<span>' + (label ? label.textContent : (btn.getAttribute('aria-label') || 'Seção')) + '</span>';
            item.addEventListener('click', function () {
                closeSheet();
                btn.click(); // proxy to original handler (handleNavTap / showPremiumModal)
                if (btn.classList.contains('nav-item') && btn.getAttribute('onclick') &&
                    btn.getAttribute('onclick').indexOf('handleNavTap') === 0) {
                    menuBtn.classList.add('active');
                }
                syncAriaCurrent();
            });
            grid.appendChild(item);
            btn.style.display = 'none'; // hide from the bar
        });

        sheet.appendChild(handle);
        sheet.appendChild(title);
        sheet.appendChild(grid);

        var menuBtn = document.createElement('button');
        menuBtn.className = 'nav-item';
        menuBtn.setAttribute('aria-label', 'Abrir menu completo');
        menuBtn.setAttribute('aria-haspopup', 'dialog');
        menuBtn.innerHTML = '<span class="icon">☰</span><span class="label">Menu</span>';

        var anchor = items[PRIMARY_COUNT - 1];
        anchor.parentNode.insertBefore(menuBtn, anchor.nextSibling);

        // Accessibility: keep aria-current in sync with the active item
        function syncAriaCurrent() {
            var all = items.concat([menuBtn]);
            all.forEach(function (b) {
                if (b.classList.contains('active')) b.setAttribute('aria-current', 'page');
                else b.removeAttribute('aria-current');
            });
        }
        items.forEach(function (b) { b.addEventListener('click', syncAriaCurrent); });
        syncAriaCurrent();

        function openSheet() {
            backdrop.classList.add('open');
            sheet.classList.add('open');
            backdrop.style.display = 'block';
            sheet.style.display = 'block';
            document.body.style.overflow = 'hidden';
            var first = sheet.querySelector('.sheet-item');
            if (first) first.focus();
        }
        function closeSheet() {
            backdrop.classList.remove('open');
            sheet.classList.remove('open');
            document.body.style.overflow = '';
            menuBtn.classList.remove('active');
        }

        menuBtn.addEventListener('click', function () {
            sheet.classList.contains('open') ? closeSheet() : openSheet();
        });
        backdrop.addEventListener('click', closeSheet);
        // Touch: swipe down on the sheet to dismiss
        var touchStartY = null;
        sheet.addEventListener('touchstart', function (e) { touchStartY = e.touches[0].clientY; }, {passive: true});
        sheet.addEventListener('touchmove', function (e) {
            if (touchStartY === null) return;
            var dy = e.touches[0].clientY - touchStartY;
            if (dy > 0) sheet.style.transform = 'translateY(' + dy + 'px)';
        }, {passive: true});
        sheet.addEventListener('touchend', function (e) {
            if (touchStartY === null) return;
            var dy = e.changedTouches[0].clientY - touchStartY;
            sheet.style.transform = '';
            if (dy > 80) closeSheet();
            touchStartY = null;
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeSheet();
        });

        items.slice(0, PRIMARY_COUNT).forEach(function (btn) {
            btn.addEventListener('click', function () { menuBtn.classList.remove('active'); });
        });

        document.body.appendChild(backdrop);
        document.body.appendChild(sheet);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// ============================================================
// ASF — Patch de conformidade Google AdSense (2026-09-16)
// 1) Instagram oficial real (@asf.surffeminino — o antigo handle não existe)
// 2) Estatísticas reais no lugar de números inventados
// 3) Links legais visíveis no rodapé (exigência de navegação do AdSense)
// 4) Correção do link da Política de Privacidade e do canal de contato
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  try {
    // 1. Instagram real
    document.querySelectorAll('a[href*="associacaosurffeminino"]').forEach(function (a) {
      a.href = 'https://www.instagram.com/asf.surffeminino';
    });

    // 2. Estatística real: 2,1 mil seguidoras no Instagram @asf.surffeminino
    document.querySelectorAll('.stat-card .stat-label').forEach(function (el) {
      if (el.textContent.trim() === 'Membros') {
        var card = el.closest('.stat-card');
        if (!card) return;
        var v = card.querySelector('.stat-value');
        var i = card.querySelector('.stat-icon');
        if (v) v.textContent = '2,1 mil';
        if (i) i.textContent = '📸';
        el.textContent = 'Seguidoras no Instagram';
      }
    });
    var sm = document.getElementById('stat-members');
    if (sm && sm.parentElement) {
      sm.parentElement.innerHTML = '📸 <span id="stat-members">2,1 mil</span> seguidoras no Instagram';
    }

    // 3. Links legais no rodapé
    var footer = document.querySelector('footer');
    if (footer && !document.getElementById('asf-legal-links')) {
      var div = document.createElement('div');
      div.id = 'asf-legal-links';
      div.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:16px;margin:12px 0 10px;font-size:12px;';
      div.innerHTML =
        '<a href="sobre.html" style="color:white;text-decoration:underline;opacity:0.85;">Sobre</a>' +
        '<a href="contato.html" style="color:white;text-decoration:underline;opacity:0.85;">Contato</a>' +
        '<a href="privacidade.html" style="color:white;text-decoration:underline;opacity:0.85;">Política de Privacidade</a>' +
        '<a href="termos-de-uso.html" style="color:white;text-decoration:underline;opacity:0.85;">Termos de Uso</a>';
      var ps = footer.querySelectorAll('p');
      var anchor = null;
      ps.forEach(function (p) { if (p.textContent.indexOf('©') > -1 && !anchor) anchor = p; });
      if (anchor) footer.insertBefore(div, anchor); else footer.appendChild(div);
    }

    // 4. Link LGPD e canal de contato real (e-mail asf@asf-surf.org não existe)
    if (typeof ASF_IMAGE_TERMS !== 'undefined') {
      ASF_IMAGE_TERMS.LGPD_link = 'privacidade.html';
      ASF_IMAGE_TERMS.secao3_texto = 'Você pode solicitar a remoção de qualquer material seu da ASF a qualquer momento pelo e-mail asf.surffeminino@gmail.com, WhatsApp oficial +55 11 95434-6288 ou Instagram @asf.surffeminino, informando o link da publicação.';
    }
  } catch (e) { console.warn('ASF compliance patch:', e); }
});

// ============================================================
// ASF - Banner de consentimento de cookies (LGPD / Google AdSense)
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  try {
    if (localStorage.getItem('asf-cookie-consent')) return;
    var bar = document.createElement('div');
    bar.id = 'asf-cookie-banner';
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;background:#0E2439;color:#fff;padding:14px 16px;z-index:10001;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;font-family:system-ui,sans-serif;font-size:13px;box-shadow:0 -2px 12px rgba(0,0,0,0.25)';
    bar.innerHTML =
      '<span style="max-width:640px">🍪 Usamos cookies para personalizar conteúdo e exibir anúncios (Google AdSense). Ao continuar, você concorda com nossa ' +
      '<a href="privacidade.html" style="color:#7FD4EC;text-decoration:underline">Política de Privacidade</a>.</span>' +
      '<button id="asf-cookie-accept" style="background:#00A8CC;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:600;cursor:pointer">Aceitar</button>';
    document.body.appendChild(bar);
    document.getElementById('asf-cookie-accept').addEventListener('click', function () {
      localStorage.setItem('asf-cookie-consent', 'accepted');
      bar.remove();
    });
  } catch (e) { console.warn('ASF cookie banner:', e); }
});


// --- ASF: treinos de mobilidade movidos para o app ASF Treino (evita duplicação na home) ---
(function () {
  function replaceMobilidade() {
    var sec = document.getElementById('mobilidade');
    if (!sec) return;
    var header = sec.querySelector('.section-header');
    sec.innerHTML = '';
    if (header) sec.appendChild(header);
    var a = document.createElement('a');
    a.href = 'https://acarolmourad-commits.github.io/asf-treino/';
    a.style.cssText = 'display:block;text-decoration:none;background:linear-gradient(135deg,#E74C3C 0%,#C0392B 100%);padding:16px;margin:0 20px 20px;border-radius:16px;color:white;';
    a.innerHTML = '<p style="font-size:14px;font-weight:600;">🏄‍♀️ Treinos de mobilidade para surfistas</p>' +
                  '<p style="font-size:12px;opacity:0.9;margin-top:4px;">Os exercícios de mobilidade e prevenção agora estão no app ASF Treino. Toque para abrir →</p>';
    sec.appendChild(a);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceMobilidade);
  } else {
    replaceMobilidade();
  }
})();
