"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkipLink {
  href: string
  label: string
}

export interface SkipLinksProps {
  links?: SkipLink[]
  className?: string
}

const defaultSkipLinks: SkipLink[] = [
  { href: "#main-content", label: "Pular para o conteúdo principal" },
  { href: "#navigation", label: "Pular para a navegação" },
  { href: "#footer", label: "Pular para o rodapé" }
]

const SkipLinks: React.FC<SkipLinksProps> = ({ 
  links = defaultSkipLinks, 
  className 
}) => {
  return (
    <nav 
      className={cn("sr-only focus-within:not-sr-only", className)}
      aria-label="Links de navegação rápida"
    >
      <ul className="flex flex-col fixed top-0 left-0 z-[9999] bg-primary text-primary-foreground p-2 space-y-1">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="inline-block px-3 py-2 bg-primary text-primary-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/90 transition-colors"
              onFocus={(e) => {
                // Ensure the skip link is visible when focused
                e.currentTarget.scrollIntoView({ block: "nearest" })
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

SkipLinks.displayName = "SkipLinks"

export { SkipLinks }