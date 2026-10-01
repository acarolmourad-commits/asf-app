/* ASF Bottom Nav + Hub Filter + Card Previsao - links relativos apenas */
(function () {
  "use strict";
  const NAV = [
    { label: "Inicio",   icon: "🏠", href: "./index.html" },
    { label: "Previsao", icon: "🌊", href: "./previsao-surf/" },
    { label: "Mural",    icon: "📸", href: "./mural/" },
    { label: "Diario",   icon: "📓", href: "./diario/" },
    { label: "Perfil",   icon: "👤", href: "./carteirinhas.html" },
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
        `<a href="${i.href}" class="${atual.includes(i.href.replace("./", "/")) ? "ativo" : ""}">
           <span>${i.icon}</span><small>${i.label}</small></a>`).join("");
      document.body.appendChild(nav);
    }
  });

  window.asfHubFilter = {
    init(inputEl, chipsEl, gridEl, apps) {
      const render = lista => {
        gridEl.innerHTML = lista.map(a =>
          `<a class="app-card" href="${a.url}" data-fallback>
             <span class="app-icon">${a.icon || "🏄"}</span>${a.nome}</a>`).join("");
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
      <a href="./previsao-surf/">Ver previsao completa</a>`;
  };

  document.addEventListener("click", async e => {
    const a = e.target.closest("a[data-fallback]");
    if (!a) return;
    try {
      await fetch(a.href, { method: "HEAD", mode: "no-cors" });
    } catch {
      e.preventDefault();
      location.href = "./fallback.html?app=" + encodeURIComponent(a.textContent.trim());
    }
  });
})();
