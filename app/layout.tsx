import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/navigation/footer"
import { ThemeProvider } from "@/components/providers"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Portal Autopropelidos - Resolução 996 CONTRAN | Guia Completo',
  description: 'Portal definitivo sobre equipamentos autopropelidos e a Resolução 996 do CONTRAN. Notícias, vídeos, ferramentas e informações sobre patinetes elétricos, bicicletas elétricas e regulamentação.',
  keywords: 'autopropelidos, CONTRAN 996, patinete elétrico, bicicleta elétrica, regulamentação, mobilidade urbana',
  authors: [{ name: 'Portal Autopropelidos' }],
  generator: 'Next.js',
  openGraph: {
    title: 'Portal Autopropelidos - Resolução 996 CONTRAN',
    description: 'Tudo sobre equipamentos autopropelidos e a Resolução 996 do CONTRAN',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Portal Autopropelidos',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal Autopropelidos - Resolução 996 CONTRAN',
    description: 'Tudo sobre equipamentos autopropelidos e a Resolução 996 do CONTRAN',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

function NavbarWithSuspense() {
  return (
    <Suspense fallback={<div className="h-16 bg-background border-b" />}>
      <Navbar />
    </Suspense>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <NavbarWithSuspense />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
