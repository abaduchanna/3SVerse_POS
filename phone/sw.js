/* 3S Verse POS Mobile - minimal service worker (offline shell) */
const C = '3sverse-phone-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(['.', 'index.html', 'manifest.webmanifest', 'icon.svg']).catch(()=>{}))); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const u = e.request.url;
  if (u.includes('gstatic') || u.includes('firebase') || u.includes('firestore') || u.includes('googleapis')) return; // always live for cloud
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
