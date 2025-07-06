"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface LiveRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  politeness?: "polite" | "assertive" | "off"
  atomic?: boolean
}

const LiveRegion = React.forwardRef<HTMLDivElement, LiveRegionProps>(
  ({ className, politeness = "polite", atomic = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("sr-only", className)}
        role="status"
        aria-live={politeness}
        aria-atomic={atomic}
        {...props}
      >
        {children}
      </div>
    )
  }
)
LiveRegion.displayName = "LiveRegion"

// Hook for managing live announcements
export function useLiveAnnouncer() {
  const [announcement, setAnnouncement] = React.useState("")
  
  const announce = React.useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    // Clear previous announcement
    setAnnouncement("")
    
    // Set new announcement after a brief delay to ensure screen readers pick it up
    setTimeout(() => {
      setAnnouncement(message)
    }, 100)
    
    // Clear announcement after it's been announced
    setTimeout(() => {
      setAnnouncement("")
    }, 1000)
  }, [])
  
  const LiveAnnouncementComponent = React.useMemo(() => (
    <LiveRegion politeness="polite">
      {announcement}
    </LiveRegion>
  ), [announcement])
  
  return {
    announce,
    LiveAnnouncementComponent
  }
}

export { LiveRegion }