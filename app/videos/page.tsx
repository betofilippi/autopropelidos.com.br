import { Metadata } from 'next'
import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Search, Filter, Clock, Eye } from "lucide-react"
import { VideosContent } from './videos-content'
import { SkeletonVideo } from '@/components/ui/skeletons'

export const metadata: Metadata = {
  title: 'Vídeos sobre Equipamentos Autopropelidos | Portal Autopropelidos',
  description: 'Assista aos melhores vídeos sobre patinetes elétricos, bicicletas elétricas e Resolução 996 do CONTRAN.',
  keywords: 'videos, patinete elétrico, bicicleta elétrica, CONTRAN 996, autopropelidos, youtube'
}

// This page uses dynamic data fetching
export const dynamic = 'force-dynamic'

async function getVideos() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/videos?limit=10`, {
      cache: 'no-store'
    })
    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error('Error fetching videos:', error)
    return []
  }
}

export default async function VideosPage() {
  const videos = await getVideos()

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
                  aria-label="Buscar vídeos"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filtrar por categoria">
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
                <SelectTrigger className="w-full sm:w-[180px]" aria-label="Ordenar por">
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

        <Suspense 
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonVideo key={i} />
              ))}
            </div>
          }
        >
          <VideosContent initialVideos={videos} />
        </Suspense>
      </div>
    </div>
  )
}