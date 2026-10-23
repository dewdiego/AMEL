// Service worker del portal: recibe las notificaciones push y abre el portal al tocarlas.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

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

// Cache mínimo para que la app abra sin conexión (la pantalla; los datos siempre vienen del servidor)
const CACHE = 'portal-v1';
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.includes('/portal/')) return;
  event.respondWith(fetch(req).then((res) => {
    const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res;
  }).catch(() => caches.match(req)));
});
