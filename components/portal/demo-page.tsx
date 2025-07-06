'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Code, 
  Play, 
  Search,
  TrendingUp,
  Zap,
  Heart,
  Eye
} from "lucide-react"

// Import all interactive components
import EnhancedBreakingNewsBar, { useEnhancedBreakingNews } from './enhanced-breaking-news-bar'
import { AdvancedNewsGrid } from './advanced-news-cards'
import TrendingSidebar from './trending-sidebar'
import InteractiveVideoPlayer, { useVideoData } from './interactive-video-player'
import AdvancedSearchFilter from './advanced-search-filter'
import MobileFirstPortal from './mobile-first-components'

export default function InteractivePortalDemo() {
  const [activeDemo, setActiveDemo] = useState('desktop')
  const [selectedComponent, setSelectedComponent] = useState('breaking-news')
  
  // Use hooks for data
  const breakingNews = useEnhancedBreakingNews()
  const { video } = useVideoData('demo-video')

  // Mock news data
  const mockNews = [
    {
      id: '1',
      title: 'CONTRAN aprova novas regras para patinetes elétricos em 2024',
      description: 'Novas regulamentações estabelecem limites de velocidade de 25 km/h e tornam obrigatório o uso de capacete em vias públicas.',
      url: '/noticias/contran-regras-patinetes-2024',
      source: 'CONTRAN',
      published_at: new Date().toISOString(),
      category: 'regulation',
      image_url: '/images/news-placeholder.jpg',
      author: 'Redação Autopropelidos',
      reading_time: 5,
      views: 12540,
      likes: 892,
      comments: 156,
      relevance_score: 95,
      tags: ['CONTRAN', 'patinetes', 'regulamentação', 'mobilidade urbana']
    },
    {
      id: '2',
      title: 'São Paulo expande rede de ciclofaixas para equipamentos autopropelidos',
      description: 'A cidade de São Paulo anuncia investimento de R$ 50 milhões para ampliar a infraestrutura de mobilidade urbana sustentável.',
      url: '/noticias/sao-paulo-ciclofaixas-expansao',
      source: 'Prefeitura SP',
      published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category: 'urban_mobility',
      image_url: '/images/news-placeholder.jpg',
      author: 'Ana Silva',
      reading_time: 3,
      views: 8920,
      likes: 445,
      comments: 89,
      relevance_score: 88,
      tags: ['São Paulo', 'ciclofaixas', 'mobilidade', 'infraestrutura']
    },
    {
      id: '3',
      title: 'Segurança no trânsito: Guia completo para usuários de bicicletas elétricas',
      description: 'Dicas essenciais de segurança, equipamentos obrigatórios e melhores práticas para circular com segurança no trânsito urbano.',
      url: '/videos/seguranca-bicicletas-eletricas',
      source: 'Canal Autopropelidos',
      published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      category: 'safety',
      image_url: '/images/video-placeholder.jpg',
      author: 'João Santos',
      reading_time: 8,
      views: 15230,
      likes: 1205,
      comments: 234,
      relevance_score: 92,
      tags: ['segurança', 'bicicletas elétricas', 'trânsito', 'dicas']
    }
  ]

  const componentDemos = {
    'breaking-news': {
      title: 'Enhanced Breaking News Bar',
      description: 'Barra de notícias com animações, pause on hover, expansão e notificações sonoras',
      features: ['Animações suaves', 'Pause on hover', 'Click para expandir', 'Badges de urgência', 'Notificações sonoras'],
      component: <EnhancedBreakingNewsBar news={breakingNews} enableSound={true} autoRotate={true} />
    },
    'news-cards': {
      title: 'Advanced News Cards',
      description: 'Cards de notícias com hover effects, botões de compartilhamento e métricas',
      features: ['Hover effects avançados', 'Share buttons integrados', 'Reading time', 'Save functionality', 'Métricas de engagement'],
      component: <AdvancedNewsGrid news={mockNews} variant="default" showActions={true} showMetrics={true} />
    },
    'trending-sidebar': {
      title: 'Trending Sidebar Dinâmica',
      description: 'Sidebar com trending topics, artigos populares e integração social',
      features: ['Real-time trending topics', 'Most read articles', 'Social media integration', 'Newsletter signup', 'Weather widget'],
      component: <TrendingSidebar />
    },
    'video-player': {
      title: 'Interactive Video Player',
      description: 'Player de vídeo com controles avançados, playlist e compartilhamento',
      features: ['YouTube embed otimizado', 'Playlist automática', 'Fullscreen mode', 'Speed controls', 'Share timestamps'],
      component: video ? (
        <InteractiveVideoPlayer 
          video={video} 
          autoplay={false} 
          showPlaylist={true} 
          showChapters={true}
          enableSharing={true}
        />
      ) : <div className="p-8 text-center">Carregando player...</div>
    },
    'search-filter': {
      title: 'Advanced Search & Filter',
      description: 'Sistema de busca com filtros avançados, sugestões e pesquisas salvas',
      features: ['Real-time search', 'Advanced filters', 'Sort options', 'Saved searches', 'Search suggestions'],
      component: <AdvancedSearchFilter />
    },
    'mobile-portal': {
      title: 'Mobile-First Portal',
      description: 'Interface mobile com swipe gestures, pull-to-refresh e infinite scroll',
      features: ['Swipe gestures', 'Pull-to-refresh', 'Bottom sheet filters', 'Sticky header', 'Infinite scroll'],
      component: <MobileFirstPortal />
    }
  }

  const currentDemo = componentDemos[selectedComponent as keyof typeof componentDemos]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                Portal Interativo - Demo
              </h1>
              <p className="text-gray-600 mt-2">
                Demonstração dos componentes interativos avançados para portal de notícias
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Heart className="h-3 w-3" />
                6 Componentes
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Eye className="h-3 w-3" />
                Máxima Interatividade
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Viewport */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Component Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Componentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(componentDemos).map(([key, demo]) => (
                  <Button
                    key={key}
                    variant={selectedComponent === key ? "default" : "ghost"}
                    onClick={() => setSelectedComponent(key)}
                    className="w-full justify-start text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium text-sm">{demo.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{demo.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Demo Controls */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Viewport
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeDemo} onValueChange={setActiveDemo}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="mobile" className="text-xs">
                      <Smartphone className="h-3 w-3 mr-1" />
                      Mobile
                    </TabsTrigger>
                    <TabsTrigger value="tablet" className="text-xs">
                      <Tablet className="h-3 w-3 mr-1" />
                      Tablet
                    </TabsTrigger>
                    <TabsTrigger value="desktop" className="text-xs">
                      <Monitor className="h-3 w-3 mr-1" />
                      Desktop
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Features List */}
            {currentDemo && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recursos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentDemo.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Demo Viewport */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentDemo?.title}</span>
                  <Badge variant="outline" className="gap-1">
                    <Play className="h-3 w-3" />
                    Demo Ativo
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div 
                  className={`
                    ${activeDemo === 'mobile' ? 'max-w-sm mx-auto' : ''}
                    ${activeDemo === 'tablet' ? 'max-w-2xl mx-auto' : ''}
                    ${activeDemo === 'desktop' ? 'w-full' : ''}
                  `}
                >
                  <div className="border-l border-r border-b bg-white">
                    {currentDemo?.component}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Preview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Exemplo de Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    <code>{getComponentCode(selectedComponent)}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              🤖 Componentes Interativos Avançados para Portal de Notícias
            </p>
            <p className="text-xs mt-2">
              Desenvolvido com React, TypeScript, Tailwind CSS e Radix UI
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getComponentCode(component: string): string {
  const codeExamples = {
    'breaking-news': `import { EnhancedBreakingNewsBar, useEnhancedBreakingNews } from './components/portal'

function App() {
  const breakingNews = useEnhancedBreakingNews()
  
  return (
    <EnhancedBreakingNewsBar 
      news={breakingNews}
      enableSound={true}
      autoRotate={true}
      rotationSpeed={5000}
      enableNotifications={true}
    />
  )
}`,
    'news-cards': `import { AdvancedNewsGrid } from './components/portal'

function NewsPage() {
  return (
    <AdvancedNewsGrid
      news={newsData}
      variant="default"
      showActions={true}
      showMetrics={true}
      showPreview={true}
    />
  )
}`,
    'trending-sidebar': `import { TrendingSidebar } from './components/portal'

function Layout() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <main className="col-span-2">
        {/* Main content */}
      </main>
      <aside>
        <TrendingSidebar />
      </aside>
    </div>
  )
}`,
    'video-player': `import { InteractiveVideoPlayer } from './components/portal'

function VideoPage() {
  return (
    <InteractiveVideoPlayer
      video={videoData}
      autoplay={false}
      showPlaylist={true}
      showChapters={true}
      enableSharing={true}
    />
  )
}`,
    'search-filter': `import { AdvancedSearchFilter } from './components/portal'

function SearchPage() {
  return (
    <AdvancedSearchFilter />
  )
}`,
    'mobile-portal': `import { MobileFirstPortal } from './components/portal'

function MobileApp() {
  return (
    <MobileFirstPortal />
  )
}`
  }

  return codeExamples[component as keyof typeof codeExamples] || '// Exemplo de código não disponível'
}