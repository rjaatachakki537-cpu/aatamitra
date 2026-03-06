self.addEventListener('install', (e) => {
  console.log('Aata Mitra SW: Installed');
});
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});
