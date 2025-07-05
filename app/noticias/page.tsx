import { Metadata } from 'next'
import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, ExternalLink, TrendingUp } from "lucide-react"
import Link from 'next/link'
import { SkeletonNews } from '@/components/ui/skeletons'

export const metadata: Metadata = {
  title: 'Notícias sobre Equipamentos Autopropelidos | Portal Autopropelidos',
  description: 'Acompanhe as últimas notícias sobre patinetes elétricos, bicicletas elétricas e regulamentações do CONTRAN.',
  keywords: 'notícias, patinete elétrico, bicicleta elétrica, CONTRAN 996, autopropelidos, regulamentação'
}

// This page uses dynamic data fetching
export const dynamic = 'force-dynamic'

import { NewsContent } from './news-content'

async function getNews() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/news?limit=10`, {
      cache: 'no-store' // Ensure fresh data
    })
    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

export default async function NoticiasPage() {
  const news = await getNews()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Notícias sobre Equipamentos Autopropelidos
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Fique atualizado com as últimas notícias, regulamentações e desenvolvimentos 
              no mundo da micromobilidade urbana
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
                  placeholder="Buscar notícias..."
                  className="pl-10"
                  aria-label="Buscar notícias"
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
                  <SelectItem value="regulation">Regulamentação</SelectItem>
                  <SelectItem value="safety">Segurança</SelectItem>
                  <SelectItem value="technology">Tecnologia</SelectItem>
                  <SelectItem value="urban_mobility">Mobilidade Urbana</SelectItem>
                  <SelectItem value="general">Geral</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="recent">
                <SelectTrigger className="w-full sm:w-[180px]" aria-label="Ordenar por">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="relevant">Mais relevantes</SelectItem>
                  <SelectItem value="source">Por fonte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Suspense 
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonNews key={i} />
              ))}
            </div>
          }
        >
          <NewsContent initialNews={news} />
        </Suspense>
      </div>
    </div>
  )
}