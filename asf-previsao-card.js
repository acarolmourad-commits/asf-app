/* ASF Card Previsao ao vivo (01/10/2026) - modulo ADITIVO.
   Busca Open-Meteo (marine + weather) para a praia padrao (Maresias)
   e renderiza card com semaforo de condicoes.
   Nao altera nada existente: insere antes de #card-clima (ou no topo de main). */
(function () {
  "use strict";
  var PRAIA = { nome: "Maresias", lat: -23.8039, lon: -45.5611 };
  var LS_KEY = "asf_previsao_cache";
  var TTL = 30 * 60 * 1000; // 30 min

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function semaforo(swell, vento) {
    if (vento <= 10 && swell >= 0.8) return { cor: "azul", txt: "Condicoes Perfeitas" };
    if (vento <= 20) return { cor: "verde", txt: "Ideal / Seguro" };
    return { cor: "amarelo", txt: "Atencao" };
  }

  function render(el, d) {
    var s = semaforo(d.swell, d.vento);
    el.className = "card card-previsao status-" + s.cor;
    el.innerHTML =
      '<h3 style="margin:0 0 6px">\uD83C\uDF0A ' + PRAIA.nome + ' agora ' +
        '<span class="status-tag">' + s.txt + '</span></h3>' +
      '<ul style="list-style:none;padding:0;margin:0 0 8px;display:flex;gap:14px;flex-wrap:wrap">' +
        '<li>Swell: <strong>' + d.swell.toFixed(1) + ' m</strong></li>' +
        '<li>Periodo: <strong>' + d.periodo.toFixed(0) + ' s</strong></li>' +
        '<li>Vento: <strong>' + d.vento.toFixed(0) + ' km/h</strong></li>' +
      '</ul>' +
      '<a href="./previsao-surf/" style="color:#fff;font-weight:600">Ver previsao completa</a>';
  }

  function mount() {
    if (document.getElementById("card-previsao-live")) return;
    var anchor = document.getElementById("card-clima");
    var host = (anchor && anchor.parentNode) || document.querySelector("main") || document.body;
    var el = document.createElement("div");
    el.id = "card-previsao-live";
    el.className = "card card-previsao";
    el.innerHTML = '<p style="margin:0">\uD83C\uDF0A Carregando condicoes do mar...</p>';
    if (anchor) host.insertBefore(el, anchor); else host.insertBefore(el, host.firstChild);

    // cache local (praia = areia, sinal ruim)
    try {
      var c = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (c && Date.now() - c.ts < TTL) { render(el, c.data); return; }
    } catch (e) {}

    var marine = "https://marine-api.open-meteo.com/v1/marine?latitude=" + PRAIA.lat +
      "&longitude=" + PRAIA.lon + "&current=wave_height,wave_period&timezone=America%2FSao_Paulo";
    var meteo = "https://api.open-meteo.com/v1/forecast?latitude=" + PRAIA.lat +
      "&longitude=" + PRAIA.lon + "&current=wind_speed_10m&timezone=America%2FSao_Paulo";
    Promise.all([fetch(marine).then(function (r) { return r.json(); }), fetch(meteo).then(function (r) { return r.json(); })])
      .then(function (rs) {
        var data = {
          swell: (rs[0].current && rs[0].current.wave_height) || 0,
          periodo: (rs[0].current && rs[0].current.wave_period) || 0,
          vento: (rs[1].current && rs[1].current.wind_speed_10m) || 0
        };
        try { localStorage.setItem(LS_KEY, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {}
        render(el, data);
      })
      .catch(function () {
        el.innerHTML = '<p style="margin:0">\uD83C\uDF0A Sem sinal agora - <a href="./previsao-surf/" style="color:#fff">abrir previsao</a></p>';
      });
  }
  ready(mount);
})();
