import type React from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ padding: '20px' }}>
          <h1>Portal Autopropelidos</h1>
          {children}
        </div>
      </body>
    </html>
  )
}