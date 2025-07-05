'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink, Calendar, Play, FileText, Car } from "lucide-react"
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  type: 'news' | 'videos' | 'regulations' | 'vehicles'
  title?: string
  name?: string
  description: string
  url?: string
  youtube_id?: string
  published_at?: string
  category: string
  source?: string
  channel_name?: string
  manufacturer?: string
  model?: string
}

interface SearchResults {
  success: boolean
  data: SearchResult[]
  meta: {
    query: string
    total: number
    limit: number
    types: {
      news: number
      videos: number
      regulations: number
      vehicles: number
    }
  }
}

const typeConfig = {
  news: {
    icon: FileText,
    label: 'Notícias',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  videos: {
    icon: Play,
    label: 'Vídeos',
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  regulations: {
    icon: FileText,
    label: 'Regulamentações',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  vehicles: {
    icon: Car,
    label: 'Veículos',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  }
}

interface SearchDialogProps {
  children: React.ReactNode
}

export function SearchDialog({ children }: SearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')

  const performSearch = async (searchQuery: string, type: string = 'all') => {
    if (!searchQuery.trim()) {
      setResults(null)
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: '20'
      })
      
      if (type !== 'all') {
        params.append('type', type)
      }

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setResults(data)
      } else {
        setResults(null)
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        performSearch(query, selectedType)
      } else {
        setResults(null)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, selectedType])

  const handleResultClick = () => {
    setOpen(false)
    setQuery('')
    setResults(null)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getResultUrl = (result: SearchResult) => {
    if (result.type === 'videos' && result.youtube_id) {
      return `https://www.youtube.com/watch?v=${result.youtube_id}`
    }
    return result.url || '#'
  }

  const getResultTitle = (result: SearchResult) => {
    return result.title || result.name || 'Sem título'
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Buscar no Portal</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Digite sua busca..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              Todos
            </Button>
            {Object.entries(typeConfig).map(([type, config]) => (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="flex items-center gap-1"
              >
                <config.icon className="h-3 w-3" />
                {config.label}
              </Button>
            ))}
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="ml-2">Buscando...</span>
              </div>
            )}

            {results && !loading && (
              <div className="space-y-4">
                {/* Results Summary */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {results.meta.total} resultados para "{results.meta.query}"
                  {results.meta.total > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(results.meta.types).map(([type, count]) => {
                        if (count === 0) return null
                        const config = typeConfig[type as keyof typeof typeConfig]
                        return (
                          <Badge key={type} variant="outline" className={config.color}>
                            <config.icon className="h-3 w-3 mr-1" />
                            {count} {config.label.toLowerCase()}
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Results List */}
                {results.data.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum resultado encontrado
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.data.map((result) => {
                      const config = typeConfig[result.type]
                      const Icon = config.icon
                      const isExternal = result.type === 'videos' || result.url?.startsWith('http')
                      
                      return (
                        <Link
                          key={result.id}
                          href={getResultUrl(result)}
                          target={isExternal ? '_blank' : '_self'}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          onClick={handleResultClick}
                          className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={cn("p-2 rounded-lg", config.color)}>
                              <Icon className="h-4 w-4" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h3 className="font-medium text-sm line-clamp-2 text-gray-900 dark:text-white">
                                  {getResultTitle(result)}
                                </h3>
                                {isExternal && (
                                  <ExternalLink className="h-3 w-3 text-gray-400 ml-2 flex-shrink-0" />
                                )}
                              </div>
                              
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                                {result.description}
                              </p>
                              
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <Badge variant="outline" className={config.color}>
                                  {config.label}
                                </Badge>
                                
                                {result.source && (
                                  <span>{result.source}</span>
                                )}
                                
                                {result.channel_name && (
                                  <span>{result.channel_name}</span>
                                )}
                                
                                {result.manufacturer && result.model && (
                                  <span>{result.manufacturer} {result.model}</span>
                                )}
                                
                                {result.published_at && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(result.published_at)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {!loading && !results && query && (
              <div className="text-center py-8 text-gray-500">
                Digite pelo menos 1 caractere para buscar
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}