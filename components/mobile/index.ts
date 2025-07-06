// Mobile Components Export Index

// Navigation
export { 
  BottomNavigation, 
  FloatingActionButton, 
  QuickActionMenu 
} from './bottom-navigation'

// Content Components
export { SwipeCard, SwipeCardStack } from './swipe-card'
export { TouchCarousel, CompactTouchCarousel } from './touch-carousel'
export { PullToRefresh, SimplePullToRefresh } from './pull-to-refresh'
export { VirtualScroll, InfiniteScroll, VirtualGrid } from './virtual-scroll'

// Layout
export { MobileNewsPage } from './mobile-news-page'

// Performance
export { 
  LazyImage,
  useResourcePreloader,
  useMemoryMonitor,
  useNetworkQuality,
  CriticalCSS,
  usePerformanceBudget,
  AdaptiveLoading,
  BundleSizeAnalyzer
} from './performance-optimizer'

// Gestures
export {
  useAdvancedGestures,
  GestureContainer,
  SwipeableCard,
  PinchZoom,
  LongPress,
  GestureDebugPanel
} from './gesture-system'

// Hooks
export {
  useMobileAdvanced,
  useGestures,
  useScrollDetection,
  usePerformanceMonitoring
} from '../hooks/use-mobile-advanced'

// PWA
export {
  PWAProvider,
  usePWA,
  PWAInstallBanner,
  PWAUpdateBanner
} from '../pwa/pwa-provider'

// Types
export interface MobileComponent {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  hasTouch: boolean
}

export interface GestureEvent {
  type: 'swipe' | 'pinch' | 'tap' | 'longpress' | 'rotate'
  direction?: 'left' | 'right' | 'up' | 'down'
  velocity?: number
  distance?: number
  scale?: number
  rotation?: number
  point?: { x: number; y: number }
  target?: EventTarget
}

export interface PWAFeatures {
  isInstalled: boolean
  isInstallable: boolean
  canInstall: boolean
  notificationPermission: NotificationPermission
  isOnline: boolean
}

export interface PerformanceMetrics {
  fcp: number
  lcp: number
  fid: number
  cls: number
  ttfb: number
  loadTime: number
}

// Utility functions
export const detectMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export const detectTouch = () => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export const getNetworkQuality = () => {
  if (typeof navigator === 'undefined') return 'unknown'
  
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection
  
  if (!connection) return 'unknown'
  
  return connection.effectiveType || 'unknown'
}

export const supportsPWA = () => {
  if (typeof window === 'undefined') return false
  
  return 'serviceWorker' in navigator && 'PushManager' in window
}

export const supportsNotifications = () => {
  if (typeof window === 'undefined') return false
  
  return 'Notification' in window
}

export const supportsVibration = () => {
  if (typeof navigator === 'undefined') return false
  
  return 'vibrate' in navigator
}

// Configuration constants
export const MOBILE_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

export const GESTURE_THRESHOLDS = {
  swipe: 50,
  pinch: 0.1,
  tap: 10,
  longpress: 500
} as const

export const PERFORMANCE_BUDGETS = {
  fcp: 1800,
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  ttfb: 600
} as const

export const PWA_CONFIG = {
  name: 'Portal Autopropelidos',
  shortName: 'Autopropelidos',
  description: 'Portal definitivo sobre equipamentos autopropelidos e a Resolução 996 do CONTRAN',
  themeColor: '#2563eb',
  backgroundColor: '#000000'
} as const