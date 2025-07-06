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
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  unoptimized?: boolean
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "https://placehold.co/400x300/e5e7eb/9ca3af?text=Image",
  showSkeleton = true,
  aspectRatio,
  className,
  onLoad,
  onError,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  unoptimized = false,
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

  // Generate a simple blur data URL if not provided
  const generateBlurDataURL = React.useMemo(() => {
    if (blurDataURL) return blurDataURL
    
    // Simple 1x1 transparent base64 image
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo='
  }, [blurDataURL])

  const handleLoad = React.useCallback(() => {
    setLoading(false)
    onLoad?.()
  }, [onLoad])

  const handleError = React.useCallback(() => {
    setError(true)
    setLoading(false)
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
      setError(false) // Reset error state when using fallback
    }
    onError?.()
  }, [fallbackSrc, imageSrc, onError])

  React.useEffect(() => {
    if (src !== imageSrc) {
      setImageSrc(src)
      setError(false)
      setLoading(true)
    }
  }, [src, imageSrc])

  // Use native img for external URLs that might not work with Next.js Image
  const shouldUseNativeImg = React.useMemo(() => {
    if (!imageSrc) return false
    if (unoptimized) return true
    
    // Check if it's an external URL that might not work with Next.js Image
    try {
      const url = new URL(imageSrc, 'https://example.com')
      return url.hostname !== 'autopropelidos.com.br' && 
             url.hostname !== 'localhost' && 
             !url.pathname.startsWith('/_next/')
    } catch {
      return false
    }
  }, [imageSrc, unoptimized])

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
      
      {shouldUseNativeImg ? (
        <img
          {...(props as any)}
          src={imageSrc}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            loading ? "opacity-50" : "opacity-100",
            props.fill && "absolute inset-0 w-full h-full object-cover"
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{
            colorScheme: 'only light',
            contentVisibility: 'auto',
            containIntrinsicSize: '300px 200px'
          }}
        />
      ) : (
        <Image
          {...props}
          src={imageSrc || ''}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            loading ? "opacity-50" : "opacity-100",
            props.fill && "object-cover"
          )}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={generateBlurDataURL}
          unoptimized={unoptimized}
          sizes={props.sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        />
      )}
      
      {/* Blur overlay while loading */}
      {loading && (
        <div className="absolute inset-0 backdrop-blur-sm bg-muted/20" />
      )}
    </div>
  )
}

// Responsive image component with srcSet optimized for different screen sizes
export function ResponsiveImage({
  src,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  quality = 85,
  priority = false,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      sizes={sizes}
      quality={quality}
      priority={priority}
      {...props}
    />
  )
}

// Gallery image with zoom on hover and lazy loading
export function GalleryImage({
  src,
  alt,
  className,
  priority = false,
  quality = 80,
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
        priority={priority}
        quality={quality}
        {...props}
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </div>
  )
}

// Hero image component optimized for above-the-fold content
export function HeroImage({
  src,
  alt,
  priority = true,
  quality = 90,
  sizes = "100vw",
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={priority}
      quality={quality}
      sizes={sizes}
      placeholder="blur"
      {...props}
    />
  )
}

// Thumbnail image component for performance in lists
export function ThumbnailImage({
  src,
  alt,
  quality = 70,
  sizes = "(max-width: 640px) 150px, 200px",
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      quality={quality}
      sizes={sizes}
      aspectRatio="square"
      {...props}
    />
  )
}

// Video thumbnail with play button overlay
export function VideoThumbnail({
  src,
  alt,
  onPlayClick,
  quality = 75,
  ...props
}: OptimizedImageProps & { onPlayClick?: () => void }) {
  return (
    <div className="relative group cursor-pointer" onClick={onPlayClick}>
      <OptimizedImage
        src={src}
        alt={alt}
        quality={quality}
        aspectRatio="video"
        {...props}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg 
            className="w-6 h-6 text-black ml-1" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            aria-label="Reproduzir vídeo"
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </div>
  )
}