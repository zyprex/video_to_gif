let siteCacheName = "video_to_gif";

let assets = [
  '',
  'style.css',
  'lib/Animated_GIF.min.js',
  'video_cull.html'   , 'video_cull.js',
  'video_shorten.html', 'video_shorten.js',
  'video_to_gif.html' , 'video_to_gif.js',
  'images_to_gif.html', 'images_to_gif.js',
]
/* 
 * TypeError: Failed to execute 'Cache' on 'addAll': Request failed.
 * Reason: Possible a typo mess it up.
 * root URLs (like http://example.com/) must provide an index.html
 */
.map(i=>`/video_to_gif/${i}`);
// .map(i=>`/${i}`);


self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(siteCacheName).then(function (cache) {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", function (event) {
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
