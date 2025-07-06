'use client'

import { useEffect, useState } from 'react'

interface ClientBodyProps {
  children: React.ReactNode
  style: React.CSSProperties
}

export default function ClientBody({ children, style }: ClientBodyProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Durante SSR e primeira renderização, usa div simples
    return (
      <div style={style}>
        {children}
      </div>
    )
  }

  // Após montagem no cliente, renderiza normalmente
  return children
}