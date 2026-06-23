/* VEXX · Service Worker — auto-actualización + offline
   Estrategia: network-first para la navegación (siempre intenta la versión
   más nueva al abrir con internet; si no hay red, usa la copia en caché).
   Para otros recursos (íconos, fuentes): cache-first con actualización en 2º plano.
   No toca localStorage, así que tus datos están a salvo. */
const CACHE = "vexx-cache-v1";
const SHELL = ["./", "./index.html", "./icon.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const isNav = req.mode === "navigate" ||
    (req.headers.get("accept") || "").includes("text/html");

  if (isNav) {
    // network-first: trae lo último; si falla (offline), usa caché
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put("./index.html", copy));
        return res;
      }).catch(() => caches.match("./index.html").then(r => r || caches.match("./")))
    );
    return;
  }

  // otros recursos: cache-first, y refresca en 2º plano
  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
