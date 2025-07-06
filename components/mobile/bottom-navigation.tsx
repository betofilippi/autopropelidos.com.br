'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Newspaper, 
  Search, 
  Bookmark, 
  Settings, 
  Plus,
  Filter,
  Bell,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BottomNavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  badge?: number
  color?: string
}

interface BottomNavigationProps {
  items?: BottomNavItem[]
  showLabels?: boolean
  className?: string
}

const defaultItems: BottomNavItem[] = [
  {
    id: 'home',
    label: 'Início',
    icon: <Home className="w-5 h-5" />,
    href: '/',
    color: 'text-blue-600'
  },
  {
    id: 'news',
    label: 'Notícias',
    icon: <Newspaper className="w-5 h-5" />,
    href: '/noticias',
    color: 'text-green-600'
  },
  {
    id: 'search',
    label: 'Buscar',
    icon: <Search className="w-5 h-5" />,
    href: '/busca',
    color: 'text-purple-600'
  },
  {
    id: 'tools',
    label: 'Ferramentas',
    icon: <Settings className="w-5 h-5" />,
    href: '/ferramentas',
    color: 'text-orange-600'
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: <User className="w-5 h-5" />,
    href: '/perfil',
    color: 'text-pink-600'
  }
]

export function BottomNavigation({ 
  items = defaultItems, 
  showLabels = true, 
  className 
}: BottomNavigationProps) {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState(
    items.find(item => item.href === pathname)?.id || items[0].id
  )

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800",
        "backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95",
        "safe-area-inset-bottom",
        className
      )}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const isActive = item.href === pathname || activeItem === item.id
          
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center",
                "min-w-0 flex-1 px-2 py-2 rounded-lg transition-all duration-200",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "active:scale-95",
                isActive ? "bg-gray-50 dark:bg-gray-800" : ""
              )}
            >
              {/* Active indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-600 rounded-full"
                  />
                )}
              </AnimatePresence>

              {/* Icon with badge */}
              <div className="relative">
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.1 : 1,
                    color: isActive ? item.color : 'currentColor'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={cn(
                    "transition-colors",
                    isActive 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {item.icon}
                </motion.div>

                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>

              {/* Label */}
              {showLabels && (
                <motion.span
                  animate={{ 
                    opacity: isActive ? 1 : 0.7,
                    fontWeight: isActive ? 600 : 400
                  }}
                  className={cn(
                    "text-xs mt-1 transition-all duration-200",
                    isActive 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}

// Floating Action Button Component
interface FloatingActionButtonProps {
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function FloatingActionButton({ 
  icon = <Plus className="w-6 h-6" />,
  onClick,
  className,
  variant = 'primary',
  size = 'md'
}: FloatingActionButtonProps) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "fixed bottom-20 right-4 z-40",
        "rounded-full shadow-lg",
        "flex items-center justify-center",
        "transition-all duration-200",
        "backdrop-blur-sm",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon}
    </motion.button>
  )
}

// Quick Action Menu
interface QuickActionMenuProps {
  isOpen: boolean
  onClose: () => void
  actions: Array<{
    id: string
    label: string
    icon: React.ReactNode
    onClick: () => void
    color?: string
  }>
}

export function QuickActionMenu({ isOpen, onClose, actions }: QuickActionMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Menu */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl p-6 safe-area-inset-bottom"
          >
            {/* Handle */}
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />

            {/* Actions */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {actions.map((action) => (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    action.onClick()
                    onClose()
                  }}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={cn("mb-2", action.color || "text-gray-600 dark:text-gray-400")}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Close button */}
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Fechar
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BottomNavigation