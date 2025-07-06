import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

interface BreakingNewsItem {
  id: string
  title: string
  url: string
  timestamp: string
  priority: 'urgent' | 'high' | 'normal'
}

interface BreakingNewsBarProps {
  news: BreakingNewsItem[]
}

export default function BreakingNewsBar({ news }: BreakingNewsBarProps) {
  if (!news || news.length === 0) return null

  const urgentNews = news.filter(item => item.priority === 'urgent')
  const displayNews = urgentNews.length > 0 ? urgentNews : news.slice(0, 3)

  return (
    <div className="breaking-news-bar text-white py-2 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex items-center gap-4">
          {/* Breaking News Label */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <AlertCircle className="h-4 w-4 breaking-pulse" />
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 font-bold">
              ÚLTIMA HORA
            </Badge>
          </div>

          {/* News Ticker */}
          <div className="flex-1 overflow-hidden">
            <div className="breaking-news-scroll flex items-center gap-8 whitespace-nowrap">
              {displayNews.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 min-w-max">
                  <Link 
                    href={item.url}
                    className="text-white hover:text-white/90 transition-colors"
                  >
                    <span className="font-medium">{item.title}</span>
                  </Link>
                  
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <Clock className="h-3 w-3" />
                    <span>{item.timestamp}</span>
                  </div>

                  {index < displayNews.length - 1 && (
                    <div className="w-px h-4 bg-white/30" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="hidden sm:block">
            <Link href="/noticias?categoria=breaking">
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver mais
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook para simular notícias breaking news
export function useBreakingNews(): BreakingNewsItem[] {
  // Em produção, isso viria de uma API real
  const mockBreakingNews: BreakingNewsItem[] = [
    {
      id: '1',
      title: 'CONTRAN anuncia novas regras para patinetes elétricos em 2024',
      url: '/noticias/contran-novas-regras-patinetes-2024',
      timestamp: '2 min',
      priority: 'urgent'
    },
    {
      id: '2',
      title: 'São Paulo amplia ciclofaixas para equipamentos autopropelidos',
      url: '/noticias/sao-paulo-amplia-ciclofaixas',
      timestamp: '15 min',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Cresce 200% uso de bicicletas elétricas no delivery brasileiro',
      url: '/noticias/crescimento-bicicletas-eletricas-delivery',
      timestamp: '1 hora',
      priority: 'normal'
    },
    {
      id: '4',
      title: 'Multas por uso incorreto de equipamentos autopropelidos aumentam em capitais',
      url: '/noticias/multas-equipamentos-autopropelidos',
      timestamp: '2 horas',
      priority: 'high'
    }
  ]

  return mockBreakingNews
}