var cacheName = 'EPT-v1';
var appShellFiles = [
    // './index.html',

    // './dist/bundle.js',
    // './dist/vendor.bundle.js',

    // './assets/favicons/android-icon-48x48.png',
    // './assets/favicons/android-icon-36x36.png',
    // './assets/favicons/android-icon-72x72.png',
    // './assets/favicons/android-icon-96x96.png',
    // './assets/favicons/android-icon-144x144.png',
    // './assets/favicons/android-icon-192x192.png',
    // './assets/favicons/apple-icon-57x57.png',
    // './assets/favicons/apple-icon-60x60.png',
    // './assets/favicons/apple-icon-72x72.png',
    // './assets/favicons/apple-icon-76x76.png',
    // './assets/favicons/apple-icon-114x114.png',
    // './assets/favicons/apple-icon-120x120.png',
    // './assets/favicons/apple-icon-144x144.png',
    // './assets/favicons/apple-icon-152x152.png',
    // './assets/favicons/apple-icon-180x180.png',
    // './assets/favicons/apple-icon-precomposed.png',
    // './assets/favicons/apple-icon.png',
    // './assets/favicons/browserconfig.xml',
    // './assets/favicons/favicon-16x16.png',
    // './assets/favicons/favicon-32x32.png',
    // './assets/favicons/favicon-96x96.png',
    // './assets/favicons/favicon.ico',
    // './assets/favicons/manifest.json',
    // './assets/favicons/ms-icon-70x70.png',
    // './assets/favicons/ms-icon-144x144.png',
    // './assets/favicons/ms-icon-150x150.png',
    // './assets/favicons/ms-icon-310x310.png',

    // './assets/fonts/font.png',
    // './assets/fonts/font.xml',
    // './assets/fonts/minecraftia-black.png',
    // './assets/fonts/minecraftia.xml',
    // // './assets/fonts/MunroNarrow.ttf',
    // // './assets/fonts/Pixeled.ttf',
    // './assets/fonts/prophecy.fnt',
    // './assets/fonts/prophecy.png',


];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(appShellFiles);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
