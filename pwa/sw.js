const cacheName = "jsESPPWA-v5";
const appShellFiles = [
  "index.html",
  "app.js",
  "page.css",
  "images/icon128.png",
  "images/icon144.png",
  "images/icon512.png",
];

console.log(self);

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName)
        .then(function(cache) {
            console.log('Opened cache');
        return cache.addAll(appShellFiles);
        })
    );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        /*
        let responseClone = response.clone();
        caches.open(cacheName).then((cache) => {
          if(event.request.method === "GET")
            cache.put(event.request, responseClone);
        });
        */
        return response;
      });
    }).catch((err) => {
      console.error(err);
      return caches.match('index.html');
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log("sw_activate", event);
});
