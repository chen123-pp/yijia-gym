// Service Worker for 壹佳健身管理 PWA — 离线缓存主文件
const CACHE = 'yjgym-pwa-v1';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
      // 动态缓存同域新资源，保证后续打开更稳
      try { caches.open(CACHE).then(c => c.put(event.request, resp.clone())); } catch (e) {}
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
