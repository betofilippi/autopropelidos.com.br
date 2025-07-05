"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  FileText,
  Calculator,
  BookOpen,
  HelpCircle,
  Scale,
  Newspaper,
  PlayCircle,
  Search,
  ArrowLeft,
} from "lucide-react"
import { searchContent, SearchResult } from "@/lib/services/search"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchTrigger } from "@/components/search/SearchTrigger"

const iconMap = {
  page: FileText,
  tool: Calculator,
  glossary: BookOpen,
  faq: HelpCircle,
  regulation: Scale,
  news: Newspaper,
  video: PlayCircle,
}

const typeLabels = {
  page: "Página",
  tool: "Ferramenta",
  glossary: "Glossário",
  faq: "Pergunta Frequente",
  regulation: "Regulamentação",
  news: "Notícia",
  video: "Vídeo",
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState(query)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const searchResults = await searchContent(term)
      setResults(searchResults)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Update URL with search query
      const params = new URLSearchParams()
      params.set("q", searchTerm)
      window.history.pushState({}, "", `/busca?${params.toString()}`)
      performSearch(searchTerm)
    }
  }

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Buscar</h1>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Digite sua busca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit" disabled={isLoading}>
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {query && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {isLoading ? (
                "Buscando..."
              ) : results.length > 0 ? (
                <>
                  {results.length} {results.length === 1 ? "resultado" : "resultados"} para{" "}
                  <span className="font-medium text-foreground">"{query}"</span>
                </>
              ) : (
                <>
                  Nenhum resultado encontrado para{" "}
                  <span className="font-medium text-foreground">"{query}"</span>
                </>
              )}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Results */}
        {!isLoading && results.length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupedResults).map(([type, items]) => {
              const Icon = iconMap[type as keyof typeof iconMap]
              const label = typeLabels[type as keyof typeof typeLabels]

              return (
                <div key={type}>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    {label}
                    <Badge variant="secondary" className="ml-2">
                      {items.length}
                    </Badge>
                  </h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <Link href={item.url}>
                          <CardHeader>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            {item.description && (
                              <CardDescription>{item.description}</CardDescription>
                            )}
                            {item.category && (
                              <div className="pt-2">
                                <Badge variant="outline">{item.category}</Badge>
                              </div>
                            )}
                          </CardHeader>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* No Results */}
        {!isLoading && query && results.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Tente usar palavras-chave diferentes ou verifique a ortografia.
              </p>
              <SearchTrigger variant="default" className="mx-auto" />
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!query && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Faça uma busca</h3>
              <p className="text-muted-foreground">
                Digite palavras-chave para buscar em nosso conteúdo.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}