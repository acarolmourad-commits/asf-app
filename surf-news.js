// ASF Surf News - Dynamic surf news and updates
const SURF_NEWS = []; // ASF editorial: itens anteriores removidos por falta de fonte confirmável (ver docs/editorial-log.md). Novas notícias exigem fonte verificável.
const SURF_NEWS_LEGACY = [
  {
    id: 1,
    titulo: "WSL Women's Tour 2026 - Bertioga Confirmado!",
    resumo: "A etapa feminina do CT vai passar pela Praia do Tombo em agosto. Mulheres surfistas de todo Brasil já estão se organizando!",
    data: "2026-05-10",
    categoria: "Competição",
    imagem: "🏆",
    link: "#"
  },
  {
    id: 2,
    titulo: "Nova Praia Feminina na Litorânea Paulista",
    resumo: "Bertioga inaugura primeira praia oficial feminina no Brasil. Horário exclusivo das 6h às 8h para surf feminino.",
    data: "2026-05-08",
    categoria: "Comunidade",
    imagem: "🌊",
    link: "#"
  },
  {
    id: 3,
    titulo: "Tecnologia: Pranchas de Surf com Sensor de Onda",
    resumo: "Nova tecnologia registra dados de performance e condições do mar em tempo real. Perfeito para treino!",
    data: "2026-05-05",
    categoria: "Tecnologia",
    imagem: "📱",
    link: "#"
  },
  {
    id: 4,
    titulo: "Workshop de Yoga para Surfistas",
    resumo: "ASF vai promover workshop gratuito de yoga e respiração para surfistas em Bertioga. 20 vagas!",
    data: "2026-05-03",
    categoria: "Evento",
    imagem: "🧘",
    link: "#"
  },
  {
    id: 5,
    titulo: "Projeto de Inclusão: Surf para Todas",
    resumo: "Iniciativa da ASF oferece aulas gratuitas de surf para mulheres em situação de vulnerabilidade.",
    data: "2026-04-28",
    categoria: "Social",
    imagem: "💙",
    link: "#"
  },
  {
    id: 6,
    titulo: "ASF Team no Campeonato Sul-Americano",
    resumo: "Representantes do surf feminino paulista foram selecionados para representar o Brasil em Santiago.",
    data: "2026-04-20",
    categoria: "Competição",
    imagem: "🇵🇾",
    link: "#"
  },
  {
    id: 7,
    titulo: "Parceria com Marca de Roupas de Surf",
    resumo: "ASF fecha parceria com marca sustentável de roupas de surf. Descontos exclusivos para membros!",
    data: "2026-04-15",
    categoria: "Comunidade",
    imagem: "🤝",
    link: "#"
  }
];

function renderSurfNews() {
  const container = document.getElementById('surf-news-container');
  if (!container) return;
  // Hermes 2026-09-15: se o ASF_NEWS (guias evergreen do index.html) ja renderizou este
  // container, nao sobrescrever. Noticias temporais com fonte entram apenas quando nao
  // houver conteudo editorial carregado.
  if (container.dataset.loaded === '1') return;
  if (!SURF_NEWS.length) {
    container.innerHTML = '<div class="card" style="text-align:center;padding:20px"><p style="font-size:14px;color:var(--gray-600);margin:0">📰 Nenhuma notícia confirmada no momento.</p><p style="font-size:12px;color:var(--gray-400);margin:8px 0 0">Publicamos apenas novidades com fonte verificável. Acompanhe o Instagram <a href="https://instagram.com/asf.surffeminino" target="_blank" style="color:var(--primary)">@asf.surffeminino</a>.</p></div>';
    return;
  }
  container.innerHTML = SURF_NEWS.map(news => `
    <div class="news-card card" style="margin-bottom: 12px; cursor: pointer;" onclick="showNewsDetail(${news.id})">
      <div style="display: flex; gap: 12px; align-items: flex-start;">
        <div style="font-size: 32px;">${news.imagem}</div>
        <div style="flex: 1;">
          <span style="background: var(--primary); color: white; padding: 2px 8px; border-radius: 10px; font-size: 10px;">${news.categoria}</span>
          <h4 style="font-size: 14px; margin: 8px 0 4px 0;">${news.titulo}</h4>
          <p style="font-size: 12px; color: var(--gray-600); line-height: 1.4;">${news.resumo}</p>
          <span style="font-size: 10px; color: var(--gray-400);">${formatDate(news.data)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function formatDate(dateStr) {
  const options = { day: 'numeric', month: 'short' };
  return new Date(dateStr).toLocaleDateString('pt-BR', options);
}

function showNewsDetail(id) {
  const news = SURF_NEWS.find(n => n.id === id);
  if (!news) return;
  
  const modal = `
    <div id="news-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; padding: 20px; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; border-radius: 16px; max-width: 500px; width: 100%; max-height: 80vh; overflow-y: auto;">
        <div style="position: relative; padding: 20px;">
          <button onclick="document.getElementById('news-modal').remove()" style="position: absolute; top: 10px; right: 10px; background: var(--gray-200); border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">✕</button>
          <div style="font-size: 48px; text-align: center; margin: 20px 0;">${news.imagem}</div>
          <span style="background: var(--primary); color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">${news.categoria}</span>
          <h2 style="font-size: 18px; margin: 12px 0;">${news.titulo}</h2>
          <p style="color: var(--gray-600); line-height: 1.6;">${news.resumo}</p>
          <p style="font-size: 12px; color: var(--gray-400); margin-top: 16px;">${formatDate(news.data)}</p>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
}

// Auto-render when DOM is loaded
document.addEventListener('DOMContentLoaded', renderSurfNews);

// ASF — Aviso de conteúdo demonstrativo na vitrine de marcas (Brand Hub).
// Motivo: cupons/parcerias exibidos sem convênio confirmado (regra anti-conteúdo-fake). Ver docs/editorial-log.md.
document.addEventListener('DOMContentLoaded', function () {
  var s = document.getElementById('brand-showcase');
  if (s && !document.getElementById('brand-demo-disclaimer')) {
    var p = document.createElement('p');
    p.id = 'brand-demo-disclaimer';
    p.style.cssText = 'font-size:12px;color:#B45309;background:#FEF3C7;border:1px solid #FCD34D;border-radius:8px;padding:8px 12px;margin:0 0 12px';
    p.textContent = '\u26A0\uFE0F Conte\u00FAdo demonstrativo \u2014 as marcas e cupons abaixo s\u00E3o exemplos ilustrativos e n\u00E3o representam parcerias vigentes da ASF. Parcerias oficiais ser\u00E3o anunciadas nos canais oficiais.';
    s.insertBefore(p, s.firstChild);
  }
});

// Hermes hotfix 2026-09-15 (ver docs/editorial-log.md):
// 1) Link do Google Forms de cadastro retornava 404 -> redirecionado para o WhatsApp oficial da ASF.
// 2) Checkout da loja usava numero placeholder 5511999999999 -> corrigido para o numero oficial.
(function () {
  var ASF_WA = '5511954346288';
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href*="forms/d/e/1fJhfaiNyYSSq9bKElew69y6GZ6_pxLz05HR26klIsSA"]').forEach(function (a) {
      a.href = 'https://wa.me/' + ASF_WA + '?text=' + encodeURIComponent('Ol\u00E1! Quero me associar \u00E0 ASF \uD83C\uDFC4\u200D\u2640\uFE0F');
      if (!a.querySelector('.asf-hotfix-note')) {
        var s = document.createElement('span');
        s.className = 'asf-hotfix-note';
        s.style.cssText = 'font-size:11px;opacity:.85;margin-left:6px';
        s.textContent = '(via WhatsApp)';
        a.appendChild(s);
      }
    });
  });
  var _open = window.open;
  window.open = function (u, n, f) {
    if (typeof u === 'string') u = u.split('5511999999999').join(ASF_WA);
    return _open.call(this, u, n, f);
  };
})();

// === ASF Enhancements loader + navegacao (Hermes, 2026-09-15) ===
// Carrega a camada visual e melhora a navegacao sem editar o index.html.
(function () {
  // 1) CSS de melhorias
  if (!document.getElementById('asf-enhancements-css')) {
    var l = document.createElement('link');
    l.id = 'asf-enhancements-css';
    l.rel = 'stylesheet';
    l.href = 'asf-enhancements.css';
    document.head.appendChild(l);
  }

  document.addEventListener('DOMContentLoaded', function () {
    // 2) Indicador de secao ativa na bottom nav
    try {
      var items = Array.prototype.slice.call(document.querySelectorAll('.bottom-nav .nav-item'));
      var map = {}; // sectionId -> navItem
      items.forEach(function (it) {
        var oc = it.getAttribute('onclick') || '';
        var m = oc.match(/showSection\('([^']+)'\)/);
        if (m) map[m[1]] = it;
      });
      var sections = Object.keys(map)
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);
      if ('IntersectionObserver' in window && sections.length) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              items.forEach(function (i) { i.classList.remove('asf-active'); });
              var it = map[en.target.id];
              if (it) it.classList.add('asf-active');
            }
          });
        }, { rootMargin: '-40% 0px -55% 0px' });
        sections.forEach(function (s) { io.observe(s); });
      }
    } catch (e) { /* navegacao segue funcional sem o indicador */ }

    // 3) Botao flutuante "voltar ao topo"
    if (!document.getElementById('asf-back-top')) {
      var b = document.createElement('button');
      b.id = 'asf-back-top';
      b.setAttribute('aria-label', 'Voltar ao topo');
      b.textContent = '\u2191';
      b.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
      document.body.appendChild(b);
      var onScroll = function () {
        b.classList.toggle('asf-visible', window.scrollY > 600);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  });
})();


// ASF Polish extra (Hermes): transicao suave ao trocar de secao via showSection.
document.addEventListener('DOMContentLoaded', function () {
  if (typeof window.showSection === 'function' && !window.showSection._asfPolished) {
    var orig = window.showSection;
    var polished = function (id) {
      var r = orig.apply(this, arguments);
      var el = document.getElementById(id);
      if (el) { el.classList.remove('asf-section-enter'); void el.offsetWidth; el.classList.add('asf-section-enter'); }
      return r;
    };
    polished._asfPolished = true;
    window.showSection = polished;
  }
});

// ASF override: troca o banner da secao Lojas (Unsplash generico) por imagem de surf.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('img[src*="photo-1558618666-fcd25c85cd64"]').forEach(function (img) {
    img.src = 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=150&fit=crop';
    img.alt = 'Surf';
  });
});

// ASF hotfix 2026-09-16: botoes utilitarios do topo (Ondas/Clima/Mares/Calculadora/Competicoes)
// estavam "sem acao" porque showSection so alternava a classe .active (sem efeito visual),
// e um listener global quebrava com TypeError por causa do #notifications-panel ausente.
(function () {
  // 1) Corrige showSection: rola suavemente ate a secao alvo e marca como ativa,
  //    sem esconder as demais (a home e uma pagina longa com todas as secoes visiveis).
  window.showSection = function (sectionId) {
    document.querySelectorAll('.section').forEach(function (s) { s.classList.remove('active'); });
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
    var el = document.getElementById(sectionId);
    if (!el) return;
    el.classList.add('active');
    if (el.style.display === 'none') el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (sectionId === 'loja' && typeof renderAffiliateStore === 'function') {
      renderAffiliateStore();
    }
  };

  // 2) Cria o painel de notificacoes ausente (elimina o TypeError em todo clique
  //    e faz o botao 🔔 funcionar).
  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('notifications-panel')) {
      var p = document.createElement('div');
      p.id = 'notifications-panel';
      p.style.cssText = 'display:none;position:fixed;top:70px;right:16px;background:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.15);padding:16px;z-index:9999;max-width:320px;';
      p.innerHTML = '<h4 style="margin:0 0 8px;font-size:14px;">🔔 Notificações</h4><div id="notifications-list"><p style="font-size:13px;color:#666;margin:0;">Sem novas notificações no momento.</p></div>';
      document.body.appendChild(p);
    }
  });
})();
