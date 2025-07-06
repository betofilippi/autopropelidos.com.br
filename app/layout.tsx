import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Portal Autopropelidos - Resolução 996 CONTRAN',
  description: 'Portal sobre equipamentos autopropelidos e Resolução 996 do CONTRAN',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Inter, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
            .min-h-screen { min-height: 100vh; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .flex-1 { flex: 1; }
            .text-center { text-align: center; }
            .text-4xl { font-size: 2.25rem; }
            .text-3xl { font-size: 1.875rem; }
            .text-xl { font-size: 1.25rem; }
            .text-lg { font-size: 1.125rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-8 { margin-bottom: 2rem; }
            .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
            .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
            .p-4 { padding: 1rem; }
            .p-6 { padding: 1.5rem; }
            .bg-white { background-color: white; }
            .bg-gray-50 { background-color: #f9fafb; }
            .bg-blue-600 { background-color: #2563eb; }
            .text-white { color: white; }
            .text-gray-600 { color: #6b7280; }
            .text-blue-600 { color: #2563eb; }
            .border-b { border-bottom: 1px solid #e5e7eb; }
            .border-t { border-top: 1px solid #e5e7eb; }
            .border { border: 1px solid #e5e7eb; }
            .rounded { border-radius: 0.5rem; }
            .shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .grid { display: grid; }
            .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
            .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
            .gap-6 { gap: 1.5rem; }
            .gap-4 { gap: 1rem; }
            .card { background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; font-weight: 500; text-decoration: none; cursor: pointer; transition: all 0.2s; }
            .btn-primary { background-color: #2563eb; color: white; }
            .btn-primary:hover { background-color: #1d4ed8; }
            .btn-outline { background-color: transparent; border: 1px solid #e5e7eb; color: #111827; }
            .btn-outline:hover { background-color: #f9fafb; }
            .w-full { width: 100%; }
            .justify-center { justify-content: center; }
            .justify-between { justify-content: space-between; }
            .items-center { align-items: center; }
            @media (max-width: 768px) {
              .grid-cols-3 { grid-template-columns: 1fr; }
              .grid-cols-4 { grid-template-columns: 1fr; }
              .flex-col { flex-direction: column; }
            }
          `
        }} />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b p-4">
            <div className="container">
              <h1 className="text-4xl font-bold mb-2">Portal Autopropelidos</h1>
              <p className="text-gray-600">Tudo sobre a Resolução 996 do CONTRAN</p>
            </div>
          </header>
          
          <main className="flex-1 bg-gray-50">
            {children}
          </main>
          
          <footer className="bg-white border-t p-4 text-center">
            <div className="container">
              <p className="text-gray-600">&copy; 2025 Portal Autopropelidos - Todos os direitos reservados</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
