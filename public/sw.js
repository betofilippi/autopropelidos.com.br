// Service Worker for PWA
const CACHE_NAME = 'autopropelidos-v1.0.0'
const OFFLINE_URL = '/offline'
const FALLBACK_IMAGE = '/images/placeholder-news.jpg'

// Resources to cache immediately
const PRECACHE_URLS = [
  '/',
  '/noticias',
  '/ferramentas',
  '/resolucao-996',
  '/offline',
  '/manifest.json',
  '/images/placeholder-news.jpg',
  '/css/critical.css',
  '/css/critical-news.css'
]

// Dynamic cache patterns
const CACHE_PATTERNS = {
  // Cache images for 7 days
  images: {
    pattern: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
    strategy: 'cacheFirst',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  // Cache API responses for 1 hour
  api: {
    pattern: /\/api\//,
    strategy: 'networkFirst',
    maxAge: 60 * 60 * 1000 // 1 hour
  },
  // Cache static assets for 30 days
  static: {
    pattern: /\.(js|css|woff|woff2|ttf|eot)$/i,
    strategy: 'cacheFirst',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential resources...')
        return cache.addAll(PRECACHE_URLS)
      })
      .then(() => {
        console.log('Service Worker installed successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        console.log('Service Worker activated successfully')
        return self.clients.claim()
      })
      .catch((error) => {
        console.error('Service Worker activation failed:', error)
      })
  )
})

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return
  }

  const url = new URL(event.request.url)
  
  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If network succeeds, cache the response
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone)
              })
          }
          return response
        })
        .catch(() => {
          // If network fails, try cache first, then offline page
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              return caches.match(OFFLINE_URL)
            })
        })
    )
    return
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirstStrategy(event.request, CACHE_PATTERNS.api)
    )
    return
  }

  // Handle image requests
  if (CACHE_PATTERNS.images.pattern.test(url.pathname)) {
    event.respondWith(
      cacheFirstStrategy(event.request, CACHE_PATTERNS.images)
        .catch(() => {
          return caches.match(FALLBACK_IMAGE)
        })
    )
    return
  }

  // Handle static assets
  if (CACHE_PATTERNS.static.pattern.test(url.pathname)) {
    event.respondWith(
      cacheFirstStrategy(event.request, CACHE_PATTERNS.static)
    )
    return
  }

  // Default: network first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone)
            })
        }
        return response
      })
      .catch(() => {
        return caches.match(event.request)
      })
  )
})

// Cache-first strategy
async function cacheFirstStrategy(request, options) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    // Check if cache is expired
    const dateHeader = cachedResponse.headers.get('date')
    if (dateHeader) {
      const cachedTime = new Date(dateHeader).getTime()
      const now = Date.now()
      
      if (now - cachedTime < options.maxAge) {
        return cachedResponse
      }
    }
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone()
      await cache.put(request, responseClone)
    }
    
    return networkResponse
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Network-first strategy
async function networkFirstStrategy(request, options) {
  const cache = await caches.open(CACHE_NAME)
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone()
      await cache.put(request, responseClone)
    }
    
    return networkResponse
  } catch (error) {
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      // Check if cache is not too old
      const dateHeader = cachedResponse.headers.get('date')
      if (dateHeader) {
        const cachedTime = new Date(dateHeader).getTime()
        const now = Date.now()
        
        if (now - cachedTime < options.maxAge) {
          return cachedResponse
        }
      }
    }
    
    throw error
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'news-sync') {
    event.waitUntil(syncNews())
  }
  
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics())
  }
})

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  if (!event.data) {
    return
  }
  
  const data = event.data.json()
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    image: data.image,
    data: {
      url: data.url,
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'dismiss',
        title: 'Dispensar'
      }
    ],
    requireInteraction: true,
    vibrate: [100, 50, 100],
    tag: data.tag || 'autopropelidos-news'
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'dismiss') {
    return
  }
  
  const url = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === url && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
  )
})

// Message handling for communication with the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)
  
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          )
        })
        .then(() => {
          event.ports[0].postMessage({ success: true })
        })
    )
  }
})

// Sync functions
async function syncNews() {
  try {
    console.log('Syncing news in background...')
    
    const response = await fetch('/api/news')
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      await cache.put('/api/news', response.clone())
      console.log('News synced successfully')
    }
  } catch (error) {
    console.error('Failed to sync news:', error)
  }
}

async function syncAnalytics() {
  try {
    console.log('Syncing analytics in background...')
    
    // Get queued analytics events from IndexedDB
    const events = await getQueuedAnalyticsEvents()
    
    if (events.length > 0) {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ events })
      })
      
      await clearQueuedAnalyticsEvents()
      console.log('Analytics synced successfully')
    }
  } catch (error) {
    console.error('Failed to sync analytics:', error)
  }
}

// Helper functions for IndexedDB operations
async function getQueuedAnalyticsEvents() {
  // Implementation would depend on your IndexedDB setup
  return []
}

async function clearQueuedAnalyticsEvents() {
  // Implementation would depend on your IndexedDB setup
}

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    console.log('Periodic sync triggered:', event.tag)
    
    if (event.tag === 'news-update') {
      event.waitUntil(syncNews())
    }
  })
}

console.log('Service Worker script loaded successfully')