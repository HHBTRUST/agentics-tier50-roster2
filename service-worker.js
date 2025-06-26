// Agentics Service Worker v1.0.0
const CACHE_NAME = 'agentics-v1.0.0';
const urlsToCache = [
  '/',
  '/command-center.html',
  '/agentics-tier50-roster.html',
  '/authority-hierarchy.html',
  '/founders-seal-system.html',
  '/status-dashboard.html',
  '/assets/css/agentics-core.css',
  '/assets/js/agentics-core.js',
  '/assets/js/agentics-search.js'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch resources
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Update Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline commands
self.addEventListener('sync', event => {
  if (event.tag === 'sync-commands') {
    event.waitUntil(syncCommands());
  }
});

async function syncCommands() {
  // Sync any offline commands when back online
  console.log('Syncing offline commands...');
}