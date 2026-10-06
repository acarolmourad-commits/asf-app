const CACHE = "asf-v7";
const OFFLINE_PAGES = [
  "./index.html",
  "./praias/",
  "./praias/melhores-praias-iniciantes-litoral-norte-sp.html",
  "./praias/surf-feminino-sao-sebastiao.html",
  "./aprender/",
  "./aprender/como-comecar-a-surfar-mulheres.html",
  "./aprender/correntes-de-retorno-seguranca.html",
  "./aprender/etiqueta-no-mar.html",
  "./aprender/primeira-prancha-de-surf.html",
  "./aprender/remada-tecnica-e-treinos.html",
  "./bem-estar/",
  "./bem-estar/presenca-no-mar-beneficios-da-pratica.html",
  "./bem-estar/surf-saude-mental-mulheres.html",
  "./diario/",
  "./mural/",
  "./asf-mural.css",
  "./asf-mural.js",
  "./asf-bottomnav.js",
  "./carteirinhas.html",
  "./carteirinha.js",
  "./fallback.html",
];
self.addEventListener("install", e =>
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(OFFLINE_PAGES)).then(() => self.skipWaiting())));
self.addEventListener("activate", e =>
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // Nunca cachear API do Supabase (dados sempre frescos; votos/fotos sao online)
  if (e.request.url.indexOf("supabase.co") !== -1) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const clone = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return r;
    }).catch(() => caches.match(e.request).then(m =>
      m || (e.request.mode === "navigate" ? caches.match("./fallback.html") : undefined)))
  );
});
