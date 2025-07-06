import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/navigation/footer"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import { SkipLinks } from "@/components/ui/skip-links"
import { Suspense } from "react"
import Script from "next/script"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
})

export const metadata: Metadata = {
  metadataBase: new URL('https://autopropelidos.com.br'),
  title: {
    default: 'Portal Autopropelidos - Resolução 996 CONTRAN | Guia Completo',
    template: '%s | Portal Autopropelidos'
  },
  description: 'Portal definitivo sobre equipamentos autopropelidos e a Resolução 996 do CONTRAN. Notícias, vídeos, ferramentas e informações sobre patinetes elétricos, bicicletas elétricas e regulamentação.',
  keywords: [
    'autopropelidos',
    'CONTRAN 996',
    'patinete elétrico',
    'bicicleta elétrica',
    'regulamentação',
    'mobilidade urbana',
    'veículos elétricos',
    'legislação trânsito',
    'equipamentos de mobilidade',
    'transporte sustentável'
  ],
  authors: [{ name: 'Portal Autopropelidos', url: 'https://autopropelidos.com.br' }],
  creator: 'Portal Autopropelidos',
  publisher: 'Portal Autopropelidos',
  generator: 'Next.js',
  applicationName: 'Portal Autopropelidos',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light',
  themeColor: '#2563eb',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover'
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    alternateLocale: ['en_US'],
    siteName: 'Portal Autopropelidos',
    title: 'Portal Autopropelidos - Resolução 996 CONTRAN | Guia Completo',
    description: 'Portal definitivo sobre equipamentos autopropelidos e a Resolução 996 do CONTRAN. Notícias, vídeos, ferramentas e informações sobre patinetes elétricos, bicicletas elétricas e regulamentação.',
    url: 'https://autopropelidos.com.br',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Portal Autopropelidos - Resolução 996 CONTRAN',
        type: 'image/jpeg'
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Portal Autopropelidos - Logo',
        type: 'image/jpeg'
      }
    ],
    videos: [
      {
        url: '/intro-video.mp4',
        width: 1280,
        height: 720,
        type: 'video/mp4'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@autopropelidos',
    creator: '@autopropelidos',
    title: 'Portal Autopropelidos - Resolução 996 CONTRAN | Guia Completo',
    description: 'Portal definitivo sobre equipamentos autopropelidos e a Resolução 996 do CONTRAN. Notícias, vídeos, ferramentas e informações sobre patinetes elétricos, bicicletas elétricas e regulamentação.',
    images: ['/twitter-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#000000' }
    ]
  },
  manifest: '/manifest.json',
  category: 'technology',
  classification: 'Transportation, Legal Information',
  alternates: {
    canonical: 'https://autopropelidos.com.br',
    types: {
      'application/rss+xml': [
        { url: '/rss.xml', title: 'Portal Autopropelidos RSS Feed' }
      ]
    }
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    other: {
      'msvalidate.01': 'bing-site-verification-code'
    }
  }
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Portal Autopropelidos",
    alternateName: "Autopropelidos Brasil",
    url: "https://autopropelidos.com.br",
    description: "Portal definitivo sobre equipamentos autopropelidos e a Resolução 996 do CONTRAN",
    publisher: {
      "@type": "Organization",
      name: "Portal Autopropelidos",
      url: "https://autopropelidos.com.br",
      logo: {
        "@type": "ImageObject",
        url: "https://autopropelidos.com.br/logo.png",
        width: 200,
        height: 60
      }
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://autopropelidos.com.br/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    sameAs: [
      "https://www.youtube.com/@autopropelidos",
      "https://www.instagram.com/autopropelidos",
      "https://www.facebook.com/autopropelidos",
      "https://twitter.com/autopropelidos"
    ],
    mainEntity: {
      "@type": "Thing",
      name: "Resolução 996 CONTRAN",
      description: "Regulamentação sobre equipamentos de mobilidade urbana autopropelidos",
      url: "https://autopropelidos.com.br/resolucao-996"
    }
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.youtube.com" />
        <link rel="dns-prefetch" href="//img.youtube.com" />
        <link rel="dns-prefetch" href="//vercel.live" />
        
        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/hero-image.webp" as="image" type="image/webp" />
        <link rel="preload" href="/css/critical.css" as="style" />
        
        {/* Resource hints for better performance */}
        <link rel="modulepreload" href="/_next/static/chunks/main.js" />
        <link rel="modulepreload" href="/_next/static/chunks/webpack.js" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Autopropelidos" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      </head>
      <body className={`${inter.className} ${inter.variable}`}>
        {/* Skip Links for keyboard navigation */}
        <SkipLinks />
        
        <div className="min-h-screen flex flex-col">
          <header id="navigation">
            <NavbarWithSuspense />
          </header>
          
          <main id="main-content" className="flex-grow" tabIndex={-1} role="main">
            {children}
          </main>
          
          <div id="footer">
            <Footer />
          </div>
        </div>
        
        <Toaster />
        <Analytics />
        
        {/* Live region for dynamic announcements */}
        <div id="live-region" aria-live="polite" aria-atomic="true" className="sr-only"></div>
        
        
        {/* Schema.org Organization markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Portal Autopropelidos",
              url: "https://autopropelidos.com.br",
              logo: "https://autopropelidos.com.br/logo.png",
              description: "Portal de informações sobre equipamentos autopropelidos e regulamentação CONTRAN",
              foundingDate: "2024",
              areaServed: "BR",
              knowsLanguage: ["pt-BR"],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "contato@autopropelidos.com.br",
                areaServed: "BR",
                availableLanguage: "Portuguese"
              }
            })
          }}
        />
      </body>
    </html>
  )
}
