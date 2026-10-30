/* ASF Bottom Nav + Hub Filter + Card Previsao - acessibilidade e renderizacao segura */
(function () {
  "use strict";
  var base = window.ASF_BASE || (location.pathname.indexOf('/asf-app') === 0 ? '/asf-app/' : '/');
  const NAV = [
    { label: "Início", icon: "\u{1F3E0}", href: base + "index.html" },
    { label: "Previsão", icon: "\u{1F30A}", href: base + "previsao-surf/" },
    { label: "Mural", icon: "\u{1F4F8}", href: base + "mural/" },
    { label: "Diário", icon: "\u{1F4D3}", href: base + "diario/" },
    { label: "Carteirinha", icon: "\u{1FAAA}", href: base + "carteirinhas.html" },
  ];
  const CATEGORIAS = {
    "Mar/Vento": ["asf-mare", "asf-vento", "asf-swell", "asf-previsao", "asf-atlas", "asf-alerta"],
    "Treinos/Yoga": ["asf-yoga", "asf-treino", "asf-respira", "asf-apnea", "asf-nutricao", "asf-sono", "asf-mental"],
    "Viagens": ["asf-viagens", "asf-mala", "asf-carona", "hospedagens", "asf-achados"],
    "Segurança": ["asf-sos", "asf-seguranca", "asf-ponto", "asf-kids"],
  };
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
  const pathFor = href => {
    try { return new URL(href, location.origin).pathname.replace(/\/$/, ""); }
    catch (_) { return href.replace(/\/$/, ""); }
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!document.querySelector(".asf-bottom-nav")) {
      const nav = document.createElement("nav");
      nav.className = "asf-bottom-nav";
      nav.setAttribute("aria-label", "Navegação principal");
      const atual = location.pathname.replace(/\/$/, "");
      nav.innerHTML = NAV.map(i => {
        const target = pathFor(i.href);
        const active = atual === target || (target.endsWith("/index.html") && atual === target.slice(0, -11));
        return `<a href="${esc(i.href)}" class="${active ? "ativo" : ""}"${active ? ' aria-current="page"' : ""}>
          <span aria-hidden="true">${i.icon}</span><small>${esc(i.label)}</small></a>`;
      }).join("");
      document.body.appendChild(nav);
    }
  });

  window.asfHubFilter = {
    init(inputEl, chipsEl, gridEl, apps) {
      if (!inputEl || !chipsEl || !gridEl || !Array.isArray(apps)) return;
      const render = lista => {
        gridEl.innerHTML = lista.map(a =>
          `<a class="app-card" href="${esc(a.url)}" data-fallback>
            <span class="app-icon" aria-hidden="true">${esc(a.icon || "\u{1F3C4}")}</span>${esc(a.nome)}</a>`).join("");
      };
      const categories = ["Todos", ...Object.keys(CATEGORIAS)];
      chipsEl.innerHTML = categories.map((c, index) =>
        `<button type="button" class="chip" data-cat="${esc(c)}" aria-pressed="${index === 0 ? "true" : "false"}">${esc(c)}</button>`).join("");
      chipsEl.addEventListener("click", e => {
        const chip = e.target.closest(".chip");
        if (!chip || !chipsEl.contains(chip)) return;
        chipsEl.querySelectorAll(".chip").forEach(el => el.setAttribute("aria-pressed", String(el === chip)));
        const cat = chip.dataset.cat;
        render(cat === "Todos" ? apps : apps.filter(a => (CATEGORIAS[cat] || []).includes(a.id)));
      });
      inputEl.addEventListener("input", () => {
        const q = inputEl.value.trim().toLocaleLowerCase();
        render(q ? apps.filter(a => String(a.nome || "").toLocaleLowerCase().includes(q)) : apps);
      });
      render(apps);
    },
  };

  window.asfCardPrevisao = function (el, { praia, swell, vento, mare }) {
    if (!el) return;
    const status =
      vento <= 10 && swell >= 0.8 ? { cor: "azul", txt: "Condições perfeitas" } :
      vento <= 20 ? { cor: "verde", txt: "Ideal / seguro" } :
                    { cor: "amarelo", txt: "Atenção" };
    el.className = `card-previsao status-${status.cor}`;
    el.innerHTML = `
      <h3>${esc(praia)} <span class="status-tag">${esc(status.txt)}</span></h3>
      <ul>
        <li>Swell: <strong>${esc(swell)} m</strong></li>
        <li>Vento: <strong>${esc(vento)} km/h</strong></li>
        <li>Maré: <strong>${esc(mare)}</strong></li>
      </ul>
      <a href="${esc(base)}previsao-surf/">Ver previsão completa</a>`;
  };

  document.addEventListener("click", async e => {
    const a = e.target.closest("a[data-fallback]");
    if (!a) return;
    try {
      await fetch(a.href, { method: "HEAD", mode: "no-cors" });
    } catch (_) {
      e.preventDefault();
      location.href = base + "fallback.html?app=" + encodeURIComponent(a.textContent.trim());
    }
  });
})();