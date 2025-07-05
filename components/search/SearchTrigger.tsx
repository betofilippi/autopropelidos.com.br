"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchModal } from "./SearchModal"
import { cn } from "@/lib/utils"

interface SearchTriggerProps {
  className?: string
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
}

export function SearchTrigger({ 
  className, 
  variant = "ghost", 
  size = "default" 
}: SearchTriggerProps) {
  const [open, setOpen] = useState(false)
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    // Check if user is on Mac
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)

    // Keyboard shortcut handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={cn(
          "relative",
          size === "default" && "w-full justify-start text-muted-foreground sm:w-64",
          className
        )}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline-flex">Buscar...</span>
        <span className="inline-flex sm:hidden">Buscar</span>
        <kbd className="pointer-events-none absolute right-2 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
        </kbd>
      </Button>
      <SearchModal open={open} onOpenChange={setOpen} />
    </>
  )
}