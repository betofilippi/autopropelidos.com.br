'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

interface TouchCarouselProps {
  children: React.ReactNode[]
  className?: string
  autoPlay?: boolean
  interval?: number
  indicators?: boolean
}

export function TouchCarousel({
  children,
  className,
  autoPlay = false,
  interval = 5000,
  indicators = true,
}: TouchCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [touchStart, setTouchStart] = React.useState(0)
  const [touchEnd, setTouchEnd] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const carouselRef = React.useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? children.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === children.length - 1 ? 0 : prev + 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isSwipe = Math.abs(distance) > minSwipeDistance

    if (isSwipe) {
      if (distance > 0) {
        handleNext()
      } else {
        handlePrevious()
      }
    }
    
    setIsDragging(false)
  }

  // Mouse support for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX)
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTouchEnd(e.clientX)
    }
  }

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isSwipe = Math.abs(distance) > minSwipeDistance

    if (isSwipe) {
      if (distance > 0) {
        handleNext()
      } else {
        handlePrevious()
      }
    }
    
    setIsDragging(false)
  }

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      handleNext()
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, currentIndex])

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      ref={carouselRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
            role="tabpanel"
            aria-hidden={currentIndex !== index}
            aria-label={`Slide ${index + 1} of ${children.length}`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2",
          "bg-background/80 backdrop-blur-sm",
          "hover:bg-background/90",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "opacity-0 group-hover:opacity-100 transition-opacity"
        )}
        onClick={handlePrevious}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2",
          "bg-background/80 backdrop-blur-sm",
          "hover:bg-background/90",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "opacity-0 group-hover:opacity-100 transition-opacity"
        )}
        onClick={handleNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Indicators */}
      {indicators && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
          role="tablist"
          aria-label="Slide indicators"
        >
          {React.Children.map(children, (_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                currentIndex === index
                  ? "w-8 bg-primary"
                  : "bg-primary/30 hover:bg-primary/50"
              )}
              onClick={() => setCurrentIndex(index)}
              role="tab"
              aria-selected={currentIndex === index}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}