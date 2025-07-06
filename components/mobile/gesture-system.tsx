'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'

// Types
interface GestureEvent {
  type: 'swipe' | 'pinch' | 'tap' | 'longpress' | 'rotate'
  direction?: 'left' | 'right' | 'up' | 'down'
  velocity?: number
  distance?: number
  scale?: number
  rotation?: number
  point?: { x: number; y: number }
  target?: EventTarget
}

interface GestureConfig {
  swipe?: {
    threshold?: number
    velocity?: number
    enabled?: boolean
  }
  pinch?: {
    threshold?: number
    enabled?: boolean
  }
  tap?: {
    maxDelay?: number
    maxDistance?: number
    enabled?: boolean
  }
  longpress?: {
    duration?: number
    enabled?: boolean
  }
  rotate?: {
    threshold?: number
    enabled?: boolean
  }
  haptic?: boolean
}

interface GestureHandlers {
  onSwipe?: (event: GestureEvent) => void
  onPinch?: (event: GestureEvent) => void
  onTap?: (event: GestureEvent) => void
  onDoubleTap?: (event: GestureEvent) => void
  onLongPress?: (event: GestureEvent) => void
  onRotate?: (event: GestureEvent) => void
}

// Default configuration
const defaultConfig: Required<GestureConfig> = {
  swipe: {
    threshold: 50,
    velocity: 0.5,
    enabled: true
  },
  pinch: {
    threshold: 0.1,
    enabled: true
  },
  tap: {
    maxDelay: 300,
    maxDistance: 10,
    enabled: true
  },
  longpress: {
    duration: 500,
    enabled: true
  },
  rotate: {
    threshold: 10,
    enabled: true
  },
  haptic: true
}

// Enhanced Gesture Hook
export function useAdvancedGestures(
  handlers: GestureHandlers,
  config: GestureConfig = {}
) {
  const mergedConfig = { ...defaultConfig, ...config }
  
  // Touch tracking
  const touchStart = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 })
  const lastTap = useRef<number>(0)
  const tapCount = useRef<number>(0)
  const longPressTimer = useRef<NodeJS.Timeout>()
  const isLongPress = useRef<boolean>(false)
  
  // Multi-touch tracking
  const initialDistance = useRef<number>(0)
  const initialAngle = useRef<number>(0)
  const initialScale = useRef<number>(1)
  const initialRotation = useRef<number>(0)

  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (mergedConfig.haptic && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }, [mergedConfig.haptic])

  const calculateDistance = (touch1: Touch, touch2: Touch): number => {
    return Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    )
  }

  const calculateAngle = (touch1: Touch, touch2: Touch): number => {
    return Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    ) * 180 / Math.PI
  }

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    const now = Date.now()
    
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: now
    }
    
    isLongPress.current = false

    // Multi-touch handling
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      
      initialDistance.current = calculateDistance(touch1, touch2)
      initialAngle.current = calculateAngle(touch1, touch2)
      initialScale.current = 1
      initialRotation.current = 0
    }

    // Long press detection
    if (mergedConfig.longpress.enabled) {
      longPressTimer.current = setTimeout(() => {
        isLongPress.current = true
        
        handlers.onLongPress?.({
          type: 'longpress',
          point: { x: touch.clientX, y: touch.clientY },
          target: e.target
        })
        
        triggerHaptic(50)
      }, mergedConfig.longpress.duration)
    }
  }, [handlers, mergedConfig, triggerHaptic])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Clear long press if moving
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }

    // Multi-touch gestures
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      
      // Pinch gesture
      if (mergedConfig.pinch.enabled) {
        const currentDistance = calculateDistance(touch1, touch2)
        const scale = currentDistance / initialDistance.current
        
        if (Math.abs(scale - initialScale.current) > mergedConfig.pinch.threshold) {
          handlers.onPinch?.({
            type: 'pinch',
            scale,
            point: {
              x: (touch1.clientX + touch2.clientX) / 2,
              y: (touch1.clientY + touch2.clientY) / 2
            },
            target: e.target
          })
          
          initialScale.current = scale
        }
      }

      // Rotation gesture
      if (mergedConfig.rotate.enabled) {
        const currentAngle = calculateAngle(touch1, touch2)
        const rotation = currentAngle - initialAngle.current
        
        if (Math.abs(rotation - initialRotation.current) > mergedConfig.rotate.threshold) {
          handlers.onRotate?.({
            type: 'rotate',
            rotation,
            point: {
              x: (touch1.clientX + touch2.clientX) / 2,
              y: (touch1.clientY + touch2.clientY) / 2
            },
            target: e.target
          })
          
          initialRotation.current = rotation
        }
      }
    }
  }, [handlers, mergedConfig])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y
    const deltaTime = Date.now() - touchStart.current.time
    const distance = Math.hypot(deltaX, deltaY)
    const velocity = distance / deltaTime

    // Swipe gesture
    if (
      mergedConfig.swipe.enabled && 
      !isLongPress.current &&
      distance > mergedConfig.swipe.threshold &&
      velocity > mergedConfig.swipe.velocity
    ) {
      let direction: 'left' | 'right' | 'up' | 'down'
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left'
      } else {
        direction = deltaY > 0 ? 'down' : 'up'
      }

      handlers.onSwipe?.({
        type: 'swipe',
        direction,
        velocity,
        distance,
        point: { x: touch.clientX, y: touch.clientY },
        target: e.target
      })

      triggerHaptic(30)
      return
    }

    // Tap gesture
    if (
      mergedConfig.tap.enabled &&
      !isLongPress.current &&
      deltaTime < mergedConfig.tap.maxDelay &&
      distance < mergedConfig.tap.maxDistance
    ) {
      const now = Date.now()
      const timeSinceLastTap = now - lastTap.current
      
      if (timeSinceLastTap < 300) {
        // Double tap
        tapCount.current++
        
        if (tapCount.current === 2) {
          handlers.onDoubleTap?.({
            type: 'tap',
            point: { x: touch.clientX, y: touch.clientY },
            target: e.target
          })
          
          triggerHaptic([20, 30, 20])
          tapCount.current = 0
        }
      } else {
        // Single tap
        tapCount.current = 1
        
        setTimeout(() => {
          if (tapCount.current === 1) {
            handlers.onTap?.({
              type: 'tap',
              point: { x: touch.clientX, y: touch.clientY },
              target: e.target
            })
            
            triggerHaptic(10)
          }
          tapCount.current = 0
        }, 300)
      }
      
      lastTap.current = now
    }
  }, [handlers, mergedConfig, triggerHaptic])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

// Gesture-enabled Container Component
interface GestureContainerProps {
  children: React.ReactNode
  className?: string
  onGesture?: (event: GestureEvent) => void
  config?: GestureConfig
  style?: React.CSSProperties
}

export function GestureContainer({
  children,
  className,
  onGesture,
  config,
  style
}: GestureContainerProps) {
  const gestureHandlers = useAdvancedGestures({
    onSwipe: onGesture,
    onPinch: onGesture,
    onTap: onGesture,
    onDoubleTap: onGesture,
    onLongPress: onGesture,
    onRotate: onGesture
  }, config)

  return (
    <div
      className={cn('touch-none select-none', className)}
      style={style}
      onTouchStart={gestureHandlers.onTouchStart}
      onTouchMove={gestureHandlers.onTouchMove}
      onTouchEnd={gestureHandlers.onTouchEnd}
    >
      {children}
    </div>
  )
}

// Swipeable Card Component
interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  className?: string
  threshold?: number
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className,
  threshold = 100
}: SwipeableCardProps) {
  const [isExiting, setIsExiting] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0, 1, 1, 1, 0]
  )

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset } = info

    if (Math.abs(offset.x) > threshold) {
      setIsExiting(true)
      
      if (offset.x > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    } else if (Math.abs(offset.y) > threshold) {
      setIsExiting(true)
      
      if (offset.y > 0) {
        onSwipeDown?.()
      } else {
        onSwipeUp?.()
      }
    }
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, opacity }}
      animate={isExiting ? { x: 0, y: 0, opacity: 0, scale: 0.8 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn('cursor-grab active:cursor-grabbing', className)}
    >
      {children}
    </motion.div>
  )
}

// Pinch-to-zoom Component
interface PinchZoomProps {
  children: React.ReactNode
  minScale?: number
  maxScale?: number
  className?: string
}

export function PinchZoom({
  children,
  minScale = 0.5,
  maxScale = 3,
  className
}: PinchZoomProps) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const gestureHandlers = useAdvancedGestures({
    onPinch: (event) => {
      if (event.scale) {
        const newScale = Math.max(minScale, Math.min(maxScale, event.scale))
        setScale(newScale)
      }
    },
    onDoubleTap: () => {
      setScale(scale === 1 ? 2 : 1)
      setOffset({ x: 0, y: 0 })
    }
  })

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden relative', className)}
      onTouchStart={gestureHandlers.onTouchStart}
      onTouchMove={gestureHandlers.onTouchMove}
      onTouchEnd={gestureHandlers.onTouchEnd}
    >
      <motion.div
        animate={{
          scale,
          x: offset.x,
          y: offset.y
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Long Press Component
interface LongPressProps {
  children: React.ReactNode
  onLongPress: () => void
  duration?: number
  className?: string
}

export function LongPress({
  children,
  onLongPress,
  duration = 500,
  className
}: LongPressProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout>()
  const intervalRef = useRef<NodeJS.Timeout>()

  const startPress = () => {
    setIsPressed(true)
    setProgress(0)
    
    const startTime = Date.now()
    
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(elapsed / duration, 1)
      setProgress(newProgress)
    }, 16) // ~60fps

    timerRef.current = setTimeout(() => {
      onLongPress()
      endPress()
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }, duration)
  }

  const endPress = () => {
    setIsPressed(false)
    setProgress(0)
    
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  return (
    <div
      className={cn('relative select-none', className)}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchCancel={endPress}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
    >
      {children}
      
      {/* Progress indicator */}
      {isPressed && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-blue-500 opacity-20 rounded" />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-blue-500 opacity-50 transition-all duration-75"
            style={{ height: `${progress * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}

// Gesture Debug Panel (Development only)
export function GestureDebugPanel() {
  const [events, setEvents] = useState<GestureEvent[]>([])

  const addEvent = (event: GestureEvent) => {
    setEvents(prev => [event, ...prev].slice(0, 10))
  }

  const gestureHandlers = useAdvancedGestures({
    onSwipe: addEvent,
    onPinch: addEvent,
    onTap: addEvent,
    onDoubleTap: addEvent,
    onLongPress: addEvent,
    onRotate: addEvent
  })

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div
      className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50"
      onTouchStart={gestureHandlers.onTouchStart}
      onTouchMove={gestureHandlers.onTouchMove}
      onTouchEnd={gestureHandlers.onTouchEnd}
    >
      <h3 className="font-bold mb-2">Gesture Debug</h3>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {events.map((event, index) => (
          <div key={index} className="text-xs opacity-75">
            {event.type}
            {event.direction && ` (${event.direction})`}
            {event.scale && ` scale: ${event.scale.toFixed(2)}`}
            {event.velocity && ` vel: ${event.velocity.toFixed(2)}`}
          </div>
        ))}
      </div>
    </div>
  )
}

export default useAdvancedGestures