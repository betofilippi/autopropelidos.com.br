import type { SearchFilters, PaginationOptions, SearchResult } from '@/lib/types/services'

// Utilitários para busca full-text
export class SearchEngine {
  private stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'were', 'will', 'with', 'the', 'this', 'but', 'they',
    'have', 'had', 'what', 'said', 'each', 'which', 'she', 'do', 'how',
    'their', 'if', 'up', 'out', 'many', 'then', 'them', 'these', 'so',
    'some', 'her', 'would', 'make', 'like', 'into', 'him', 'has', 'two',
    'more', 'go', 'no', 'way', 'could', 'my', 'than', 'first', 'been',
    'call', 'who', 'oil', 'sit', 'now', 'find', 'down', 'day', 'did',
    'get', 'come', 'made', 'may', 'part',
    // Palavras em português
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'da', 'do',
    'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com',
    'sem', 'sob', 'sobre', 'entre', 'contra', 'desde', 'até', 'durante',
    'e', 'ou', 'mas', 'porém', 'contudo', 'entretanto', 'todavia', 'se',
    'que', 'quando', 'onde', 'como', 'porque', 'pois', 'já', 'ainda',
    'não', 'nem', 'também', 'só', 'apenas', 'mesmo', 'até', 'já', 'mais',
    'menos', 'muito', 'pouco', 'bem', 'mal', 'melhor', 'pior', 'maior',
    'menor', 'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses',
    'essas', 'aquele', 'aquela', 'aqueles', 'aquelas', 'meu', 'minha',
    'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'seu', 'sua', 'seus',
    'suas', 'nosso', 'nossa', 'nossos', 'nossas', 'vosso', 'vossa',
    'vossos', 'vossas', 'dele', 'dela', 'deles', 'delas'
  ])

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s]/g, ' ') // Remove pontuação
      .replace(/\s+/g, ' ') // Normaliza espaços
      .trim()
  }

  private tokenize(text: string): string[] {
    return this.normalizeText(text)
      .split(' ')
      .filter(token => token.length > 2 && !this.stopWords.has(token))
  }

  private calculateRelevance(searchTerms: string[], item: any, fields: string[]): number {
    let score = 0
    const tokenizedTerms = searchTerms.map(term => this.normalizeText(term))
    
    for (const field of fields) {
      const fieldValue = item[field]
      if (!fieldValue) continue
      
      const fieldText = this.normalizeText(String(fieldValue))
      const fieldTokens = this.tokenize(fieldText)
      
      // Pontuação por correspondência exata
      for (const term of tokenizedTerms) {
        if (fieldText.includes(term)) {
          score += field === 'title' ? 10 : field === 'description' ? 5 : 2
        }
      }
      
      // Pontuação por tokens individuais
      for (const token of fieldTokens) {
        for (const term of tokenizedTerms) {
          if (token.includes(term) || term.includes(token)) {
            score += field === 'title' ? 3 : field === 'description' ? 2 : 1
          }
        }
      }
    }
    
    return score
  }

  search<T>(
    items: T[],
    query: string,
    searchFields: string[],
    filters?: SearchFilters,
    pagination?: PaginationOptions
  ): SearchResult<T> {
    let results = [...items]
    
    // Aplicar busca por texto
    if (query && query.trim()) {
      const searchTerms = query.trim().split(/\s+/)
      
      results = results
        .map(item => ({
          item,
          relevance: this.calculateRelevance(searchTerms, item, searchFields)
        }))
        .filter(result => result.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .map(result => result.item)
    }
    
    // Aplicar filtros
    if (filters) {
      results = this.applyFilters(results, filters)
    }
    
    const total = results.length
    
    // Aplicar paginação
    if (pagination) {
      const { page, limit } = pagination
      const offset = (page - 1) * limit
      results = results.slice(offset, offset + limit)
    }
    
    return {
      items: results,
      total,
      page: pagination?.page || 1,
      limit: pagination?.limit || results.length,
      hasNext: pagination ? (pagination.page * pagination.limit) < total : false,
      hasPrevious: pagination ? pagination.page > 1 : false,
      totalPages: pagination ? Math.ceil(total / pagination.limit) : 1
    }
  }

  private applyFilters<T>(items: T[], filters: SearchFilters): T[] {
    let results = [...items]
    
    // Filtro por categoria
    if (filters.category) {
      const categories = Array.isArray(filters.category) ? filters.category : [filters.category]
      results = results.filter((item: any) => 
        categories.some(cat => cat === 'all' || item.category === cat)
      )
    }
    
    // Filtro por data
    if (filters.dateRange) {
      const { start, end } = filters.dateRange
      results = results.filter((item: any) => {
        const itemDate = new Date(item.published_at || item.created_at)
        return itemDate >= new Date(start) && itemDate <= new Date(end)
      })
    }
    
    // Filtro por tags
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((item: any) => {
        const itemTags = item.tags || []
        return filters.tags!.some(tag => itemTags.includes(tag))
      })
    }
    
    // Filtro por relevância mínima
    if (filters.minRelevanceScore) {
      results = results.filter((item: any) => 
        (item.relevance_score || 0) >= filters.minRelevanceScore!
      )
    }
    
    // Filtro por fonte
    if (filters.source) {
      results = results.filter((item: any) => 
        item.source === filters.source || item.channel_name === filters.source
      )
    }
    
    // Aplicar ordenação
    if (filters.sortBy) {
      results = this.sortResults(results, filters.sortBy, filters.sortOrder)
    }
    
    return results
  }

  private sortResults<T>(items: T[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc'): T[] {
    const direction = sortOrder === 'desc' ? -1 : 1
    
    return items.sort((a: any, b: any) => {
      let valueA: any
      let valueB: any
      
      switch (sortBy) {
        case 'relevance':
          valueA = a.relevance_score || 0
          valueB = b.relevance_score || 0
          break
        case 'date':
          valueA = new Date(a.published_at || a.created_at)
          valueB = new Date(b.published_at || b.created_at)
          break
        case 'views':
          valueA = a.view_count || 0
          valueB = b.view_count || 0
          break
        case 'alphabetical':
          valueA = (a.title || a.name || '').toLowerCase()
          valueB = (b.title || b.name || '').toLowerCase()
          break
        default:
          return 0
      }
      
      if (valueA < valueB) return -1 * direction
      if (valueA > valueB) return 1 * direction
      return 0
    })
  }

  // Função para buscar termos similares
  findSimilarTerms(term: string, vocabulary: string[], threshold: number = 0.7): string[] {
    const normalizedTerm = this.normalizeText(term)
    const similar: Array<{ term: string; score: number }> = []
    
    for (const vocabTerm of vocabulary) {
      const normalizedVocab = this.normalizeText(vocabTerm)
      const score = this.calculateSimilarity(normalizedTerm, normalizedVocab)
      
      if (score >= threshold) {
        similar.push({ term: vocabTerm, score })
      }
    }
    
    return similar
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.term)
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  // Função para extrair termos de busca populares
  extractPopularTerms(items: any[], textFields: string[]): Record<string, number> {
    const termFrequency: Record<string, number> = {}
    
    for (const item of items) {
      for (const field of textFields) {
        const text = item[field]
        if (text) {
          const tokens = this.tokenize(text)
          for (const token of tokens) {
            termFrequency[token] = (termFrequency[token] || 0) + 1
          }
        }
      }
    }
    
    return termFrequency
  }

  // Função para gerar sugestões de busca
  generateSearchSuggestions(
    query: string,
    items: any[],
    textFields: string[],
    maxSuggestions: number = 5
  ): string[] {
    const popularTerms = this.extractPopularTerms(items, textFields)
    const queryTerms = this.tokenize(query)
    const suggestions: Array<{ term: string; score: number }> = []
    
    for (const [term, frequency] of Object.entries(popularTerms)) {
      if (term.startsWith(query.toLowerCase()) || 
          queryTerms.some(qTerm => term.includes(qTerm))) {
        suggestions.push({ term, score: frequency })
      }
    }
    
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSuggestions)
      .map(item => item.term)
  }
}

// Instância global do mecanismo de busca
export const searchEngine = new SearchEngine()

// Função utilitária para busca rápida
export function quickSearch<T>(
  items: T[],
  query: string,
  searchFields: string[],
  options: {
    filters?: SearchFilters
    pagination?: PaginationOptions
  } = {}
): SearchResult<T> {
  return searchEngine.search(items, query, searchFields, options.filters, options.pagination)
}

export default SearchEngine