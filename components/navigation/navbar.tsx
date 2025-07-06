'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const navigationItems = [
  {
    title: "Início",
    href: "/",
  },
  {
    title: "Resolução 996",
    href: "/resolucao-996",
  },
  {
    title: "Notícias",
    href: "/noticias",
  },
  {
    title: "Vídeos",
    href: "/videos",
  },
  {
    title: "Ferramentas",
    href: "/ferramentas",
    children: [
      {
        title: "Verificador de Conformidade",
        href: "/ferramentas/verificador-conformidade",
        description: "Verifique se seu equipamento está conforme a Resolução 996"
      },
      {
        title: "Calculadora de Custos",
        href: "/ferramentas/calculadora-custos",
        description: "Calcule custos e compare com outros transportes"
      },
      {
        title: "Buscador de Regulamentações",
        href: "/ferramentas/buscador-regulamentacoes",
        description: "Encontre regulamentações da sua cidade"
      },
      {
        title: "Guia de Documentação",
        href: "/ferramentas/guia-documentacao",
        description: "Passo a passo para regularizar seu equipamento"
      },
    ]
  },
  {
    title: "Sobre",
    href: "/sobre",
  },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  // Focus management for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      // Focus first menu item when opened
      const firstMenuItem = navRef.current?.querySelector('a[href], button')
      if (firstMenuItem) {
        ;(firstMenuItem as HTMLElement).focus()
      }
    }
  }, [mobileMenuOpen])

  const toggleSubmenu = (title: string) => {
    setExpandedSubmenu(expandedSubmenu === title ? null : title)
  }

  return (
    <nav 
      ref={navRef}
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
              aria-label="AutoPropelidos - Ir para página inicial"
            >
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                AutoPropelidos
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                Portal de Informação
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger 
                          aria-haspopup="true"
                          aria-expanded="false"
                          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul 
                            className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2"
                            role="menu"
                            aria-label={`Submenu ${item.title}`}
                          >
                            {item.children.map((child) => (
                              <li key={child.title} role="none">
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={child.href}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:ring-2 focus:ring-blue-500"
                                    role="menuitem"
                                    aria-describedby={`${child.title.replace(/\s+/g, '')}-desc`}
                                  >
                                    <div className="text-sm font-medium leading-none">{child.title}</div>
                                    <p 
                                      id={`${child.title.replace(/\s+/g, '')}-desc`}
                                      className="line-clamp-2 text-sm leading-snug text-muted-foreground"
                                    >
                                      {child.description}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink 
                          className={navigationMenuTriggerStyle()}
                          aria-current={item.href === "/" ? "page" : undefined}
                        >
                          {item.title}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link href="/ferramentas/verificador-conformidade">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Verificar conformidade do seu equipamento"
              >
                Verificar Conformidade
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              </span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        id="mobile-menu"
        className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:hidden`}
        role="menu"
        aria-label="Menu de navegação móvel"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <div className="space-y-1">
                  <button 
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-50 flex items-center justify-between"
                    onClick={() => toggleSubmenu(item.title)}
                    aria-expanded={expandedSubmenu === item.title}
                    aria-controls={`submenu-${item.title.replace(/\s+/g, '')}`}
                    aria-label={`${item.title} - ${expandedSubmenu === item.title ? 'Fechar' : 'Abrir'} submenu`}
                    role="menuitem"
                  >
                    {item.title}
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${expandedSubmenu === item.title ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  <div 
                    id={`submenu-${item.title.replace(/\s+/g, '')}`}
                    className={`pl-4 space-y-1 ${expandedSubmenu === item.title ? 'block' : 'hidden'}`}
                    role="menu"
                    aria-label={`Submenu ${item.title}`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href}
                        className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                        role="menuitem"
                        aria-describedby={`${child.title.replace(/\s+/g, '')}-mobile-desc`}
                      >
                        <div className="font-medium">{child.title}</div>
                        <div 
                          id={`${child.title.replace(/\s+/g, '')}-mobile-desc`}
                          className="text-xs text-gray-500 mt-1"
                        >
                          {child.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                  aria-current={item.href === "/" ? "page" : undefined}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
          <div className="mt-4 px-3">
            <Link href="/ferramentas/verificador-conformidade" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Verificar conformidade do seu equipamento"
              >
                Verificar Conformidade
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}