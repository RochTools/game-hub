// صرف لانچر کی اپنی فائلیں کیش ہوتی ہیں۔ گیمز کو یہ ہاتھ نہیں لگاتا۔
// پہلے نیٹ ورک سے تازہ فائل لیتا ہے (تبدیلی فوراً نظر آتی ہے)، آف لائن ہو تو کیش سے دیتا ہے۔
const CACHE = 'hub-v9';
const SHELL = [
  './', 'index.html', 'style.css', 'app.js',
  'games.json', 'manifest.json', 'icon-192.png', 'icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // صرف لانچر کے اپنے راستے کی GET درخواستیں؛ باقی سب (گیمز، ان کے آئیکن) براہِ راست نیٹ ورک پر
  if (req.method !== 'GET' || !req.url.startsWith(self.registration.scope)) return;

  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
