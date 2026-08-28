const CACHE_NAME = 'battery-monitor-smart-cache'; 
const urlsToCache = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/web-app-manifest-192x192.png',  
  '/web-app-manifest-512x512.png'   
];

// 1. تنصيب التطبيق وتخزين الملفات الأساسية لأول مرة
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('تم تنصيب الكاش الذكي بنجاح');
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. الكود الذكي (الشبكة أولاً، ثم الذاكرة)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // إذا كنت أونلاين: تم جلب أحدث نسخة من السيرفر
        // نقوم بفتح الذاكرة وتحديثها بالنسخة الجديدة بصمت
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse; // عرض النسخة الجديدة للمستخدم
        });
      })
      .catch(() => {
        // إذا كنت أوفلاين (فشل الاتصال): اسحب النسخة المحفوظة من الذاكرة
        return caches.match(event.request);
      })
  );
});
