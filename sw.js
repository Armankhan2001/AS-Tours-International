const CACHE_NAME = 'astours-v1';
const urlsToCache = [
    // --- Critical files for the PWA shell ---
    './index.html',
    
    // --- Note: These generic files often cause 'Request failed' errors 
    // --- if the file names or paths are not exactly correct. 
    // --- We comment them out to ensure PWA install succeeds.
    // './css/style.css', 
    // './js/main.js',   
    
    // --- Images & Icons ---
    './image/astourlogo.png', // Main logo/icon
    // Add other essential images here
    
    // --- External Resources (CDNs are fine as they are absolute URLs) ---
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    // 'https://cdn.tailwindcss.com', <--- REMOVED: CORS Policy blocks caching this resource.
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Inter:wght@300;400;600;700&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // If not in cache, fetch from network
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName); // Deletes old caches
                    }
                })
            );
        })
    );
});