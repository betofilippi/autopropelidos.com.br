import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Search, Filter, Clock, Eye } from "lucide-react"
import { getLatestVideos } from '@/lib/services/youtube'

export const metadata: Metadata = {
  title: 'Vídeos sobre Equipamentos Autopropelidos | Portal Autopropelidos',
  description: 'Assista aos melhores vídeos sobre patinetes elétricos, bicicletas elétricas e Resolução 996 do CONTRAN.',
  keywords: 'videos, patinete elétrico, bicicleta elétrica, CONTRAN 996, autopropelidos, youtube'
}

const categoryColors = {
  educational: 'bg-green-100 text-green-800 border-green-200',
  tutorial: 'bg-blue-100 text-blue-800 border-blue-200',
  review: 'bg-purple-100 text-purple-800 border-purple-200',
  news_report: 'bg-red-100 text-red-800 border-red-200',
  analysis: 'bg-orange-100 text-orange-800 border-orange-200'
}

const categoryLabels = {
  educational: 'Educativo',
  tutorial: 'Tutorial',
  review: 'Review',
  news_report: 'Reportagem',
  analysis: 'Análise'
}

function formatDuration(duration: string) {
  // Parse ISO 8601 duration (PT8M45S)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return duration
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatViewCount(count: number) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

function formatPublishedDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'há 1 dia'
  if (diffDays < 7) return `há ${diffDays} dias`
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} meses`
  return `há ${Math.floor(diffDays / 365)} anos`
}

export default async function VideosPage() {
  const videos = await getLatestVideos('all', 50)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Vídeos sobre Equipamentos Autopropelidos
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Assista aos melhores conteúdos sobre patinetes elétricos, bicicletas elétricas 
              e a Resolução 996 do CONTRAN
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar vídeos..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="educational">Educativo</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="news_report">Reportagem</SelectItem>
                  <SelectItem value="analysis">Análise</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="recent">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="popular">Mais populares</SelectItem>
                  <SelectItem value="relevant">Mais relevantes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-200">
                      <Play className="h-6 w-6 text-white fill-current" />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {formatDuration(video.duration)}
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Category Badge */}
                  <Badge 
                    variant="outline" 
                    className={`${categoryColors[video.category as keyof typeof categoryColors]} mb-2`}
                  >
                    {categoryLabels[video.category as keyof typeof categoryLabels]}
                  </Badge>

                  {/* Title */}
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>

                  {/* Channel */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {video.channel_name}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {formatViewCount(video.view_count)} visualizações
                    </div>
                    <div>
                      {formatPublishedDate(video.published_at)}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Carregar mais vídeos
          </Button>
        </div>
      </div>
    </div>
  )
}