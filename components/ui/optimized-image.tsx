'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import Image, { ImageProps } from "next/image"

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string
  showSkeleton?: boolean
  aspectRatio?: "square" | "video" | "portrait" | number
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  showSkeleton = true,
  aspectRatio,
  className,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [imageSrc, setImageSrc] = React.useState(src)

  const aspectRatioClass = React.useMemo(() => {
    if (typeof aspectRatio === "number") {
      return { paddingBottom: `${(1 / aspectRatio) * 100}%` }
    }
    
    switch (aspectRatio) {
      case "square":
        return "aspect-square"
      case "video":
        return "aspect-video"
      case "portrait":
        return "aspect-[3/4]"
      default:
        return ""
    }
  }, [aspectRatio])

  const handleLoad = () => {
    console.log('OptimizedImage: handleLoad called for', imageSrc)
    setLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    console.log('OptimizedImage: handleError called for', imageSrc)
    setError(true)
    setLoading(false)
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      console.log('OptimizedImage: switching to fallback', fallbackSrc)
      setImageSrc(fallbackSrc)
      setError(false) // Reset error state when using fallback
    }
    onError?.()
  }

  React.useEffect(() => {
    setImageSrc(src)
    setError(false)
    setLoading(true)
  }, [src])

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-muted",
        typeof aspectRatio === "string" && aspectRatioClass,
        className
      )}
      style={typeof aspectRatio === "number" ? aspectRatioClass as React.CSSProperties : undefined}
    >
      {showSkeleton && loading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      
      <Image
        {...props}
        src={imageSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          loading ? "opacity-50" : "opacity-100", // Changed from opacity-0 to opacity-50 for visibility
          props.fill && "object-cover"
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        placeholder="empty"
        unoptimized // Add this to bypass Next.js optimization issues
      />
      
      {/* Blur overlay while loading */}
      {loading && (
        <div className="absolute inset-0 backdrop-blur-sm" />
      )}
    </div>
  )
}

// Responsive image component with srcSet
export function ResponsiveImage({
  src,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      sizes={sizes}
      {...props}
    />
  )
}

// Gallery image with zoom on hover
export function GalleryImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg">
      <OptimizedImage
        src={src}
        alt={alt}
        className={cn(
          "transition-transform duration-300 group-hover:scale-110",
          className
        )}
        {...props}
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </div>
  )
}