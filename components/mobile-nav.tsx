'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  Home, 
  Newspaper, 
  ChevronRight,
  Search,
  Video,
  Calculator
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchDialog } from './search'

const navigationItems = [
  {
    title: 'Início',
    href: '/',
    icon: Home,
  },
  {
    title: 'Notícias',
    href: '/noticias',
    icon: Newspaper,
  },
  {
    title: 'Vídeos',
    href: '/videos',
    icon: Video,
  },
  {
    title: 'Ferramentas',
    href: '/ferramentas',
    icon: Calculator,
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close sheet when pathname changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-[300px] sm:w-[350px] p-0"
        aria-describedby="mobile-navigation"
      >
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-left text-blue-600">
            Blog Autopropelidos
          </SheetTitle>
        </SheetHeader>
        
        <nav 
          id="mobile-navigation"
          className="flex flex-col h-full"
          role="navigation"
          aria-label="Menu principal móvel"
        >
          {/* Search */}
          <div className="px-4 py-3 border-b">
            <SearchDialog>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Pesquisar
              </Button>
            </SearchDialog>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      isActive(item.href) && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                    {isActive(item.href) && (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto border-t px-4 py-3">
            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <Link 
                href="/privacidade" 
                className="hover:text-foreground transition-colors"
                onClick={() => setOpen(false)}
              >
                Política de Privacidade
              </Link>
              <Link 
                href="/termos" 
                className="hover:text-foreground transition-colors"
                onClick={() => setOpen(false)}
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}