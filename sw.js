/* VEXX · Service Worker — uso sin internet (offline) + auto-actualización
   - Navegación: network-first (al abrir con internet trae la versión más nueva;
     sin internet usa la copia en caché → la app abre igual).
   - Recursos (fuentes, Firebase, íconos): cache-first y se guardan al vuelo,
     incluso respuestas cross-origin "opacas", para que funcionen sin red.
   - No toca localStorage: tus datos están a salvo.
   Lo único que NO funciona sin internet es el escáner de código de barras
   (consulta Open Food Facts) y la sincronización en la nube. */
const CACHE = "vexx-cache-v2";
const SHELL = ["./", "./index.html", "./icon.png"];
/* recursos externos que conviene tener en caché para abrir sin internet */
const EXTRA = [
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"
];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(SHELL).catch(() => {});
    // precache best-effort de recursos externos (opacos); si falla, no rompe la instalación
    await Promise.all(EXTRA.map(async u => {
      try { const r = await fetch(u, { mode: "no-cors" }); if (r) await c.put(u, r); } catch (e) {}
    }));
  })());
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
    // network-first: trae lo último; si no hay red, usa la copia en caché
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put("./index.html", copy));
        return res;
      }).catch(() => caches.match("./index.html").then(r => r || caches.match("./")))
    );
    return;
  }

  // otros recursos: cache-first; si vienen de la red, se guardan (incluye opacos cross-origin)
  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && (res.status === 200 || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
