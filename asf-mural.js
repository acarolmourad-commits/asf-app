/* ASF Mural das Manas - feed social + competicao mensal (localStorage, sem backend) */
(function () {
  "use strict";
  const LS_POSTS = "asf_mural_posts", LS_VOTES = "asf_mural_votes", LS_XP = "asf_xp";
  const TEMA_MES = "Melhor Por do Sol"; // atualizar mensalmente
  const $ = (s, r) => (r || document).querySelector(s);

  const store = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  };
  const addXP = (pts, motivo) => {
    const xp = store.get(LS_XP, { total: 0, log: [] });
    xp.total += pts; xp.log.push({ pts, motivo, ts: Date.now() });
    store.set(LS_XP, xp);
  };
  const mesKey = () => new Date().toISOString().slice(0, 7);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));

  function renderMural(root) {
    const posts = store.get(LS_POSTS, []);
    const votes = store.get(LS_VOTES, {});
    const postsMes = posts.filter(p => p.mes === mesKey());
    const ranking = [...postsMes].sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0)).slice(0, 3);

    root.innerHTML = `
      <section class="mural-foto-mes">
        <h2>Foto do Mes - ${esc(TEMA_MES)}</h2>
        <div class="mural-top3">
          ${ranking.map((p, i) => `
            <article class="mural-card rank-${i + 1}">
              <img src="${p.foto}" alt="Foto de ${esc(p.autora)}" loading="lazy">
              <header><strong>${esc(p.autora)}</strong> - ${esc(p.praia)} <span class="badge">${esc(p.badge)}</span></header>
              <button class="btn-votar" data-id="${p.id}">Votar (${votes[p.id] || 0})</button>
              <span class="medalha">${["1o","2o","3o"][i]}</span>
            </article>`).join("") || "<p>Seja a primeira a publicar este mes!</p>"}
        </div>
      </section>
      <section class="mural-feed">
        ${posts.map(p => `
          <article class="mural-card">
            <header>
              <img class="avatar" src="${p.avatar || "./assets/avatar-default.png"}" alt="">
              <div><strong>${esc(p.autora)}</strong><small>${esc(p.praia)} - <span class="badge">${esc(p.badge)}</span></small></div>
            </header>
            <img src="${p.foto}" alt="Sessao de surf de ${esc(p.autora)}" loading="lazy">
            <button class="btn-apoiar" data-id="${p.id}">Juntas no Mar (${p.apoios || 0})</button>
            <div class="comentarios">
              ${(p.comentarios || []).map(c => `<p><strong>${esc(c.autora)}:</strong> ${esc(c.texto)}</p>`).join("")}
              <form class="form-comentario" data-id="${p.id}">
                <input type="text" placeholder="Comentar..." maxlength="280" required>
                <button type="submit">Enviar</button>
              </form>
            </div>
          </article>`).join("")}
      </section>`;
  }

  function bindEvents(root) {
    root.addEventListener("click", e => {
      const posts = store.get(LS_POSTS, []);
      if (e.target.matches(".btn-apoiar")) {
        const p = posts.find(x => x.id === e.target.dataset.id);
        if (p) { p.apoios = (p.apoios || 0) + 1; store.set(LS_POSTS, posts); renderMural(root); }
      }
      if (e.target.matches(".btn-votar")) {
        const votes = store.get(LS_VOTES, {});
        votes[e.target.dataset.id] = (votes[e.target.dataset.id] || 0) + 1;
        store.set(LS_VOTES, votes); renderMural(root);
      }
    });
    root.addEventListener("submit", e => {
      if (!e.target.matches(".form-comentario")) return;
      e.preventDefault();
      const posts = store.get(LS_POSTS, []);
      const p = posts.find(x => x.id === e.target.dataset.id);
      const input = e.target.querySelector("input");
      if (p && input.value.trim()) {
        p.comentarios = p.comentarios || [];
        p.comentarios.push({ autora: "Voce", texto: input.value.trim() });
        store.set(LS_POSTS, posts); renderMural(root);
      }
    });
  }

  window.asfMuralPublicar = function (dados) {
    const posts = store.get(LS_POSTS, []);
    posts.unshift({ id: "p" + Date.now(), mes: mesKey(), apoios: 0, comentarios: [], ...dados });
    store.set(LS_POSTS, posts);
    addXP(5, "Publicou foto no Mural das Manas");
  };
  window.asfMuralPremiarVencedora = function () {
    const posts = store.get(LS_POSTS, []), votes = store.get(LS_VOTES, {});
    const top = posts.filter(p => p.mes === mesKey()).sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0))[0];
    if (top) addXP(50, "Venceu a Foto do Mes: " + TEMA_MES);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const root = $("#mural-manas");
    if (root) { renderMural(root); bindEvents(root); }
  });
})();
