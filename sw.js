// صرف لانچر کی اپنی فائلیں کیش ہوتی ہیں۔ گیمز کو یہ ہاتھ نہیں لگاتا۔
// لانچر میں تبدیلی کریں تو نیچے والا ورژن بڑھا دیں (v1 -> v2)۔
const CACHE = 'hub-v3';
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

  // games.json: پہلے نیٹ ورک تاکہ نیا گیم فوراً نظر آئے، ورنہ کیش
  if (req.url.endsWith('games.json')) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // باقی: کیش سے فوراً، پیچھے سے تازہ کاری
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
