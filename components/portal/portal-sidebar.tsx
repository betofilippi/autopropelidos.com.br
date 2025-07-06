import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  FileText, 
  ExternalLink, 
  ArrowRight,
  ChevronRight,
  Clock,
  Eye
} from "lucide-react"
import Link from "next/link"

interface TrendingItem {
  id: string
  title: string
  url: string
  views: number
  category: string
}

interface QuickLink {
  id: string
  title: string
  url: string
  icon: any
  description: string
}

interface NewsletterStats {
  subscribers: number
  growth: string
}

interface PortalSidebarProps {
  trendingNews: TrendingItem[]
  quickLinks: QuickLink[]
  newsletterStats: NewsletterStats
}

export default function PortalSidebar({ 
  trendingNews, 
  quickLinks,
  newsletterStats 
}: PortalSidebarProps) {
  const formatViews = (views: number) => {
    if (views < 1000) return views.toString()
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
    return `${(views / 1000000).toFixed(1)}M`
  }

  const formatSubscribers = (count: number) => {
    if (count < 1000) return count.toString()
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
    return `${(count / 1000000).toFixed(1)}M`
  }

  return (
    <div className="portal-sidebar">
      {/* Trending News */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Mais Lidas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {trendingNews.map((item, index) => (
              <Link key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatViews(item.views)}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <Link href="/noticias?ordenar=views">
              <Button variant="outline" size="sm" className="w-full gap-2">
                Ver ranking completo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Acesso Rápido
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <Link key={link.id} href={link.url}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <link.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {link.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {link.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center space-y-4">
            <div>
              <div className="text-3xl font-bold text-primary">
                {formatSubscribers(newsletterStats.subscribers)}
              </div>
              <div className="text-sm text-gray-600">
                Assinantes ativos
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm font-medium text-green-800">
                {newsletterStats.growth} este mês
              </div>
              <div className="text-xs text-green-600">
                Crescimento da base
              </div>
            </div>
            
            <Link href="/newsletter">
              <Button className="w-full gap-2">
                Assinar Newsletter
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Updates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Atualizações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium">Nova ferramenta de verificação</p>
                <p className="text-xs text-gray-500">Há 2 horas</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium">Atualização da Resolução 996</p>
                <p className="text-xs text-gray-500">Há 1 dia</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium">Novo canal de vídeos</p>
                <p className="text-xs text-gray-500">Há 3 dias</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Siga-nos</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            <a 
              href="https://youtube.com/@autopropelidos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center">
                <ExternalLink className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium text-sm">YouTube</div>
                <div className="text-xs text-gray-500">Vídeos</div>
              </div>
            </a>
            
            <a 
              href="https://instagram.com/autopropelidos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
            >
              <div className="w-8 h-8 bg-pink-600 text-white rounded-lg flex items-center justify-center">
                <ExternalLink className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium text-sm">Instagram</div>
                <div className="text-xs text-gray-500">Fotos</div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook para dados da sidebar
export function useSidebarData() {
  const trendingNews: TrendingItem[] = [
    {
      id: '1',
      title: 'CONTRAN publica Resolução 996: Nova era para equipamentos autopropelidos',
      url: '/noticias/contran-resolucao-996',
      views: 15400,
      category: 'Regulamentação'
    },
    {
      id: '2',
      title: 'Segurança no trânsito: Como usar patinetes elétricos corretamente',
      url: '/noticias/seguranca-patinetes-eletricos',
      views: 12300,
      category: 'Segurança'
    },
    {
      id: '3',
      title: 'Mercado de patinetes elétricos cresce 150% no Brasil',
      url: '/noticias/mercado-patinetes-crescimento',
      views: 8900,
      category: 'Mercado'
    },
    {
      id: '4',
      title: 'Multas por uso incorreto de equipamentos autopropelidos aumentam',
      url: '/noticias/multas-equipamentos-autopropelidos',
      views: 7600,
      category: 'Regulamentação'
    },
    {
      id: '5',
      title: 'Bicicletas elétricas ganham espaço no delivery brasileiro',
      url: '/noticias/bicicletas-eletricas-delivery',
      views: 6800,
      category: 'Mercado'
    }
  ]

  const quickLinks: QuickLink[] = [
    {
      id: '1',
      title: 'Resolução 996',
      url: '/resolucao-996',
      icon: FileText,
      description: 'Texto completo da regulamentação'
    },
    {
      id: '2',
      title: 'Verificador de Conformidade',
      url: '/ferramentas/verificador-conformidade',
      icon: FileText,
      description: 'Verifique se seu equipamento está em conformidade'
    },
    {
      id: '3',
      title: 'Calculadora de Multas',
      url: '/ferramentas/calculadora-multas',
      icon: FileText,
      description: 'Calcule valores de multas e pontos'
    },
    {
      id: '4',
      title: 'Guias de Segurança',
      url: '/guias/seguranca',
      icon: FileText,
      description: 'Dicas essenciais para circular com segurança'
    }
  ]

  const newsletterStats: NewsletterStats = {
    subscribers: 28500,
    growth: '+12.5%'
  }

  return {
    trendingNews,
    quickLinks,
    newsletterStats
  }
}