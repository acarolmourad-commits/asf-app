/* ASF Mural das Manas v3 (02/10/2026) — Supabase: mural_fotos + mural_votos + bucket mural-fotos.
   Compressão WebP no navegador (Canvas, máx 1200px, q0.8), TOP 3 em tempo real (Realtime),
   voto único (UNIQUE user_id+foto_id), XP na Carteirinha ASF. */
(function () {
  "use strict";
  var SUPABASE_URL = "https://qktabrzbgdfndklytwub.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_qIvPxh6DavCPtntfflaRLw_QI_pZJih";
  var BUCKET = "mural-fotos";
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
  function toast(msg) {
    if (typeof showToast === "function") showToast(msg); else alert(msg);
  }

  /* Identidade da usuária: carteirinha local (numero) ou device-id anônimo */
  function identidade() {
    var card = null;
    try { card = JSON.parse(localStorage.getItem("asf-card-v2")); } catch (e) {}
    var dev = localStorage.getItem("asf_device_id");
    if (!dev) { dev = "dev-" + Math.random().toString(36).slice(2, 12); localStorage.setItem("asf_device_id", dev); }
    return {
      user_id: card && card.numero ? card.numero : dev,
      nome: card && card.nome ? card.nome : "Mana",
      nivel: card && card.nivel ? card.nivel : null
    };
  }

  var sb = null, canal = null;
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

  /* ── Compressão WebP pré-upload (Canvas, sem dependências) ── */
  function comprimirWebP(file) {
    return new Promise(function (resolve, reject) {
      if (!file || !/^image\//.test(file.type)) return reject(new Error("Arquivo não é imagem"));
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var escala = Math.min(1, 1200 / img.width);
        var cv = document.createElement("canvas");
        cv.width = Math.round(img.width * escala);
        cv.height = Math.round(img.height * escala);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        cv.toBlob(function (b) { b ? resolve(b) : reject(new Error("Falha ao converter WebP")); },
          "image/webp", 0.8);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("Imagem inválida")); };
      img.src = url;
    });
  }

  function contagemVotos(votos) {
    var m = {};
    (votos || []).forEach(function (v) { m[v.foto_id] = (m[v.foto_id] || 0) + 1; });
    return m;
  }

  function cardFoto(f, votos, medalha) {
    return '<article class="mural-card' + (medalha ? " rank" : "") + '">' +
      '<img src="' + esc(f.foto_url) + '" alt="Foto de ' + esc(f.autor_nome) + '" loading="lazy">' +
      "<header><div><strong>" + esc(f.autor_nome) + "</strong>" +
      (f.autor_nivel ? ' <span class="badge-nivel">' + esc(f.autor_nivel) + "</span>" : "") +
      "<small> 🏖️ " + esc(f.praia || "") + "</small></div></header>" +
      (f.legenda ? "<p>" + esc(f.legenda) + "</p>" : "") +
      '<button class="btn-votar" data-id="' + f.id + '">🤙 Apoiar · <b class="votos-count">' + (votos[f.id] || 0) + "</b></button>" +
      (medalha ? '<span class="medalha">' + medalha + "</span>" : "") +
      "</article>";
  }

  function render(root, fotos, votosMap, top3) {
    var medalhas = ["🥇", "🥈", "🥉"];
    root.innerHTML =
      '<section class="mural-foto-mes"><h2>📸 Foto do Mês — ' + esc(TEMA_MES) + "</h2>" +
      "<p>Poste marcando “Participar do concurso” e mobilize as manas para votar. TOP 3 em tempo real!</p>" +
      '<div class="mural-top3">' +
      (top3.length ? top3.map(function (f, i) { return cardFoto(f, votosMap, medalhas[i]); }).join("")
        : "<p>Seja a primeira a concorrer este mês!</p>") +
      "</div></section>" +
      '<section class="mural-feed">' +
      (fotos.length ? fotos.map(function (f) { return cardFoto(f, votosMap, null); }).join("")
        : "<p>O mural está esperando a sua sessão 🌊</p>") +
      "</section>";
  }

  function carregar(root) {
    var c = client();
    Promise.all([
      c.from("mural_fotos").select("*").order("criado_em", { ascending: false }),
      c.from("mural_votos").select("foto_id,user_id"),
      c.from("mural_top3").select("*")
    ]).then(function (rs) {
      if (rs[0].error) { root.innerHTML = "<p>Erro ao carregar o mural: " + esc(rs[0].error.message) + "</p>"; return; }
      var fotos = rs[0].data || [];
      var votosMap = contagemVotos(rs[1].data);
      var idsTop = (rs[2].data || []).map(function (t) { return t.id; });
      var top3 = idsTop.map(function (id) { return fotos.find(function (f) { return f.id === id; }); }).filter(Boolean);
      render(root, fotos, votosMap, top3);
    }).catch(function () {
      root.innerHTML = "<p>Sem conexão agora. Tente novamente em instantes 🌊</p>";
    });
  }

  /* Tempo real: novos votos/fotos atualizam contadores e TOP 3 */
  function assinarTempoReal(root) {
    var c = client();
    if (!c || canal) return;
    canal = c.channel("mural-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "mural_votos" }, function () { carregar(root); })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mural_fotos" }, function () { carregar(root); })
      .subscribe();
  }

  function votar(root, fotoId, btn) {
    var me = identidade();
    btn.disabled = true;
    client().from("mural_votos").insert({ foto_id: fotoId, user_id: me.user_id })
      .then(function (r) {
        if (r.error && r.error.code === "23505") { toast("Você já apoiou esta foto 🌊"); btn.disabled = false; return; }
        if (r.error) { toast("Não consegui registrar o voto 😢"); btn.disabled = false; return; }
        addXP(1, "Apoiou uma mana no Mural");
        carregar(root);
      });
  }

  function publicar(form) {
    var me = identidade();
    var file = form.foto.files[0];
    if (!file) { toast("Escolha uma foto 📸"); return; }
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Comprimindo e enviando…";
    comprimirWebP(file).then(function (webp) {
      var path = me.user_id.replace(/[^a-zA-Z0-9\-_]/g, "_") + "/" + Date.now() + ".webp";
      var c = client();
      return c.storage.from(BUCKET).upload(path, webp, { contentType: "image/webp" }).then(function (up) {
        if (up.error) throw new Error(up.error.message);
        return c.from("mural_fotos").insert({
          user_id: me.user_id, autor_nome: me.nome, autor_nivel: me.nivel,
          foto_url: SUPABASE_URL + "/storage/v1/object/public/" + BUCKET + "/" + path,
          legenda: form.legenda.value.trim(), praia: form.praia.value.trim(),
          concurso_mes: form.concurso.checked ? mesAtual() : null
        });
      });
    }).then(function (r) {
      btn.disabled = false; btn.textContent = "Publicar no Mural";
      if (r && r.error) { toast("Erro ao publicar: " + r.error.message); return; }
      addXP(5, "Publicou foto no Mural das Manas");
      form.reset();
      toast("Publicado! +5 XP na sua carteirinha 🌊");
      carregar(document.getElementById("mural-manas"));
    }).catch(function (e) {
      btn.disabled = false; btn.textContent = "Publicar no Mural";
      toast(e.message || "Falha no upload");
    });
  }

  function bind(root) {
    root.addEventListener("click", function (e) {
      var btn = e.target.closest(".btn-votar");
      if (btn) votar(root, btn.dataset.id, btn);
    });
    var form = document.getElementById("mural-upload");
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); publicar(form); });
  }

  /* Premia a vencedora do mês (chamada ao encerrar o concurso) */
  window.asfMuralPremiarVencedora = function () {
    addXP(50, "Venceu a Foto do Mês: " + TEMA_MES);
  };

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("mural-manas");
    if (!root) return;
    root.innerHTML = "<p>Carregando o mural…</p>";
    loadSupabase(function () { carregar(root); bind(root); assinarTempoReal(root); });
  });
})();
