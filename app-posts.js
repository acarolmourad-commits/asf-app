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
