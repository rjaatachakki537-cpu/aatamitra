// ===============================
// SERVICE WORKER
// ===============================

const CACHE_NAME = "aatamitra-cache-v1";

const urlsToCache = [

"/",
"index.html",
"style.css",
"script.js",
"auth.js",
"splash.js",
"tracking.js",
"admin.js",
"payment.js",
"welcome.jpg",
"qr.png"

];

// ===============================
// INSTALL
// ===============================

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => {
return cache.addAll(urlsToCache);
})

);

});

// ===============================
// FETCH
// ===============================

self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)
.then(response => {

return response || fetch(event.request);

})

);

});

// ===============================
// ACTIVATE
// ===============================

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys => {

return Promise.all(

keys.filter(key => key !== CACHE_NAME)
.map(key => caches.delete(key))

);

})

);

});
