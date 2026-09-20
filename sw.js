/* AJHA Control — service worker
   >>> Troque VERSAO a cada vez que publicar uma mudança. <<< */
const VERSAO = "ajha-v4";
const CASCA = ["./", "./index.html", "./manifest.json",
  "./icons/icon-192-b.png", "./icons/icon-512-b.png",
  "./icons/icon-maskable-b.png", "./icons/icon-180-b.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(CASCA)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Firebase e CDN: sempre rede, nunca cache
  if (/googleapis\.com|firebase|firebaseio\.com|jsdelivr\.net/.test(url.hostname)) return;

  // a página: rede primeiro, cache como rede de segurança (offline)
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => {
      const copia = r.clone();
      caches.open(VERSAO).then(c => c.put("./index.html", copia));
      return r;
    }).catch(() => caches.match("./index.html")));
    return;
  }

  // resto: cache primeiro
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok && (url.origin === location.origin || /gstatic/.test(url.hostname))) {
      const copia = r.clone();
      caches.open(VERSAO).then(c => c.put(req, copia));
    }
    return r;
  }).catch(() => hit)));
});
