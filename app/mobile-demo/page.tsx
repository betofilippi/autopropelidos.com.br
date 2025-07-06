'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Smartphone, 
  Zap, 
  Wifi, 
  Battery, 
  Navigation,
  TouchIcon,
  Layers,
  Gauge,
  Bell,
  Download
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Import mobile components
import {
  useMobileAdvanced,
  useAdvancedGestures,
  GestureContainer,
  SwipeableCard,
  PinchZoom,
  LongPress,
  TouchCarousel,
  LazyImage,
  BottomNavigation,
  FloatingActionButton,
  PullToRefresh,
  VirtualScroll,
  usePWA,
  GestureDebugPanel
} from '@/components/mobile'

const demoNews = [
  {
    id: '1',
    title: 'Nova regulamentação para patinetes elétricos',
    description: 'CONTRAN aprova novas regras para uso de patinetes em vias públicas',
    image: '/images/news-placeholder.jpg',
    source: 'Portal G1',
    category: 'regulation',
    published_at: '2024-01-15T10:00:00Z',
    url: '#',
    relevance_score: 95
  },
  {
    id: '2',
    title: 'Segurança em primeiro lugar: equipamentos obrigatórios',
    description: 'Conheça os equipamentos de segurança necessários para conduzir veículos autopropelidos',
    image: '/images/news-placeholder.jpg',
    source: 'Mobility News',
    category: 'safety',
    published_at: '2024-01-14T15:30:00Z',
    url: '#',
    relevance_score: 88
  },
  {
    id: '3',
    title: 'Tecnologia avança em bicicletas elétricas',
    description: 'Novos modelos chegam ao mercado com autonomia aumentada e recursos inteligentes',
    image: '/images/news-placeholder.jpg',
    source: 'Tech Mobility',
    category: 'technology',
    published_at: '2024-01-13T09:15:00Z',
    url: '#',
    relevance_score: 82
  }
]

const carouselItems = [
  {
    id: '1',
    title: 'Resolução 996 CONTRAN',
    description: 'Tudo sobre a regulamentação',
    image: '/images/placeholder-news.jpg'
  },
  {
    id: '2',
    title: 'Ferramentas Úteis',
    description: 'Calculadoras e verificadores',
    image: '/images/placeholder-news.jpg'
  },
  {
    id: '3',
    title: 'Últimas Notícias',
    description: 'Fique sempre atualizado',
    image: '/images/placeholder-news.jpg'
  }
]

export default function MobileDemoPage() {
  const {
    deviceInfo,
    networkInfo,
    batteryInfo,
    pwaInfo,
    isOnline,
    isLowBattery,
    shouldOptimizeForPerformance
  } = useMobileAdvanced()

  const {
    isInstalled,
    isInstallable,
    canInstall,
    install,
    updateAvailable,
    notificationPermission,
    subscribeToNotifications
  } = usePWA()

  const [gestureEvents, setGestureEvents] = useState<any[]>([])
  const [refreshCount, setRefreshCount] = useState(0)

  const addGestureEvent = (event: any) => {
    setGestureEvents(prev => [event, ...prev].slice(0, 5))
  }

  const gestureHandlers = useAdvancedGestures({
    onSwipe: addGestureEvent,
    onPinch: addGestureEvent,
    onTap: addGestureEvent,
    onDoubleTap: addGestureEvent,
    onLongPress: addGestureEvent,
    onRotate: addGestureEvent
  })

  const handleRefresh = async () => {
    setRefreshCount(prev => prev + 1)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const virtualScrollItems = Array.from({ length: 100 }, (_, i) => ({
    id: `item-${i}`,
    height: 80,
    data: {
      title: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`
    }
  }))

  const renderVirtualItem = (item: any) => (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <h4 className="font-medium">{item.data.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{item.data.description}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 Mobile UX Portal Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Demonstração completa das funcionalidades mobile otimizadas
        </p>
      </div>

      {/* Device Info Panel */}
      <div className="p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              Informações do Dispositivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Badge variant={deviceInfo.isMobile ? "default" : "secondary"}>
                  {deviceInfo.isMobile ? "Mobile" : deviceInfo.isTablet ? "Tablet" : "Desktop"}
                </Badge>
                <p className="mt-1">Tipo: {deviceInfo.screenSize}</p>
                <p>Touch: {deviceInfo.hasTouch ? "✅" : "❌"}</p>
                <p>OS: {deviceInfo.isIOS ? "iOS" : deviceInfo.isAndroid ? "Android" : "Outro"}</p>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <Wifi className="w-4 h-4 mr-1" />
                  <span className={isOnline ? "text-green-600" : "text-red-600"}>
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <p>Rede: {networkInfo.effectiveType}</p>
                <p>Velocidade: {networkInfo.downlink}Mbps</p>
                <div className="flex items-center mt-1">
                  <Battery className="w-4 h-4 mr-1" />
                  <span className={isLowBattery ? "text-red-600" : "text-green-600"}>
                    {Math.round(batteryInfo.level * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PWA Features */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              PWA Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Instalado:</span>
                <Badge variant={isInstalled ? "default" : "secondary"}>
                  {isInstalled ? "✅ Sim" : "❌ Não"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Pode instalar:</span>
                <Badge variant={canInstall ? "default" : "secondary"}>
                  {canInstall ? "✅ Sim" : "❌ Não"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Atualização:</span>
                <Badge variant={updateAvailable ? "destructive" : "secondary"}>
                  {updateAvailable ? "⚠️ Disponível" : "✅ Atualizado"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Notificações:</span>
                <Badge variant={notificationPermission === 'granted' ? "default" : "secondary"}>
                  {notificationPermission}
                </Badge>
              </div>
              
              <div className="flex gap-2 pt-2">
                {canInstall && (
                  <Button onClick={install} size="sm">
                    Instalar App
                  </Button>
                )}
                
                {notificationPermission !== 'granted' && (
                  <Button onClick={subscribeToNotifications} size="sm" variant="outline">
                    <Bell className="w-4 h-4 mr-1" />
                    Ativar Notificações
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Tabs */}
        <Tabs defaultValue="gestures" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gestures">Gestos</TabsTrigger>
            <TabsTrigger value="components">Componentes</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="navigation">Navegação</TabsTrigger>
          </TabsList>

          {/* Gestures Tab */}
          <TabsContent value="gestures" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TouchIcon className="w-5 h-5 mr-2" />
                  Sistema de Gestos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GestureContainer
                  className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg p-8 mb-4 min-h-32"
                  onGesture={addGestureEvent}
                >
                  <div className="text-center">
                    <p className="text-lg font-medium mb-2">Área de Teste de Gestos</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Toque, deslize, aperte ou segure para testar
                    </p>
                  </div>
                </GestureContainer>

                {/* Gesture Events Log */}
                <div className="space-y-2">
                  <h4 className="font-medium">Últimos eventos:</h4>
                  {gestureEvents.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhum gesto detectado ainda</p>
                  ) : (
                    gestureEvents.map((event, index) => (
                      <div key={index} className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        <strong>{event.type}</strong>
                        {event.direction && ` - ${event.direction}`}
                        {event.scale && ` - escala: ${event.scale.toFixed(2)}`}
                        {event.velocity && ` - velocidade: ${event.velocity.toFixed(2)}`}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Swipeable Cards Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Cards Deslizáveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoNews.slice(0, 2).map((item) => (
                    <SwipeableCard
                      key={item.id}
                      onSwipeLeft={() => console.log('Dispensado:', item.title)}
                      onSwipeRight={() => console.log('Curtido:', item.title)}
                      className="border rounded-lg p-4"
                    >
                      <h4 className="font-medium mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Deslize → para curtir ou ← para dispensar
                      </p>
                    </SwipeableCard>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Long Press Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Pressão Longa</CardTitle>
              </CardHeader>
              <CardContent>
                <LongPress
                  onLongPress={() => alert('Pressão longa detectada!')}
                  className="bg-blue-100 dark:bg-blue-900 p-8 rounded-lg text-center"
                >
                  <p>Mantenha pressionado por 2 segundos</p>
                </LongPress>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Touch Carousel</CardTitle>
              </CardHeader>
              <CardContent>
                <TouchCarousel
                  items={carouselItems}
                  autoPlay={true}
                  showDots={true}
                  showArrows={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pull to Refresh</CardTitle>
              </CardHeader>
              <CardContent>
                <PullToRefresh onRefresh={handleRefresh}>
                  <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
                    <p>Puxe para baixo para atualizar</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Atualizado {refreshCount} vezes
                    </p>
                  </div>
                </PullToRefresh>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pinch to Zoom</CardTitle>
              </CardHeader>
              <CardContent>
                <PinchZoom className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏍️</div>
                      <p>Use dois dedos para ampliar</p>
                    </div>
                  </div>
                </PinchZoom>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gauge className="w-5 h-5 mr-2" />
                  Otimizações de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Modo otimizado:</span>
                    <Badge variant={shouldOptimizeForPerformance ? "destructive" : "default"}>
                      {shouldOptimizeForPerformance ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Lazy Loading Image:</h4>
                    <LazyImage
                      src="/images/placeholder-news.jpg"
                      alt="Demo image"
                      className="w-full h-32 rounded-lg"
                      placeholder="/images/placeholder.jpg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Virtual Scrolling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 border rounded-lg">
                  <VirtualScroll
                    items={virtualScrollItems}
                    renderItem={renderVirtualItem}
                    itemHeight={80}
                    containerHeight={256}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  Navegação Mobile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  A navegação inferior está ativa nesta página. Veja na parte inferior da tela.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Recursos ativos:</h4>
                  <div className="text-sm space-y-1">
                    <p>✅ Bottom Navigation</p>
                    <p>✅ Floating Action Button</p>
                    <p>✅ Quick Actions Menu</p>
                    <p>✅ Haptic Feedback</p>
                    <p>✅ Gesture Recognition</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<Zap className="w-6 h-6" />}
        onClick={() => alert('FAB clicado!')}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        items={[
          {
            id: 'demo',
            label: 'Demo',
            icon: <Smartphone className="w-5 h-5" />,
            href: '/mobile-demo'
          },
          {
            id: 'news',
            label: 'Notícias',
            icon: <Layers className="w-5 h-5" />,
            href: '/noticias'
          },
          {
            id: 'home',
            label: 'Home',
            icon: <Navigation className="w-5 h-5" />,
            href: '/'
          }
        ]}
      />

      {/* Gesture Debug Panel (only in development) */}
      <GestureDebugPanel />
    </div>
  )
}