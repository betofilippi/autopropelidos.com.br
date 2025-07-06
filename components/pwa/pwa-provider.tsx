'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useMobileAdvanced } from '@/hooks/use-mobile-advanced'

interface PWAContextType {
  isInstalled: boolean
  isInstallable: boolean
  canInstall: boolean
  install: () => Promise<void>
  updateAvailable: boolean
  update: () => Promise<void>
  notificationPermission: NotificationPermission
  requestNotificationPermission: () => Promise<NotificationPermission>
  subscribeToNotifications: () => Promise<PushSubscription | null>
  unsubscribeFromNotifications: () => Promise<void>
  isOnline: boolean
  registerSW: () => Promise<ServiceWorkerRegistration | null>
  unregisterSW: () => Promise<boolean>
}

const PWAContext = createContext<PWAContextType | undefined>(undefined)

interface PWAProviderProps {
  children: ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  const { pwaInfo, installPWA } = useMobileAdvanced()
  const [swRegistration, setSWRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [isOnline, setIsOnline] = useState(true)

  // Initialize PWA features
  useEffect(() => {
    initializePWA()
    setupNetworkListener()
    checkNotificationPermission()
  }, [])

  const initializePWA = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })
        
        setSWRegistration(registration)
        console.log('Service Worker registered successfully:', registration)

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true)
                console.log('New app version available')
              }
            })
          }
        })

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('Message from Service Worker:', event.data)
          
          if (event.data.type === 'UPDATE_AVAILABLE') {
            setUpdateAvailable(true)
          }
        })

        // Request update check
        registration.update()

      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }

  const setupNetworkListener = () => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }

  const install = async () => {
    await installPWA()
  }

  const update = async () => {
    if (swRegistration && swRegistration.waiting) {
      // Send message to service worker to skip waiting
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
      
      // Listen for controlling change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }
  }

  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)
    return permission
  }

  const subscribeToNotifications = async (): Promise<PushSubscription | null> => {
    if (!swRegistration) {
      console.error('Service Worker not registered')
      return null
    }

    if (notificationPermission !== 'granted') {
      const permission = await requestNotificationPermission()
      if (permission !== 'granted') {
        console.log('Notification permission denied')
        return null
      }
    }

    try {
      // Generate VAPID keys in production
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'demo-key'
      
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      })

      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })

      console.log('Push notification subscription successful:', subscription)
      return subscription

    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  const unsubscribeFromNotifications = async () => {
    if (!swRegistration) {
      console.error('Service Worker not registered')
      return
    }

    try {
      const subscription = await swRegistration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        
        // Notify server
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(subscription)
        })
        
        console.log('Unsubscribed from push notifications')
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
    }
  }

  const registerSW = async (): Promise<ServiceWorkerRegistration | null> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        setSWRegistration(registration)
        return registration
      } catch (error) {
        console.error('Service Worker registration failed:', error)
        return null
      }
    }
    return null
  }

  const unregisterSW = async (): Promise<boolean> => {
    if (swRegistration) {
      try {
        const result = await swRegistration.unregister()
        setSWRegistration(null)
        return result
      } catch (error) {
        console.error('Service Worker unregistration failed:', error)
        return false
      }
    }
    return false
  }

  const contextValue: PWAContextType = {
    isInstalled: pwaInfo.isInstalled,
    isInstallable: pwaInfo.isInstallable,
    canInstall: pwaInfo.canInstall,
    install,
    updateAvailable,
    update,
    notificationPermission,
    requestNotificationPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    isOnline,
    registerSW,
    unregisterSW
  }

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
    </PWAContext.Provider>
  )
}

export function usePWA() {
  const context = useContext(PWAContext)
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider')
  }
  return context
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// PWA Installation Banner Component
interface PWAInstallBannerProps {
  onDismiss?: () => void
}

export function PWAInstallBanner({ onDismiss }: PWAInstallBannerProps) {
  const { canInstall, install } = usePWA()
  const [dismissed, setDismissed] = useState(false)

  if (!canInstall || dismissed) {
    return null
  }

  const handleInstall = async () => {
    await install()
    setDismissed(true)
    onDismiss?.()
  }

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-blue-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex-1">
          <h3 className="font-semibold">Instalar App</h3>
          <p className="text-sm opacity-90">
            Adicione à tela inicial para acesso rápido
          </p>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleInstall}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
          >
            Instalar
          </button>
          
          <button
            onClick={handleDismiss}
            className="text-white opacity-75 hover:opacity-100 p-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

// PWA Update Banner Component
export function PWAUpdateBanner() {
  const { updateAvailable, update } = usePWA()
  const [dismissed, setDismissed] = useState(false)

  if (!updateAvailable || dismissed) {
    return null
  }

  const handleUpdate = async () => {
    await update()
  }

  const handleDismiss = () => {
    setDismissed(true)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex-1">
          <h3 className="font-semibold">Atualização Disponível</h3>
          <p className="text-sm opacity-90">
            Nova versão do app está pronta
          </p>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleUpdate}
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
          >
            Atualizar
          </button>
          
          <button
            onClick={handleDismiss}
            className="text-white opacity-75 hover:opacity-100 p-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAProvider