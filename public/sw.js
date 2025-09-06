// VaultorVerse PWA Service Worker - 2025 Mobile-First Implementation

const CACHE_NAME = 'vaultorverse-v1';
const STATIC_CACHE = 'vaultorverse-static-v1';
const DYNAMIC_CACHE = 'vaultorverse-dynamic-v1';

// Resources to cache on installation
const STATIC_ASSETS = [
  '/',
  '/arena',
  '/events',
  '/leaderboard',
  '/dashboard',
  '/achievements',
  '/tokens',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
  pages: 'NetworkFirst',
  api: 'NetworkFirst', 
  static: 'CacheFirst',
  images: 'CacheFirst'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('VaultorVerse SW: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('VaultorVerse SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('VaultorVerse SW: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('VaultorVerse SW: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('VaultorVerse SW: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName.startsWith('vaultorverse-');
            })
            .map((cacheName) => {
              console.log('VaultorVerse SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('VaultorVerse SW: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;
  
  // Skip non-GET requests
  if (method !== 'GET') return;
  
  // Skip cross-origin requests (unless API)
  if (!url.startsWith(self.location.origin) && !url.includes('/api/')) {
    return;
  }

  event.respondWith(
    handleFetchRequest(request)
  );
});

// Handle different types of requests with appropriate strategies
async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // API requests - Network First with offline fallback
    if (url.pathname.startsWith('/api/')) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Static assets - Cache First
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Pages - Network First with cache fallback
    if (isPageRequest(request)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Images and media - Cache First
    if (isImageRequest(request)) {
      return await cacheFirst(request, DYNAMIC_CACHE);
    }
    
    // Default strategy - Network First
    return await networkFirst(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('VaultorVerse SW: Fetch failed', error);
    
    // Return offline fallback for pages
    if (isPageRequest(request)) {
      return getOfflineFallback();
    }
    
    throw error;
  }
}

// Network First strategy - try network, fall back to cache
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('VaultorVerse SW: Network failed, trying cache');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Cache First strategy - try cache, fall back to network
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('VaultorVerse SW: Both cache and network failed', error);
    throw error;
  }
}

// Utility functions to categorize requests
function isStaticAsset(pathname) {
  return pathname.includes('.') && (
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.ttf') ||
    pathname.endsWith('.json')
  );
}

function isPageRequest(request) {
  return request.destination === 'document';
}

function isImageRequest(request) {
  return request.destination === 'image';
}

// Offline fallback page
function getOfflineFallback() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>VaultorVerse - Offline</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          color: #ffffff;
          margin: 0;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .container {
          max-width: 400px;
          padding: 40px 20px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #00ff88, #00ccff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .message {
          font-size: 18px;
          margin-bottom: 30px;
          color: #cccccc;
          line-height: 1.5;
        }
        .retry-btn {
          background: linear-gradient(135deg, #00ff88, #00ccff);
          color: #0a0a0a;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          font-size: 16px;
          transition: transform 0.2s;
        }
        .retry-btn:hover {
          transform: scale(1.05);
        }
        .features {
          margin-top: 40px;
          text-align: left;
        }
        .feature {
          margin: 10px 0;
          padding: 8px 0;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">VaultorVerse</div>
        <div class="message">
          You're currently offline, but VaultorVerse is working to get you back in the arena!
        </div>
        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>
        <div class="features">
          <div class="feature">🎯 Prediction Markets</div>
          <div class="feature">🛡️ Shield Protection</div>
          <div class="feature">⚡ Live Events</div>
          <div class="feature">🏆 Global Rankings</div>
        </div>
      </div>
    </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('VaultorVerse SW: Background sync triggered');
  
  if (event.tag === 'prediction-sync') {
    event.waitUntil(syncPendingPredictions());
  }
});

// Sync pending predictions when back online
async function syncPendingPredictions() {
  try {
    // This would integrate with your actual prediction sync logic
    console.log('VaultorVerse SW: Syncing pending predictions...');
    
    // Example: Get pending actions from IndexedDB
    // const pendingActions = await getPendingActions();
    // await syncActions(pendingActions);
    
    console.log('VaultorVerse SW: Prediction sync complete');
  } catch (error) {
    console.error('VaultorVerse SW: Prediction sync failed', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('VaultorVerse SW: Push notification received');
  
  const options = {
    body: 'New prediction opportunities available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: '/arena'
    },
    actions: [
      {
        action: 'open',
        title: 'Open Arena',
        icon: '/icons/arena-shortcut.png'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ],
    vibrate: [200, 100, 200],
    requireInteraction: true
  };
  
  if (event.data) {
    const payload = event.data.json();
    options.body = payload.body || options.body;
    options.data.url = payload.url || options.data.url;
  }
  
  event.waitUntil(
    self.registration.showNotification('VaultorVerse', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('VaultorVerse SW: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open' || event.action === '') {
    const url = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        
        // Open new window if app not already open
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Periodic background sync for fresh data
self.addEventListener('periodicsync', (event) => {
  console.log('VaultorVerse SW: Periodic sync triggered');
  
  if (event.tag === 'market-updates') {
    event.waitUntil(updateMarketData());
  }
});

async function updateMarketData() {
  try {
    console.log('VaultorVerse SW: Updating market data in background');
    
    // Pre-fetch critical market data when user is likely to return
    const response = await fetch('/api/markets/trending');
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put('/api/markets/trending', response);
    }
  } catch (error) {
    console.error('VaultorVerse SW: Background market update failed', error);
  }
}

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_NEW_ROUTE':
      cacheNewRoute(payload.url);
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches();
      break;
      
    default:
      console.log('VaultorVerse SW: Unknown message type:', type);
  }
});

async function cacheNewRoute(url) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.add(url);
    console.log('VaultorVerse SW: Cached new route:', url);
  } catch (error) {
    console.error('VaultorVerse SW: Failed to cache route:', url, error);
  }
}

async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('VaultorVerse SW: All caches cleared');
  } catch (error) {
    console.error('VaultorVerse SW: Failed to clear caches', error);
  }
}

console.log('VaultorVerse SW: Service Worker loaded successfully');