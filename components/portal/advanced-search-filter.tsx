'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { toast } from "@/components/ui/use-toast"
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  Clock,
  Tag,
  User,
  TrendingUp,
  Star,
  BookmarkCheck,
  History,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Save,
  Trash2,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  Download,
  SlidersHorizontal,
  Grid3X3,
  List,
  AlignJustify,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  MapPin,
  Building,
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
  Sparkles
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  type: 'article' | 'video' | 'tool' | 'regulation'
  category: string
  source: string
  author: string
  published_at: string
  views: number
  likes: number
  comments: number
  reading_time?: number
  tags: string[]
  relevance_score: number
  thumbnail?: string
  location?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  status?: 'active' | 'draft' | 'archived'
}

interface SearchFilter {
  query: string
  type: string[]
  category: string[]
  dateRange: {
    start: Date | null
    end: Date | null
  }
  author: string[]
  source: string[]
  tags: string[]
  location: string[]
  difficulty: string[]
  status: string[]
  minViews: number
  maxViews: number
  minLikes: number
  maxLikes: number
  readingTime: number[]
  sortBy: 'relevance' | 'date' | 'views' | 'likes' | 'title'
  sortOrder: 'asc' | 'desc'
}

interface SavedSearch {
  id: string
  name: string
  filters: SearchFilter
  created_at: string
  last_used: string
  use_count: number
}

interface SearchSuggestion {
  id: string
  text: string
  type: 'query' | 'category' | 'tag' | 'author'
  count: number
  trending?: boolean
}

export default function AdvancedSearchFilter() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [filters, setFilters] = useState<SearchFilter>({
    query: '',
    type: [],
    category: [],
    dateRange: { start: null, end: null },
    author: [],
    source: [],
    tags: [],
    location: [],
    difficulty: [],
    status: [],
    minViews: 0,
    maxViews: 100000,
    minLikes: 0,
    maxLikes: 1000,
    readingTime: [0, 60],
    sortBy: 'relevance',
    sortOrder: 'desc'
  })
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSaveSearchOpen, setIsSaveSearchOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [searchCount, setSearchCount] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()

  // Debounced search function
  const debouncedSearch = useCallback((searchFilters: SearchFilter) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(searchFilters)
    }, 300)
  }, [])

  // Perform search
  const performSearch = async (searchFilters: SearchFilter) => {
    setIsLoading(true)
    
    try {
      // Add to search history
      if (searchFilters.query && !searchHistory.includes(searchFilters.query)) {
        setSearchHistory(prev => [searchFilters.query, ...prev.slice(0, 9)])
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Novas regras do CONTRAN para patinetes elétricos 2024',
          description: 'Entenda todas as mudanças na regulamentação dos patinetes elétricos aprovadas pelo CONTRAN.',
          url: '/noticias/contran-regras-patinetes-2024',
          type: 'article',
          category: 'regulation',
          source: 'CONTRAN',
          author: 'Redação Autopropelidos',
          published_at: new Date().toISOString(),
          views: 12540,
          likes: 892,
          comments: 156,
          reading_time: 5,
          tags: ['CONTRAN', 'patinetes', 'regulamentação', 'mobilidade urbana'],
          relevance_score: 95,
          thumbnail: '/images/news-placeholder.jpg',
          location: 'Brasil',
          difficulty: 'medium',
          status: 'active'
        },
        {
          id: '2',
          title: 'Calculadora de Custos para Equipamentos Autopropelidos',
          description: 'Ferramenta para calcular o custo-benefício de equipamentos de mobilidade urbana.',
          url: '/ferramentas/calculadora-custos',
          type: 'tool',
          category: 'finance',
          source: 'Autopropelidos',
          author: 'Equipe Técnica',
          published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          views: 8920,
          likes: 445,
          comments: 78,
          tags: ['calculadora', 'custos', 'ferramenta', 'financeiro'],
          relevance_score: 88,
          location: 'Online',
          difficulty: 'easy',
          status: 'active'
        },
        {
          id: '3',
          title: 'Segurança no trânsito: Dicas para usuários de bicicletas elétricas',
          description: 'Guia completo de segurança para quem usa bicicletas elétricas no dia a dia.',
          url: '/videos/seguranca-bicicletas-eletricas',
          type: 'video',
          category: 'safety',
          source: 'Canal Autopropelidos',
          author: 'João Silva',
          published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          views: 15230,
          likes: 1205,
          comments: 234,
          tags: ['segurança', 'bicicleta elétrica', 'trânsito', 'dicas'],
          relevance_score: 92,
          thumbnail: '/images/video-placeholder.jpg',
          location: 'São Paulo',
          difficulty: 'easy',
          status: 'active'
        }
      ]
      
      setSearchResults(mockResults)
      setTotalResults(mockResults.length)
      setSearchCount(prev => prev + 1)
      
    } catch (error) {
      toast({
        title: "Erro na pesquisa",
        description: "Não foi possível realizar a pesquisa. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load suggestions
  const loadSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }
    
    const mockSuggestions: SearchSuggestion[] = [
      { id: '1', text: 'patinetes elétricos', type: 'query', count: 245, trending: true },
      { id: '2', text: 'CONTRAN', type: 'query', count: 189, trending: true },
      { id: '3', text: 'bicicletas elétricas', type: 'query', count: 156 },
      { id: '4', text: 'mobilidade urbana', type: 'query', count: 134 },
      { id: '5', text: 'regulamentação', type: 'category', count: 98 },
      { id: '6', text: 'segurança', type: 'category', count: 87 },
      { id: '7', text: 'João Silva', type: 'author', count: 45 },
      { id: '8', text: 'delivery', type: 'tag', count: 67 }
    ]
    
    const filtered = mockSuggestions.filter(s => 
      s.text.toLowerCase().includes(query.toLowerCase())
    )
    
    setSuggestions(filtered)
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, query: value }
    setFilters(newFilters)
    
    if (value.length > 0) {
      loadSuggestions(value)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
    
    debouncedSearch(newFilters)
  }

  // Handle filter change
  const handleFilterChange = (key: keyof SearchFilter, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    debouncedSearch(newFilters)
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const newFilters = { ...filters, query: suggestion.text }
    setFilters(newFilters)
    setShowSuggestions(false)
    performSearch(newFilters)
  }

  // Save search
  const saveSearch = (name: string) => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      filters: { ...filters },
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
      use_count: 1
    }
    
    setSavedSearches(prev => [newSearch, ...prev])
    setIsSaveSearchOpen(false)
    
    toast({
      title: "Pesquisa salva",
      description: `A pesquisa "${name}" foi salva com sucesso.`,
    })
  }

  // Load saved search
  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters)
    performSearch(savedSearch.filters)
    
    // Update usage stats
    setSavedSearches(prev => 
      prev.map(s => 
        s.id === savedSearch.id 
          ? { ...s, last_used: new Date().toISOString(), use_count: s.use_count + 1 }
          : s
      )
    )
  }

  // Delete saved search
  const deleteSavedSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id))
    toast({
      title: "Pesquisa removida",
      description: "A pesquisa salva foi removida.",
    })
  }

  // Clear filters
  const clearFilters = () => {
    const clearedFilters: SearchFilter = {
      query: '',
      type: [],
      category: [],
      dateRange: { start: null, end: null },
      author: [],
      source: [],
      tags: [],
      location: [],
      difficulty: [],
      status: [],
      minViews: 0,
      maxViews: 100000,
      minLikes: 0,
      maxLikes: 1000,
      readingTime: [0, 60],
      sortBy: 'relevance',
      sortOrder: 'desc'
    }
    setFilters(clearedFilters)
    setSelectedFilters([])
    setSearchResults([])
    setTotalResults(0)
  }

  // Format results count
  const formatResultsCount = (count: number) => {
    if (count === 0) return "Nenhum resultado encontrado"
    if (count === 1) return "1 resultado encontrado"
    return `${count} resultados encontrados`
  }

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.query) count++
    if (filters.type.length) count++
    if (filters.category.length) count++
    if (filters.dateRange.start || filters.dateRange.end) count++
    if (filters.author.length) count++
    if (filters.source.length) count++
    if (filters.tags.length) count++
    if (filters.location.length) count++
    if (filters.difficulty.length) count++
    if (filters.status.length) count++
    if (filters.minViews > 0 || filters.maxViews < 100000) count++
    if (filters.minLikes > 0 || filters.maxLikes < 1000) count++
    if (filters.readingTime[0] > 0 || filters.readingTime[1] < 60) count++
    return count
  }

  // Initial load
  useEffect(() => {
    // Load saved searches from localStorage
    const saved = localStorage.getItem('autopropelidos-saved-searches')
    if (saved) {
      setSavedSearches(JSON.parse(saved))
    }
    
    // Load search history from localStorage
    const history = localStorage.getItem('autopropelidos-search-history')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('autopropelidos-saved-searches', JSON.stringify(savedSearches))
  }, [savedSearches])

  useEffect(() => {
    localStorage.setItem('autopropelidos-search-history', JSON.stringify(searchHistory))
  }, [searchHistory])

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pesquisa Avançada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Pesquisar artigos, vídeos, ferramentas..."
                value={filters.query}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
                onFocus={() => setShowSuggestions(true)}
              />
              
              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-64 overflow-y-auto">
                  <CardContent className="p-2">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer rounded"
                      >
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{suggestion.text}</span>
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.type === 'query' ? 'Pesquisa' : 
                             suggestion.type === 'category' ? 'Categoria' :
                             suggestion.type === 'tag' ? 'Tag' : 'Autor'}
                          </Badge>
                          {suggestion.trending && (
                            <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{suggestion.count}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSaveSearchOpen(true)}
                disabled={!filters.query}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar pesquisa
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Limpar
              </Button>
              
              <div className="flex items-center gap-2 ml-auto">
                <Label className="text-sm">Visualização:</Label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'compact' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('compact')}
                    className="h-8 w-8 p-0"
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      {(searchResults.length > 0 || isLoading) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Pesquisando...
                </div>
              ) : (
                formatResultsCount(totalResults)
              )}
            </div>
            
            {searchCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {searchCount} pesquisas realizadas
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="text-sm">Ordenar por:</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value: any) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="views">Visualizações</SelectItem>
                <SelectItem value="likes">Curtidas</SelectItem>
                <SelectItem value="title">Título</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="h-8 w-8 p-0"
            >
              {filters.sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : searchResults.length > 0 ? (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
          viewMode === 'list' ? "grid-cols-1" :
          "grid-cols-1"
        )}>
          {searchResults.map((result) => (
            <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={cn(
                "flex",
                viewMode === 'list' ? "flex-row" : "flex-col"
              )}>
                {result.thumbnail && (
                  <div className={cn(
                    "bg-gray-100",
                    viewMode === 'list' ? "w-48 h-32" : "h-48 w-full"
                  )}>
                    <img 
                      src={result.thumbnail} 
                      alt={result.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1 p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {result.type === 'article' ? 'Artigo' :
                         result.type === 'video' ? 'Vídeo' :
                         result.type === 'tool' ? 'Ferramenta' : 'Regulamentação'}
                      </Badge>
                      
                      <Badge variant="outline" className="text-xs">
                        {result.category}
                      </Badge>
                      
                      {result.relevance_score > 90 && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Relevante
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {result.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {result.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{result.author}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(result.published_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{result.views}</span>
                      </div>
                      
                      {result.reading_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{result.reading_time} min</span>
                        </div>
                      )}
                    </div>
                    
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {result.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{result.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filters.query && (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <Search className="h-12 w-12 mx-auto text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-600 mt-2">
                Tente pesquisar com termos diferentes ou use menos filtros.
              </p>
            </div>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Limpar filtros
              </Button>
              <Button onClick={() => handleSearchChange('')}>
                Nova pesquisa
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Saved Searches Sidebar */}
      {savedSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookmarkCheck className="h-5 w-5" />
              Pesquisas Salvas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedSearches.slice(0, 5).map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <div onClick={() => loadSavedSearch(search)}>
                    <div className="font-medium text-sm">{search.name}</div>
                    <div className="text-xs text-gray-500">
                      Usado {search.use_count}x • {format(new Date(search.last_used), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSavedSearch(search.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search History */}
      {searchHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico de Pesquisas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearchChange(query)}
                  className="text-xs"
                >
                  {query}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters Modal */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filtros Avançados</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Content Type */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Tipo de Conteúdo</Label>
              <div className="space-y-2">
                {[
                  { value: 'article', label: 'Artigos' },
                  { value: 'video', label: 'Vídeos' },
                  { value: 'tool', label: 'Ferramentas' },
                  { value: 'regulation', label: 'Regulamentações' }
                ].map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={filters.type.includes(type.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleFilterChange('type', [...filters.type, type.value])
                        } else {
                          handleFilterChange('type', filters.type.filter(t => t !== type.value))
                        }
                      }}
                    />
                    <Label htmlFor={type.value} className="text-sm">{type.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Categoria</Label>
              <div className="space-y-2">
                {[
                  { value: 'regulation', label: 'Regulamentação' },
                  { value: 'safety', label: 'Segurança' },
                  { value: 'technology', label: 'Tecnologia' },
                  { value: 'urban_mobility', label: 'Mobilidade Urbana' },
                  { value: 'finance', label: 'Financeiro' }
                ].map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.value}
                      checked={filters.category.includes(category.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleFilterChange('category', [...filters.category, category.value])
                        } else {
                          handleFilterChange('category', filters.category.filter(c => c !== category.value))
                        }
                      }}
                    />
                    <Label htmlFor={category.value} className="text-sm">{category.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Período</Label>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.start ? format(filters.dateRange.start, 'dd/MM/yyyy', { locale: ptBR }) : 'Data inicial'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.start || undefined}
                      onSelect={(date) => handleFilterChange('dateRange', { ...filters.dateRange, start: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.end ? format(filters.dateRange.end, 'dd/MM/yyyy', { locale: ptBR }) : 'Data final'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.end || undefined}
                      onSelect={(date) => handleFilterChange('dateRange', { ...filters.dateRange, end: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Reading Time */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Tempo de Leitura: {filters.readingTime[0]} - {filters.readingTime[1]} min
              </Label>
              <Slider
                value={filters.readingTime}
                onValueChange={(value) => handleFilterChange('readingTime', value)}
                max={60}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Views Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Visualizações</Label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Mínimo"
                  value={filters.minViews}
                  onChange={(e) => handleFilterChange('minViews', Number(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Máximo"
                  value={filters.maxViews}
                  onChange={(e) => handleFilterChange('maxViews', Number(e.target.value))}
                />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Dificuldade</Label>
              <RadioGroup
                value={filters.difficulty[0] || ''}
                onValueChange={(value) => handleFilterChange('difficulty', value ? [value] : [])}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy" className="text-sm">Fácil</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="text-sm">Médio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard" className="text-sm">Difícil</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={() => setIsFilterOpen(false)}>
              Aplicar Filtros
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Search Modal */}
      <Dialog open={isSaveSearchOpen} onOpenChange={setIsSaveSearchOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Salvar Pesquisa</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="search-name" className="text-sm font-medium">
                Nome da pesquisa
              </Label>
              <Input
                id="search-name"
                placeholder="Ex: Artigos sobre CONTRAN"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement
                    if (target.value.trim()) {
                      saveSearch(target.value.trim())
                    }
                  }
                }}
              />
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Pesquisa atual: <strong>"{filters.query}"</strong></p>
              <p>Filtros ativos: <strong>{getActiveFiltersCount()}</strong></p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSaveSearchOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              const input = document.getElementById('search-name') as HTMLInputElement
              if (input?.value.trim()) {
                saveSearch(input.value.trim())
              }
            }}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}