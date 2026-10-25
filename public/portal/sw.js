// Service worker del portal: recibe las notificaciones push y abre el portal al tocarlas.
self.addEventListener('install', () => self.skipWaiting());
const CACHE = 'portal-v3';
// Al activarse una versión nueva, se borran las cachés viejas para que no convivan pantalla vieja y código nuevo
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
));

self.addEventListener('push', (event) => {
  let data = { title: 'Grupo Amel', body: 'Tenés una novedad de tu consorcio', url: '/portal/' };
  try { data = { ...data, ...event.data.json() }; } catch { if (event.data) data.body = event.data.text(); }
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body, icon: '/portal/icon-192.png', badge: '/portal/icon-192.png',
    data: { url: data.url }, tag: data.tag || undefined,
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/portal/';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
    for (const w of wins) { if (w.url.includes('/portal/') && 'focus' in w) { w.navigate(url); return w.focus(); } }
    return self.clients.openWindow(url);
  }));
});

// Cache mínimo para que la app abra sin conexión (la pantalla; los datos siempre vienen del servidor).
// Siempre red primero con un límite de 8 s; la caché sólo si no hay red.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.includes('/portal/')) return;
  event.respondWith((async () => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(req, { signal: ctrl.signal, cache: 'no-cache' });
      clearTimeout(t);
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    } catch {
      clearTimeout(t);
      return (await caches.match(req)) || Response.error();
    }
  })());
});
