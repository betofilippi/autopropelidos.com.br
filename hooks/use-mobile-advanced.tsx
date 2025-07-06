'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// Types
interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isIOS: boolean
  isAndroid: boolean
  hasTouch: boolean
  orientation: 'portrait' | 'landscape'
  screenSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  userAgent: string
}

interface NetworkInfo {
  isOnline: boolean
  effectiveType: string
  saveData: boolean
  downlink: number
  rtt: number
}

interface BatteryInfo {
  charging: boolean
  level: number
  chargingTime: number
  dischargingTime: number
}

interface PWAInfo {
  isInstalled: boolean
  isInstallable: boolean
  canInstall: boolean
  installation: BeforeInstallPromptEvent | null
}

// Enhanced Mobile Hook
export function useMobileAdvanced() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isIOS: false,
    isAndroid: false,
    hasTouch: false,
    orientation: 'portrait',
    screenSize: 'lg',
    userAgent: ''
  })

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: true,
    effectiveType: '4g',
    saveData: false,
    downlink: 10,
    rtt: 50
  })

  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo>({
    charging: true,
    level: 1,
    chargingTime: 0,
    dischargingTime: Infinity
  })

  const [pwaInfo, setPWAInfo] = useState<PWAInfo>({
    isInstalled: false,
    isInstallable: false,
    canInstall: false,
    installation: null
  })

  const updateDeviceInfo = useCallback(() => {
    if (typeof window === 'undefined') return

    const width = window.innerWidth
    const height = window.innerHeight
    const userAgent = navigator.userAgent

    // Screen size detection
    let screenSize: DeviceInfo['screenSize'] = 'sm'
    if (width >= 1536) screenSize = '2xl'
    else if (width >= 1280) screenSize = 'xl'
    else if (width >= 1024) screenSize = 'lg'
    else if (width >= 768) screenSize = 'md'
    else screenSize = 'sm'

    // Device type detection
    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024
    const isDesktop = width >= 1024

    // OS detection
    const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    const isAndroid = /Android/.test(userAgent)

    // Touch detection
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // Orientation detection
    const orientation = height > width ? 'portrait' : 'landscape'

    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      isIOS,
      isAndroid,
      hasTouch,
      orientation,
      screenSize,
      userAgent
    })
  }, [])

  const updateNetworkInfo = useCallback(() => {
    if (typeof window === 'undefined') return

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    setNetworkInfo({
      isOnline: navigator.onLine,
      effectiveType: connection?.effectiveType || '4g',
      saveData: connection?.saveData || false,
      downlink: connection?.downlink || 10,
      rtt: connection?.rtt || 50
    })
  }, [])

  const updateBatteryInfo = useCallback(async () => {
    if (typeof window === 'undefined') return

    try {
      const battery = await (navigator as any).getBattery?.()
      if (battery) {
        setBatteryInfo({
          charging: battery.charging,
          level: battery.level,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        })
      }
    } catch (error) {
      console.log('Battery API not supported')
    }
  }, [])

  const updatePWAInfo = useCallback(() => {
    if (typeof window === 'undefined') return

    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true

    setPWAInfo(prev => ({
      ...prev,
      isInstalled
    }))
  }, [])

  useEffect(() => {
    updateDeviceInfo()
    updateNetworkInfo()
    updateBatteryInfo()
    updatePWAInfo()

    // Event listeners
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)
    window.addEventListener('online', updateNetworkInfo)
    window.addEventListener('offline', updateNetworkInfo)

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setPWAInfo(prev => ({
        ...prev,
        isInstallable: true,
        canInstall: true,
        installation: e
      }))
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)

    // Network change detection
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo)
    }

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
      window.removeEventListener('online', updateNetworkInfo)
      window.removeEventListener('offline', updateNetworkInfo)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)

      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo)
      }
    }
  }, [updateDeviceInfo, updateNetworkInfo, updateBatteryInfo, updatePWAInfo])

  const installPWA = useCallback(async () => {
    if (pwaInfo.installation) {
      const result = await pwaInfo.installation.prompt()
      setPWAInfo(prev => ({
        ...prev,
        canInstall: false,
        installation: null
      }))
      return result
    }
    return null
  }, [pwaInfo.installation])

  return {
    deviceInfo,
    networkInfo,
    batteryInfo,
    pwaInfo,
    installPWA,
    // Convenience getters
    isMobile: deviceInfo.isMobile,
    isTablet: deviceInfo.isTablet,
    isDesktop: deviceInfo.isDesktop,
    isIOS: deviceInfo.isIOS,
    isAndroid: deviceInfo.isAndroid,
    hasTouch: deviceInfo.hasTouch,
    isOnline: networkInfo.isOnline,
    isLowBattery: batteryInfo.level < 0.2,
    isSlowNetwork: networkInfo.effectiveType === 'slow-2g' || networkInfo.effectiveType === '2g',
    shouldOptimizeForPerformance: batteryInfo.level < 0.2 || networkInfo.saveData || networkInfo.effectiveType === 'slow-2g' || networkInfo.effectiveType === '2g'
  }
}

// Gesture Detection Hook
export function useGestures(element: React.RefObject<HTMLElement>) {
  const [gestures, setGestures] = useState({
    swipeDirection: null as 'left' | 'right' | 'up' | 'down' | null,
    pinchScale: 1,
    isLongPress: false,
    tapCount: 0
  })

  const touchStart = useRef({ x: 0, y: 0, time: 0 })
  const touchDistance = useRef(0)
  const longPressTimer = useRef<NodeJS.Timeout>()
  const tapTimer = useRef<NodeJS.Timeout>()
  const tapCount = useRef(0)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    // Multi-touch (pinch)
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      touchDistance.current = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      )
    }

    // Long press detection
    longPressTimer.current = setTimeout(() => {
      setGestures(prev => ({ ...prev, isLongPress: true }))
      
      // Haptic feedback for long press
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }, 500)
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }

    // Pinch gesture
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      )
      const scale = currentDistance / touchDistance.current
      setGestures(prev => ({ ...prev, pinchScale: scale }))
    }
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y
    const deltaTime = Date.now() - touchStart.current.time

    // Swipe detection
    const minSwipeDistance = 50
    const maxSwipeTime = 300

    if (deltaTime < maxSwipeTime) {
      if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
        let direction: 'left' | 'right' | 'up' | 'down' | null = null
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left'
        } else {
          direction = deltaY > 0 ? 'down' : 'up'
        }

        setGestures(prev => ({ ...prev, swipeDirection: direction }))
        
        // Haptic feedback for swipe
        if (navigator.vibrate) {
          navigator.vibrate(30)
        }

        // Reset swipe direction after animation
        setTimeout(() => {
          setGestures(prev => ({ ...prev, swipeDirection: null }))
        }, 300)
      }
    }

    // Tap detection
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
      tapCount.current++
      
      if (tapTimer.current) {
        clearTimeout(tapTimer.current)
      }

      tapTimer.current = setTimeout(() => {
        setGestures(prev => ({ ...prev, tapCount: tapCount.current }))
        
        // Light haptic feedback for tap
        if (navigator.vibrate && tapCount.current === 1) {
          navigator.vibrate(10)
        }
        
        // Reset tap count
        setTimeout(() => {
          tapCount.current = 0
          setGestures(prev => ({ ...prev, tapCount: 0 }))
        }, 100)
      }, 300)
    }

    // Reset long press
    setGestures(prev => ({ ...prev, isLongPress: false }))
  }, [])

  useEffect(() => {
    const el = element.current
    if (!el) return

    el.addEventListener('touchstart', handleTouchStart, { passive: false })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return gestures
}

// Scroll Detection Hook
export function useScrollDetection() {
  const [scrollInfo, setScrollInfo] = useState({
    scrollY: 0,
    scrollDirection: 'down' as 'up' | 'down',
    isScrolling: false,
    isNearTop: true,
    isNearBottom: false,
    scrollProgress: 0
  })

  const lastScrollY = useRef(0)
  const scrollTimer = useRef<NodeJS.Timeout>()

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollProgress = currentScrollY / documentHeight

    setScrollInfo(prev => ({
      ...prev,
      scrollY: currentScrollY,
      scrollDirection: currentScrollY > lastScrollY.current ? 'down' : 'up',
      isScrolling: true,
      isNearTop: currentScrollY < 50,
      isNearBottom: currentScrollY > documentHeight - 100,
      scrollProgress: Math.min(scrollProgress, 1)
    }))

    lastScrollY.current = currentScrollY

    // Clear existing timer
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current)
    }

    // Set scroll end detection
    scrollTimer.current = setTimeout(() => {
      setScrollInfo(prev => ({ ...prev, isScrolling: false }))
    }, 150)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current)
      }
    }
  }, [handleScroll])

  return scrollInfo
}

// Performance Monitoring Hook
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    ttfb: 0, // Time to First Byte
    loadTime: 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        if (entry.entryType === 'paint') {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
          }
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }))
        }
        
        if (entry.entryType === 'first-input') {
          setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }))
        }
        
        if (entry.entryType === 'layout-shift') {
          setMetrics(prev => ({ ...prev, cls: prev.cls + (entry as any).value }))
        }
        
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          setMetrics(prev => ({
            ...prev,
            ttfb: navEntry.responseStart - navEntry.requestStart,
            loadTime: navEntry.loadEventEnd - navEntry.navigationStart
          }))
        }
      })
    })

    observer.observe({ type: 'paint', buffered: true })
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
    observer.observe({ type: 'first-input', buffered: true })
    observer.observe({ type: 'layout-shift', buffered: true })
    observer.observe({ type: 'navigation', buffered: true })

    return () => observer.disconnect()
  }, [])

  return metrics
}

export default useMobileAdvanced