"use client"

import * as React from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

export interface AccessibleImageProps extends Omit<ImageProps, 'alt'> {
  alt: string
  decorative?: boolean
  caption?: string
  longDescription?: string
  loading?: "lazy" | "eager"
}

const AccessibleImage = React.forwardRef<
  HTMLImageElement,
  AccessibleImageProps
>(({ 
  className, 
  alt, 
  decorative = false, 
  caption, 
  longDescription,
  loading = "lazy",
  ...props 
}, ref) => {
  const imageId = React.useId()
  const captionId = `${imageId}-caption`
  const descriptionId = `${imageId}-description`
  
  // For decorative images, use empty alt and hide from screen readers
  const imageAlt = decorative ? "" : alt
  const ariaHidden = decorative ? true : undefined
  
  // Build aria-describedby
  const describedBy = []
  if (caption) describedBy.push(captionId)
  if (longDescription) describedBy.push(descriptionId)
  
  const imageElement = (
    <Image
      ref={ref}
      className={cn(
        "max-w-full h-auto",
        className
      )}
      alt={imageAlt}
      loading={loading}
      aria-hidden={ariaHidden}
      aria-describedby={describedBy.length > 0 ? describedBy.join(' ') : undefined}
      {...props}
    />
  )
  
  // If no caption or description, return just the image
  if (!caption && !longDescription) {
    return imageElement
  }
  
  // Wrap in figure with caption/description
  return (
    <figure className="space-y-2">
      {imageElement}
      {caption && (
        <figcaption 
          id={captionId}
          className="text-sm text-muted-foreground text-center"
        >
          {caption}
        </figcaption>
      )}
      {longDescription && (
        <div 
          id={descriptionId}
          className="sr-only"
        >
          {longDescription}
        </div>
      )}
    </figure>
  )
})

AccessibleImage.displayName = "AccessibleImage"

export { AccessibleImage }