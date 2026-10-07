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
const CACHE = "vexx-cache-v41";
const SHELL = ["./", "./index.html", "./styles.css", "./data.js", "./anatomy2d.js", "./anatomy3d.js", "./app.js", "./icon.png", "./manifest.webmanifest"];
/* miniaturas de los dibujos de ejercicios: se guardan en segundo plano (si falla alguno no rompe la instalación) */
const LAZY = ["./ex3/mb_9090_0.webp","./ex3/mb_hipcars_0.webp","./ex3/mb_wgs_0.webp","./ex3/mb_deepsq_0.webp","./ex3/mb_adductor_0.webp","./ex3/mb_hamstring_0.webp","./ex3/mb_ankle_0.webp","./ex3/mb_catcow_0.webp","./ex3/mb_circuit_0.webp","./ex3/mb_shcars_0.webp","./ex3/mb_passthru_0.webp","./ex3/mb_thoracic_0.webp","./ex3/mb_wall_0.webp","./ex3/mb_wrist_0.webp","./ex3/e_pressbanca_0.webp","./ex3/e_pressincmaq_0.webp","./ex3/e_pressincbarra_0.webp","./ex3/e_pressincmanc_0.webp","./ex3/e_pecfly_0.webp","./ex3/e_flysarriba_0.webp","./ex3/e_crossover_0.webp","./ex3/e_fondos_0.webp","./ex3/e_pressmil_0.webp","./ex3/e_pressmaqhombro_0.webp","./ex3/e_landmine_0.webp","./ex3/e_latmanc_0.webp","./ex3/e_latpolea_0.webp","./ex3/e_latmaq_0.webp","./ex3/e_frontraise_0.webp","./ex3/e_reardelt_0.webp","./ex3/e_facepull_0.webp","./ex3/e_extrice_0.webp","./ex3/e_extuni_0.webp","./ex3/e_pressfrances_0.webp","./ex3/e_pulldownneutro_0.webp","./ex3/e_pulldownabierto_0.webp","./ex3/e_remobarra_0.webp","./ex3/e_remomanc_0.webp","./ex3/e_remopolea_0.webp","./ex3/ce_1782311296032_0.webp","./ex3/ce_1782310417636_0.webp","./ex3/ce_1782313044383_0.webp","./ex3/ce_1782334604277_0.webp","./ex3/e_remogironda_0.webp","./ex3/e_remomaq_0.webp","./ex3/e_pullover_0.webp","./ex3/e_predicador_0.webp","./ex3/e_predicadormaq_0.webp","./ex3/e_curlpolea_0.webp","./ex3/e_curlmartillo_0.webp","./ex3/e_faceaway_0.webp","./ex3/e_curlconcentrado_0.webp","./ex3/e_curlfemac_0.webp","./ex3/e_curlfemsent_0.webp","./ex3/e_rdl_0.webp","./ex3/e_rdlmanc_0.webp","./ex3/e_pesomuerto_0.webp","./ex3/e_sentadilla_0.webp","./ex3/e_pendulo_0.webp","./ex3/e_extcuad_0.webp","./ex3/e_prensa_0.webp","./ex3/e_abductor_0.webp","./ex3/e_aductor_0.webp","./ex3/e_pantprensa_0.webp","./ex3/e_pantsent_0.webp","./ex3/e_gemelopie_0.webp","./ex3/e_pressmaqpecho_0.webp","./ex3/e_pressplanomanc_0.webp","./ex3/e_floorpress_0.webp","./ex3/e_zancadas_0.webp","./ex3/e_bulgara_0.webp","./ex3/e_hipthrust_0.webp","./ex3/e_plancha_0.webp","./ex3/e_crunchpolea_0.webp","./ex3/e_elevpiernas_0.webp","./ex3/e_abruedita_0.webp","./ex3/e_movcadera_0.webp","./ex3/e_pressmilsmith_0.webp","./ex3/e_extricebarra_0.webp","./ex3/e_girondaprono_0.webp","./ex3/e_remounimanc_0.webp","./ex3/e_hiperext_0.webp"];
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
