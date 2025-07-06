import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Calendar, Eye, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface VideoItem {
  id: string
  youtube_id: string
  title: string
  description: string
  channel_name: string
  thumbnail_url: string
  published_at: string
  duration: string
  view_count: number
  category: string
}

interface FeaturedVideosProps {
  videos: VideoItem[]
}

export default function FeaturedVideos({ videos }: FeaturedVideosProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news_report': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'educational': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'analysis': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'review': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'tutorial': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'news_report': return 'Reportagem'
      case 'educational': return 'Educativo'
      case 'analysis': return 'Análise'
      case 'review': return 'Review'
      case 'tutorial': return 'Tutorial'
      default: return 'Outros'
    }
  }

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <section 
      className="py-16 bg-gray-50 dark:bg-gray-900"
      aria-labelledby="featured-videos-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 
              id="featured-videos-heading"
              className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
            >
              Vídeos em Destaque
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Conteúdo audiovisual de qualidade sobre autopropelidos
            </p>
          </div>
          <Link href="/videos">
            <Button 
              variant="outline" 
              className="gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Ver todos os vídeos"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>

        <div 
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
          role="list"
          aria-label="Lista de vídeos em destaque"
        >
          {videos.map((video) => (
            <Card 
              key={video.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow group focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
              asArticle
              role="listitem"
            >
              <div className="relative">
                <div className="relative h-48 bg-black">
                  <Image
                    src={video.thumbnail_url}
                    alt={`Thumbnail do vídeo: ${video.title}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Link 
                      href={`https://youtube.com/watch?v=${video.youtube_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Assistir vídeo: ${video.title} no YouTube (abre em nova aba)`}
                    >
                      <Button 
                        size="lg" 
                        className="rounded-full bg-red-600 hover:bg-red-700 text-white gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
                      >
                        <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                        Assistir
                      </Button>
                    </Link>
                  </div>
                  <div 
                    className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded"
                    aria-label={`Duração: ${video.duration}`}
                  >
                    {video.duration}
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    className={getCategoryColor(video.category)}
                    aria-label={`Categoria: ${getCategoryLabel(video.category)}`}
                  >
                    {getCategoryLabel(video.category)}
                  </Badge>
                </div>
                <CardTitle className="text-base line-clamp-2" level={3}>
                  {video.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {video.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{video.channel_name}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" aria-hidden="true" />
                      <span aria-label={`${video.view_count} visualizações`}>
                        {formatViewCount(video.view_count)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      <time 
                        dateTime={video.published_at}
                        aria-label={`Publicado em ${new Date(video.published_at).toLocaleDateString('pt-BR', { 
                          day: 'numeric', 
                          month: 'long',
                          year: 'numeric'
                        })}`}
                      >
                        {new Date(video.published_at).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: '2-digit' 
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {videos.length === 0 && (
          <div 
            className="text-center py-12"
            role="status"
            aria-live="polite"
          >
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum vídeo encontrado. Verifique novamente em breve.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}