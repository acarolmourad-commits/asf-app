/* Extraído de index.html — bloco inline #1 (ordem preservada) */

    function toggleMenu(e) {
        e.stopPropagation();
        var m = document.getElementById('header-menu');
        var open = m.classList.toggle('open');
        document.getElementById('menu-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
        document.getElementById('menu-toggle').textContent = open ? '✕' : '☰';
    }
    function closeMenu() {
        var m = document.getElementById('header-menu');
        if (m && m.classList.contains('open')) toggleMenu(new Event('click'));
    }
    document.addEventListener('click', function(e) {
        var m = document.getElementById('header-menu');
        if (m && m.classList.contains('open') && !m.contains(e.target) && e.target.id !== 'menu-toggle') closeMenu();
    });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMenu(); });
    