/* ASF Mural das Manas v2 (02/10/2026) - integrado ao Supabase (mesma base da Galeria).
   Posts reais compartilhados entre galeria.asf.surf e /mural/. XP continua local (asf_xp). */
(function () {
  "use strict";
  var SUPABASE_URL = "https://qktabrzbgdfndklytwub.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_qIvPxh6DavCPtntfflaRLw_QI_pZJih";
  var LS_XP = "asf_xp";
  var TEMA_MES = "Melhor Por do Sol";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function addXP(pts, motivo) {
    try {
      var xp = JSON.parse(localStorage.getItem(LS_XP)) || { total: 0, log: [] };
      xp.total += pts; xp.log.push({ pts: pts, motivo: motivo, ts: Date.now() });
      localStorage.setItem(LS_XP, JSON.stringify(xp));
    } catch (e) {}
  }

  var sb = null;
  function client() {
    if (!sb && window.supabase) sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return sb;
  }
  function loadSupabase(cb) {
    if (window.supabase) return cb();
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    s.onload = function () { cb(); };
    s.onerror = function () { cb(new Error("supabase cdn")); };
    document.head.appendChild(s);
  }

  function mesAtual() { return new Date().toISOString().slice(0, 7); }

  function render(root, posts, comments) {
    var doMes = posts.filter(function (p) { return (p.created_at || "").slice(0, 7) === mesAtual(); });
    var top3 = doMes.slice().sort(function (a, b) { return (b.stoke || 0) - (a.stoke || 0); }).slice(0, 3);
    var medalhas = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];
    root.innerHTML =
      '<section class="mural-foto-mes"><h2>\u{1F4F8} Foto do Mes - ' + esc(TEMA_MES) + '</h2>' +
      '<div class="mural-top3">' +
      (top3.length ? top3.map(function (p, i) {
        return '<article class="mural-card rank-' + (i + 1) + '">' +
          (p.img_url ? '<img src="' + esc(p.img_url) + '" alt="Foto de ' + esc(p.nome) + '" loading="lazy">' : "") +
          "<header><strong>" + esc(p.nome) + "</strong> - " + esc(p.pico || "") + "</header>" +
          '<button class="btn-votar" data-id="' + p.id + '" data-stoke="' + (p.stoke || 0) + '">\u{1F30A} Votar (' + (p.stoke || 0) + ")</button>" +
          '<span class="medalha">' + medalhas[i] + "</span></article>";
      }).join("") : "<p>Seja a primeira a publicar este mes!</p>") +
      "</div></section>" +
      '<section class="mural-feed">' +
      posts.map(function (p) {
        var cs = comments.filter(function (c) { return c.post_id === p.id; });
        return '<article class="mural-card">' +
          "<header><div><strong>" + esc(p.nome) + "</strong><small> \u{1F3D6}\uFE0F " + esc(p.pico || "") + "</small></div></header>" +
          (p.img_url ? '<img src="' + esc(p.img_url) + '" alt="Sessao de ' + esc(p.nome) + '" loading="lazy">' : "") +
          (p.cap ? "<p>" + esc(p.cap) + "</p>" : "") +
          '<button class="btn-apoiar" data-id="' + p.id + '" data-stoke="' + (p.stoke || 0) + '">\u{1F919} Juntas no Mar (' + (p.stoke || 0) + ")</button>" +
          '<div class="comentarios">' +
          cs.map(function (c) { return "<p><strong>" + esc(c.nome) + ":</strong> " + esc(c.texto) + "</p>"; }).join("") +
          '<form class="form-comentario" data-id="' + p.id + '">' +
          '<input type="text" name="nome" placeholder="Seu nome" maxlength="60" required style="max-width:120px">' +
          '<input type="text" name="texto" placeholder="Comentar..." maxlength="200" required>' +
          '<button type="submit">Enviar</button></form></div></article>';
      }).join("") + "</section>";
  }

  function carregar(root) {
    var c = client();
    Promise.all([
      c.from("posts").select("*").order("created_at", { ascending: false }),
      c.from("comments").select("*").order("created_at")
    ]).then(function (rs) {
      if (rs[0].error) { root.innerHTML = "<p>Erro ao carregar o mural: " + esc(rs[0].error.message) + "</p>"; return; }
      render(root, rs[0].data || [], rs[1].data || []);
    }).catch(function () {
      root.innerHTML = "<p>Sem conexao agora. Tente novamente em instantes \u{1F30A}</p>";
    });
  }

  function bind(root) {
    root.addEventListener("click", function (e) {
      var btn = e.target.closest(".btn-apoiar, .btn-votar");
      if (!btn) return;
      btn.disabled = true;
      client().from("posts").update({ stoke: parseInt(btn.dataset.stoke, 10) + 1 }).eq("id", btn.dataset.id)
        .then(function () { carregar(root); });
    });
    root.addEventListener("submit", function (e) {
      if (!e.target.matches(".form-comentario")) return;
      e.preventDefault();
      var nome = e.target.nome.value.trim(), texto = e.target.texto.value.trim();
      if (!nome || !texto) return;
      client().from("comments").insert({ post_id: e.target.dataset.id, nome: nome, texto: texto })
        .then(function () { carregar(root); });
    });
  }

  window.asfMuralPublicar = function (dados, file) {
    var c = client();
    function inserir(img_url) {
      return c.from("posts").insert({ nome: dados.nome, pico: dados.pico, cap: dados.cap, img_url: img_url })
        .then(function (r) { if (!r.error) addXP(5, "Publicou foto no Mural das Manas"); return r; });
    }
    if (file) {
      var path = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      return c.storage.from("fotos").upload(path, file).then(function (up) {
        if (up.error) return up;
        return inserir(SUPABASE_URL + "/storage/v1/object/public/fotos/" + path);
      });
    }
    return inserir(null);
  };
  window.asfMuralPremiarVencedora = function () {
    addXP(50, "Venceu a Foto do Mes: " + TEMA_MES);
  };

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("mural-manas");
    if (!root) return;
    root.innerHTML = "<p>Carregando o mural...</p>";
    loadSupabase(function () { carregar(root); bind(root); });
  });
})();
