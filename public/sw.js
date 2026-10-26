// Network-only worker. No HTML, API, auth, token, CSV or finance caching.
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
// Deliberately no fetch handler and no Cache Storage writes.
