// Cache do "esqueleto" do app; notícias e imagens vêm sempre da rede.
const CACHE = "icm-app-v10";
const ARQUIVOS = ["./", "index.html", "css/app.css?v=7", "js/config.js?v=5", "js/data.js?v=3", "js/rota.js?v=3", "js/db.js?v=8", "js/app.js?v=8", "manifest.json", "icons/logo-transparente.png", "icons/icon-192.png", "icons/favicon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); return r; })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("index.html")))
  );
});
