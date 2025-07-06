import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  published_at: string
  category: string
  image_url?: string
  relevance_score: number
}

interface LatestNewsProps {
  news: NewsItem[]
}

export default function LatestNews({ news }: LatestNewsProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'regulation': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'safety': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'technology': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'urban_mobility': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'regulation': return 'Regulamentação'
      case 'safety': return 'Segurança'
      case 'technology': return 'Tecnologia'
      case 'urban_mobility': return 'Mobilidade Urbana'
      default: return 'Geral'
    }
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Últimas Notícias
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Mantenha-se atualizado com as principais novidades sobre autopropelidos
            </p>
          </div>
          <Link href="/noticias">
            <Button variant="outline" className="gap-2">
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {item.image_url && (
                <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryColor(item.category)}>
                    {getCategoryLabel(item.category)}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(item.published_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.source}
                  </span>
                  <Link href={item.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="gap-2">
                      Ler mais
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma notícia encontrada. Verifique novamente em breve.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}