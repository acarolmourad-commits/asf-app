/* ASF Bottom Nav + Hub Filter + Card Previsao - v2 base-aware (zero 404) */
(function () {
  "use strict";
  var base = window.ASF_BASE || (location.pathname.indexOf('/asf-app') === 0 ? '/asf-app/' : '/');
  const NAV = [
    { label: "Inicio",   icon: "\u{1F3E0}", href: base + "index.html" },
    { label: "Previsao", icon: "\u{1F30A}", href: base + "previsao-surf/" },
    { label: "Mural",    icon: "\u{1F4F8}", href: base + "mural/" },
    { label: "Diario",   icon: "\u{1F4D3}", href: base + "diario/" },
    { label: "Perfil",   icon: "\u{1F464}", href: base + "carteirinhas.html" },
  ];
  const CATEGORIAS = {
    "Mar/Vento": ["asf-mare", "asf-vento", "asf-swell", "asf-previsao", "asf-atlas", "asf-alerta"],
    "Treinos/Yoga": ["asf-yoga", "asf-treino", "asf-respira", "asf-apnea", "asf-nutricao", "asf-sono", "asf-mental"],
    "Viagens": ["asf-viagens", "asf-mala", "asf-carona", "hospedagens", "asf-achados"],
    "Seguranca": ["asf-sos", "asf-seguranca", "asf-ponto", "asf-kids"],
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!document.querySelector(".asf-bottom-nav")) {
      const nav = document.createElement("nav");
      nav.className = "asf-bottom-nav";
      nav.setAttribute("aria-label", "Navegacao principal");
      const atual = location.pathname;
      nav.innerHTML = NAV.map(i =>
        `<a href="${i.href}" class="${atual.indexOf(i.href) !== -1 ? "ativo" : ""}">
           <span>${i.icon}</span><small>${i.label}</small></a>`).join("");
      document.body.appendChild(nav);
    }
  });

  window.asfHubFilter = {
    init(inputEl, chipsEl, gridEl, apps) {
      const render = lista => {
        gridEl.innerHTML = lista.map(a =>
          `<a class="app-card" href="${a.url}" data-fallback>
             <span class="app-icon">${a.icon || "\u{1F3C4}"}</span>${a.nome}</a>`).join("");
      };
      chipsEl.innerHTML = ["Todos", ...Object.keys(CATEGORIAS)].map(c =>
        `<button class="chip" data-cat="${c}">${c}</button>`).join("");
      chipsEl.addEventListener("click", e => {
        if (!e.target.matches(".chip")) return;
        const cat = e.target.dataset.cat;
        render(cat === "Todos" ? apps : apps.filter(a => (CATEGORIAS[cat] || []).includes(a.id)));
      });
      inputEl.addEventListener("input", () => {
        const q = inputEl.value.trim().toLowerCase();
        render(q ? apps.filter(a => a.nome.toLowerCase().includes(q)) : apps);
      });
      render(apps);
    },
  };

  window.asfCardPrevisao = function (el, { praia, swell, vento, mare }) {
    const status =
      vento <= 10 && swell >= 0.8 ? { cor: "azul", txt: "Condicoes Perfeitas" } :
      vento <= 20 ? { cor: "verde", txt: "Ideal / Seguro" } :
                    { cor: "amarelo", txt: "Atencao" };
    el.className = `card-previsao status-${status.cor}`;
    el.innerHTML = `
      <h3>${praia} <span class="status-tag">${status.txt}</span></h3>
      <ul>
        <li>Swell: <strong>${swell} m</strong></li>
        <li>Vento: <strong>${vento} km/h</strong></li>
        <li>Mare: <strong>${mare}</strong></li>
      </ul>
      <a href="${base}previsao-surf/">Ver previsao completa</a>`;
  };

  document.addEventListener("click", async e => {
    const a = e.target.closest("a[data-fallback]");
    if (!a) return;
    try {
      await fetch(a.href, { method: "HEAD", mode: "no-cors" });
    } catch {
      e.preventDefault();
      location.href = base + "fallback.html?app=" + encodeURIComponent(a.textContent.trim());
    }
  });
})();
