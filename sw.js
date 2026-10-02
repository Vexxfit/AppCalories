/* VEXX · Service Worker — uso sin internet (offline) + auto-actualización
   App dividida en archivos: index.html + styles.css + data.js + app.js.

   ESTRATEGIA (v11, reforzada tras romperse el offline):
   - Instalación ATÓMICA: si falla la descarga de CUALQUIER archivo del shell,
     el SW nuevo NO se instala y el viejo (con su caché completa) sigue
     sirviendo la app. Antes un fallo silencioso dejaba la caché a medias y
     borraba la buena → app muerta sin internet.
   - CACHÉ PRIMERO con actualización en segundo plano (stale-while-revalidate)
     para archivos propios: la app abre INSTANTÁNEO aunque la señal esté débil
     o no haya internet; la versión nueva se descarga atrás y entra en el
     siguiente arranque.
   - Recursos externos (fuentes, Firebase, lz-string): caché-primero y se
     guardan al vuelo, incluso respuestas opacas, para abrir sin red.
   - No toca localStorage: tus datos están a salvo.
   Sin internet no funcionan: escáner de código de barras, nube y ranking. */
const CACHE = "vexx-cache-v35";
const SHELL = ["./", "./index.html", "./styles.css", "./data.js", "./anatomy2d.js", "./anatomy3d.js", "./app.js", "./icon.png", "./manifest.webmanifest"];
/* dibujos de ejercicios: se guardan en segundo plano (si falla alguno no rompe la instalación) */
const LAZY = ["./ex/0018-relaxation.svg","./ex/0018-tension.svg","./ex/0025-relaxation.svg","./ex/0025-tension.svg","./ex/0026-relaxation.svg","./ex/0026-tension.svg","./ex/0032-relaxation.svg","./ex/0032-tension.svg","./ex/0033-relaxation.svg","./ex/0033-tension.svg","./ex/0042-relaxation.svg","./ex/0042-tension.svg","./ex/0043-relaxation.svg","./ex/0043-tension.svg","./ex/0048-relaxation.svg","./ex/0048-tension.svg","./ex/0054-relaxation.svg","./ex/0054-tension.svg","./ex/0055-relaxation.svg","./ex/0055-tension.svg","./ex/0056-relaxation.svg","./ex/0056-tension.svg","./ex/0061-relaxation.svg","./ex/0061-tension.svg","./ex/0066-relaxation.svg","./ex/0066-tension.svg","./ex/0087-relaxation.svg","./ex/0087-tension.svg","./ex/0096-relaxation.svg","./ex/0096-tension.svg","./ex/0099-relaxation.svg","./ex/0099-tension.svg","./ex/0103-relaxation.svg","./ex/0103-tension.svg","./ex/0107-relaxation.svg","./ex/0107-tension.svg","./ex/0109-relaxation.svg","./ex/0109-tension.svg","./ex/0115-relaxation.svg","./ex/0115-tension.svg","./ex/0117-relaxation.svg","./ex/0117-tension.svg","./ex/0118-relaxation.svg","./ex/0118-tension.svg","./ex/0119-relaxation.svg","./ex/0119-tension.svg","./ex/0120-relaxation.svg","./ex/0120-tension.svg","./ex/0123-relaxation.svg","./ex/0123-tension.svg","./ex/0124-relaxation.svg","./ex/0124-tension.svg","./ex/0127-relaxation.svg","./ex/0127-tension.svg","./ex/0142-relaxation.svg","./ex/0142-tension.svg","./ex/0156-relaxation.svg","./ex/0156-tension.svg","./ex/0157-relaxation.svg","./ex/0157-tension.svg","./ex/0183-relaxation.svg","./ex/0183-tension.svg","./ex/0205-relaxation.svg","./ex/0205-tension.svg","./ex/0206-relaxation.svg","./ex/0206-tension.svg","./ex/0212-relaxation.svg","./ex/0212-tension.svg","./ex/0220-relaxation.svg","./ex/0220-tension.svg","./ex/0227-relaxation.svg","./ex/0227-tension.svg","./ex/0236-relaxation.svg","./ex/0236-tension.svg","./ex/0239-relaxation.svg","./ex/0239-tension.svg","./ex/0273-relaxation.svg","./ex/0273-tension.svg","./ex/0279-relaxation.svg","./ex/0279-tension.svg","./ex/0281-relaxation.svg","./ex/0281-tension.svg","./ex/0286-relaxation.svg","./ex/0286-tension.svg","./ex/0288-relaxation.svg","./ex/0288-tension.svg"];
const EXTRA = [
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js",
  "https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // shell OBLIGATORIO y fresco (sin caché HTTP): si algo falla, la
    // instalación aborta y el SW/caché anteriores quedan intactos
    await c.addAll(SHELL.map(u => new Request(u, { cache: "reload" })));
    // externos: mejor esfuerzo (opacos); si fallan no rompen la instalación
    await Promise.all(EXTRA.map(async u => {
      try { const r = await fetch(u, { mode: "no-cors" }); if (r) await c.put(u, r); } catch (err) {}
    }));
    await Promise.all(LAZY.map(async u => { try { const r = await fetch(u); if (r && r.ok) await c.put(u, r); } catch (err) {} }));
    self.skipWaiting();   // solo tras un shell completo
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
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isNav = req.mode === "navigate" ||
    (req.headers.get("accept") || "").includes("text/html");

  // navegación + archivos propios: caché primero (arranque instantáneo,
  // funciona sin señal) y la red actualiza la caché en segundo plano
  if (isNav || sameOrigin) {
    const key = isNav ? "./index.html" : req;
    e.respondWith((async () => {
      const cached = await caches.match(key);
      const network = fetch(req).then(res => {
        if (res && (res.status === 200 || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(key, copy));
        }
        return res;
      }).catch(() => null);
      if (cached) { network.catch(() => {}); return cached; }
      const res = await network;
      if (res) return res;
      return (isNav ? (await caches.match("./index.html")) || (await caches.match("./")) : undefined) || Response.error();
    })());
    return;
  }

  // externos: caché primero; si vienen de la red, se guardan (incluye opacos)
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
