import type { NewsAPIResponse, NewsAPIArticle } from '@/lib/types/api'
import { createClient } from '@/lib/supabase/server'
import { cacheManager } from '@/lib/utils/cache'
import { newsLogger } from '@/lib/utils/logger'
import { quickSearch } from '@/lib/utils/search'
import type { SearchFilters, PaginationOptions, SearchResult, NewsItem } from '@/lib/types/services'

const NEWS_API_KEY = process.env.NEWS_API_KEY!
const NEWS_API_BASE_URL = 'https://newsapi.org/v2'

// Keywords relacionados a autopropelidos e mobilidade urbana
const KEYWORDS = [
  'patinete elétrico',
  'bicicleta elétrica',
  'ciclomotor',
  'autopropelidos',
  'mobilidade urbana',
  'CONTRAN 996',
  'regulamentação patinete',
  'segurança trânsito',
  'veículos elétricos',
  'micromobilidade'
]

// Fontes confiáveis de notícias brasileiras
const BRAZILIAN_SOURCES = [
  'globo.com',
  'uol.com.br',
  'folha.com.br',
  'estadao.com.br',
  'g1.globo.com',
  'r7.com',
  'terra.com.br',
  'cnnbrasil.com.br',
  'metropoles.com',
  'gazetadopovo.com.br'
]

export async function fetchNewsFromAPI(
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<NewsAPIResponse | null> {
  try {
    const params = new URLSearchParams({
      q: query,
      language: 'pt',
      sortBy: 'publishedAt',
      page: page.toString(),
      pageSize: pageSize.toString(),
      apiKey: NEWS_API_KEY
    })

    const response = await fetch(`${NEWS_API_BASE_URL}/everything?${params}`, {
      next: { revalidate: 3600 } // Cache por 1 hora
    })

    if (!response.ok) {
      console.error('NewsAPI error:', response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching news:', error)
    return null
  }
}

export async function aggregateNews() {
  const supabase = await createClient()
  const allArticles: NewsAPIArticle[] = []

  // Buscar notícias para cada palavra-chave
  for (const keyword of KEYWORDS) {
    const newsData = await fetchNewsFromAPI(keyword, 1, 10)
    if (newsData && newsData.articles) {
      allArticles.push(...newsData.articles)
    }
  }

  // Filtrar duplicatas por URL
  const uniqueArticles = Array.from(
    new Map(allArticles.map(article => [article.url, article])).values()
  )

  // Categorizar e salvar no banco
  for (const article of uniqueArticles) {
    const category = categorizeArticle(article)
    const relevanceScore = calculateRelevance(article)
    
    // Verificar se a notícia já existe
    const { data: existing } = await supabase
      .from('news')
      .select('id')
      .eq('url', article.url)
      .single()

    if (!existing) {
      await supabase.from('news').insert({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        source: article.source.name,
        published_at: article.publishedAt,
        category,
        tags: extractTags(article),
        image_url: article.urlToImage,
        relevance_score: relevanceScore
      })
    }
  }
}

function categorizeArticle(article: NewsAPIArticle): string {
  const text = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase()
  
  if (text.includes('regulamenta') || text.includes('lei') || text.includes('norma') || text.includes('contran')) {
    return 'regulation'
  }
  if (text.includes('acidente') || text.includes('segurança') || text.includes('capacete') || text.includes('proteção')) {
    return 'safety'
  }
  if (text.includes('tecnologia') || text.includes('inovação') || text.includes('startup') || text.includes('aplicativo')) {
    return 'technology'
  }
  if (text.includes('cidade') || text.includes('urbano') || text.includes('trânsito') || text.includes('mobilidade')) {
    return 'urban_mobility'
  }
  
  return 'general'
}

function extractTags(article: NewsAPIArticle): string[] {
  const text = `${article.title} ${article.description || ''}`.toLowerCase()
  const tags: string[] = []
  
  KEYWORDS.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      tags.push(keyword)
    }
  })
  
  return [...new Set(tags)] // Remove duplicatas
}

function calculateRelevance(article: NewsAPIArticle): number {
  let score = 0
  const text = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase()
  
  // Pontos por palavra-chave
  KEYWORDS.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      score += 10
    }
  })
  
  // Pontos por fonte confiável
  if (BRAZILIAN_SOURCES.some(source => article.source.name.toLowerCase().includes(source))) {
    score += 20
  }
  
  // Pontos por ter imagem
  if (article.urlToImage) {
    score += 5
  }
  
  // Pontos por tamanho do conteúdo
  if (article.content && article.content.length > 500) {
    score += 10
  }
  
  return Math.min(score, 100) // Máximo 100
}

export async function getLatestNews(
  category?: string,
  limit: number = 10
): Promise<NewsItem[]> {
  const cacheKey = `latest:${category || 'all'}:${limit}`
  
  // Tenta buscar do cache primeiro
  const cached = cacheManager.news.get<NewsItem[]>(cacheKey)
  if (cached) {
    newsLogger.cacheHit(cacheKey)
    return cached
  }
  
  newsLogger.cacheMiss(cacheKey)
  
  const startTime = Date.now()
  
  try {
    // Mock data for development - replace with database call when Supabase is configured
    const mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'CONTRAN publica Resolução 996: Nova era para equipamentos autopropelidos',
      description: 'Resolução regulamenta patinetes elétricos, bicicletas elétricas e ciclomotores no Brasil',
      url: 'https://portal.cfm.org.br/noticias/contran-publica-resolucao-996',
      source: 'Portal do Trânsito',
      published_at: '2023-06-15T10:00:00Z',
      category: 'regulation',
      image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
      relevance_score: 95
    },
    {
      id: '2', 
      title: 'Segurança no trânsito: Como usar patinetes elétricos corretamente',
      description: 'Especialistas dão dicas importantes para circular com segurança em equipamentos autopropelidos',
      url: 'https://g1.globo.com/transito/seguranca-patinetes-eletricos',
      source: 'G1 Trânsito',
      published_at: '2023-12-01T08:30:00Z',
      category: 'safety',
      image_url: 'https://images.unsplash.com/photo-1544191696-15693072b1d8?w=400&h=300&fit=crop',
      relevance_score: 88
    },
    {
      id: '3',
      title: 'Mercado de patinetes elétricos cresce 150% no Brasil',
      description: 'Setor de micromobilidade urbana registra crescimento expressivo após regulamentação',
      url: 'https://folha.uol.com.br/mercado/mercado-patinetes-eletricos-brasil',
      source: 'Folha de São Paulo',
      published_at: '2024-01-10T14:20:00Z',
      category: 'urban_mobility',
      image_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop',
      relevance_score: 82
    },
    {
      id: '4',
      title: 'Novas tecnologias em baterias prometem mais autonomia',
      description: 'Fabricantes investem em baterias de lítio mais eficientes para equipamentos elétricos',
      url: 'https://techtudo.uol.com.br/noticias/baterias-patinetes-eletricos',
      source: 'TechTudo',
      published_at: '2024-02-05T16:45:00Z',
      category: 'technology',
      image_url: 'https://images.unsplash.com/photo-1609178669106-2c8c5f2d0c68?w=400&h=300&fit=crop',
      relevance_score: 75
    },
    {
      id: '5',
      title: 'Prazo para regularização de ciclomotores termina em 2025',
      description: 'DETRAN orienta proprietários sobre documentação necessária para registro',
      url: 'https://uol.com.br/carros/noticias/regularizacao-ciclomotores-2025',
      source: 'UOL Carros',
      published_at: '2024-03-12T09:15:00Z',
      category: 'regulation',
      image_url: 'https://images.unsplash.com/photo-1558618666-1c0c6c9a9a7a?w=400&h=300&fit=crop',
      relevance_score: 92
    },
    {
      id: '6',
      title: 'Ciclofaixas são ampliadas em São Paulo para equipamentos autopropelidos',
      description: 'Prefeitura investe em infraestrutura para micromobilidade urbana',
      url: 'https://estadao.com.br/sao-paulo/ciclofaixas-ampliadas-patinetes',
      source: 'Estadão',
      published_at: '2024-04-08T11:30:00Z',
      category: 'urban_mobility',
      image_url: 'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?w=400&h=300&fit=crop',
      relevance_score: 79
    },
    {
      id: '7',
      title: 'Acidentes com patinetes elétricos aumentam 40% em 2024',
      description: 'Dados do SAMU mostram crescimento de ocorrências relacionadas a equipamentos de micromobilidade',
      url: 'https://r7.com/noticias/acidentes-patinetes-eletricos-2024',
      source: 'R7',
      published_at: '2024-05-15T13:20:00Z',
      category: 'safety',
      image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
      relevance_score: 91
    },
    {
      id: '8',
      title: 'Bicicletas elétricas ganham espaço no delivery brasileiro',
      description: 'Empresas de entrega adotam e-bikes para reduzir custos e impacto ambiental',
      url: 'https://cnn.com.br/business/bicicletas-eletricas-delivery-brasil',
      source: 'CNN Brasil',
      published_at: '2024-06-01T09:45:00Z',
      category: 'urban_mobility',
      image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
      relevance_score: 77
    },
    {
      id: '9',
      title: 'STF valida regulamentação de patinetes elétricos pelos municípios',
      description: 'Supremo Tribunal Federal confirma competência municipal para regulamentar equipamentos autopropelidos',
      url: 'https://metropoles.com/brasil/stf-valida-regulamentacao-patinetes',
      source: 'Metrópoles',
      published_at: '2024-04-20T16:10:00Z',
      category: 'regulation',
      image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=300&fit=crop',
      relevance_score: 89
    },
    {
      id: '10',
      title: 'Capacetes para patinetes: nova linha de produtos chega ao mercado',
      description: 'Fabricantes lançam capacetes específicos para usuários de equipamentos de micromobilidade',
      url: 'https://autoesporte.globo.com/capacetes-patinetes-eletricos',
      source: 'Auto Esporte',
      published_at: '2024-03-25T12:30:00Z',
      category: 'safety',
      image_url: 'https://images.unsplash.com/photo-1558618047-3c8c5f2d0c68?w=400&h=300&fit=crop',
      relevance_score: 73
    },
    {
      id: '11',
      title: 'Ciclomotores elétricos: alternativa sustentável para mobilidade urbana',
      description: 'Modelos elétricos ganham preferência dos consumidores por economia e sustentabilidade',
      url: 'https://terra.com.br/noticias/ciclomotores-eletricos-sustentabilidade',
      source: 'Terra',
      published_at: '2024-02-18T14:55:00Z',
      category: 'technology',
      image_url: 'https://images.unsplash.com/photo-1609178669106-2c8c5f2d0c68?w=400&h=300&fit=crop',
      relevance_score: 84
    },
    {
      id: '12',
      title: 'Aplicativo de compartilhamento de patinetes chega a 15 cidades brasileiras',
      description: 'Startup nacional expande operação de sharing de equipamentos autopropelidos',
      url: 'https://exame.com/startup/aplicativo-compartilhamento-patinetes-brasil',
      source: 'Exame',
      published_at: '2024-01-28T10:15:00Z',
      category: 'technology',
      image_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop',
      relevance_score: 78
    },
    {
      id: '13',
      title: 'Fiscalização de equipamentos autopropelidos é intensificada em capitais',
      description: 'Agentes de trânsito recebem treinamento específico para fiscalizar novos equipamentos',
      url: 'https://g1.globo.com/transito/fiscalizacao-equipamentos-autopropelidos',
      source: 'G1',
      published_at: '2024-05-08T08:20:00Z',
      category: 'regulation',
      image_url: 'https://images.unsplash.com/photo-1544191696-15693072b1d8?w=400&h=300&fit=crop',
      relevance_score: 86
    },
    {
      id: '14',
      title: 'Seguro para patinetes elétricos: proteção ainda é desafio',
      description: 'Mercado de seguros se adapta para oferecer cobertura específica para equipamentos de micromobilidade',
      url: 'https://valor.globo.com/financas/seguro-patinetes-eletricos',
      source: 'Valor Econômico',
      published_at: '2024-03-30T15:40:00Z',
      category: 'safety',
      image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
      relevance_score: 81
    },
    {
      id: '15',
      title: 'Pesquisa aponta preferência por patinetes elétricos em trajetos curtos',
      description: 'Estudo mostra que 68% dos usuários preferem equipamentos autopropelidos para distâncias até 5km',
      url: 'https://istoe.com.br/pesquisa-preferencia-patinetes-eletricos',
      source: 'IstoÉ',
      published_at: '2024-04-12T11:25:00Z',
      category: 'urban_mobility',
      image_url: 'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?w=400&h=300&fit=crop',
      relevance_score: 76
    },
    {
      id: '16',
      title: 'Baterias removíveis em bicicletas elétricas evitam furtos',
      description: 'Nova tecnologia permite que usuários removam baterias, reduzindo roubos e furtos',
      url: 'https://olhardireto.com.br/noticias/baterias-removiveis-bicicletas-eletricas',
      source: 'Olhar Direto',
      published_at: '2024-02-28T13:50:00Z',
      category: 'technology',
      image_url: 'https://images.unsplash.com/photo-1609178669106-2c8c5f2d0c68?w=400&h=300&fit=crop',
      relevance_score: 72
    },
    {
      id: '17',
      title: 'Multas por uso incorreto de patinetes elétricos aumentam 200%',
      description: 'Infrações mais comuns incluem uso em calçadas e desrespeito a sinalizações',
      url: 'https://agenciabrasil.ebc.com.br/multas-patinetes-eletricos',
      source: 'Agência Brasil',
      published_at: '2024-05-22T09:35:00Z',
      category: 'regulation',
      image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=300&fit=crop',
      relevance_score: 87
    },
    {
      id: '18',
      title: 'Mobilidade inclusiva: equipamentos adaptados para pessoas com deficiência',
      description: 'Mercado desenvolve soluções de micromobilidade para atender diferentes necessidades',
      url: 'https://deficienciavisual.com.br/mobilidade-inclusiva-equipamentos-adaptados',
      source: 'Portal da Inclusão',
      published_at: '2024-04-05T17:20:00Z',
      category: 'urban_mobility',
      image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
      relevance_score: 85
    },
    {
      id: '19',
      title: 'Tecnologia 5G impulsiona conectividade em equipamentos autopropelidos',
      description: 'Nova geração de conectividade permite recursos avançados de segurança e navegação',
      url: 'https://convergenciadigital.com.br/5g-equipamentos-autopropelidos',
      source: 'Convergência Digital',
      published_at: '2024-03-15T14:45:00Z',
      category: 'technology',
      image_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop',
      relevance_score: 79
    },
    {
      id: '20',
      title: 'Curso de capacitação para uso de equipamentos autopropelidos',
      description: 'Auto escolas começam a oferecer treinamento específico para novos condutores',
      url: 'https://transitobr.com.br/curso-capacitacao-equipamentos-autopropelidos',
      source: 'Trânsito BR',
      published_at: '2024-05-30T10:10:00Z',
      category: 'safety',
      image_url: 'https://images.unsplash.com/photo-1558618047-3c8c5f2d0c68?w=400&h=300&fit=crop',
      relevance_score: 83
    },
    {
      id: '21',
      title: 'Meio ambiente: redução de 30% nas emissões com uso de equipamentos elétricos',
      description: 'Estudo comprova impacto positivo da micromobilidade elétrica na qualidade do ar urbano',
      url: 'https://oeco.org.br/reducao-emissoes-micromobilidade-eletrica',
      source: 'O Eco',
      published_at: '2024-06-10T16:30:00Z',
      category: 'urban_mobility',
      image_url: 'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?w=400&h=300&fit=crop',
      relevance_score: 80
    },
    {
      id: '22',
      title: 'Inovação brasileira: startup desenvolve patinete elétrico dobrável',
      description: 'Empresa nacional cria modelo compacto que pode ser transportado em transporte público',
      url: 'https://startupbrasil.com.br/patinete-eletrico-dobravel-inovacao',
      source: 'Startup Brasil',
      published_at: '2024-04-18T12:55:00Z',
      category: 'technology',
      image_url: 'https://images.unsplash.com/photo-1609178669106-2c8c5f2d0c68?w=400&h=300&fit=crop',
      relevance_score: 74
    },
    {
      id: '23',
      title: 'Infraestrutura: 50 novas estações de recarga para equipamentos elétricos',
      description: 'Governo federal anuncia investimento em pontos de recarga para micromobilidade',
      url: 'https://gov.br/infraestrutura/estacoes-recarga-equipamentos-eletricos',
      source: 'Portal do Governo',
      published_at: '2024-05-25T11:40:00Z',
      category: 'urban_mobility',
      image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
      relevance_score: 88
    },
    {
      id: '24',
      title: 'Análise: impacto econômico da regulamentação de equipamentos autopropelidos',
      description: 'Setor movimentou R$ 2,3 bilhões em 2024, criando 45 mil empregos diretos e indiretos',
      url: 'https://gazeta.com.br/economia/impacto-economico-regulamentacao-autopropelidos',
      source: 'Gazeta do Povo',
      published_at: '2024-06-20T15:15:00Z',
      category: 'urban_mobility',
      image_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop',
      relevance_score: 92
    }
  ]

    let filteredNews = mockNews
    if (category && category !== 'all') {
      filteredNews = mockNews.filter(news => news.category === category)
    }

    const result = filteredNews.slice(0, limit)
    
    // Salva no cache
    cacheManager.news.set(cacheKey, result, 1800) // 30 minutos
    
    // Log da operação
    const duration = Date.now() - startTime
    newsLogger.info('GET_LATEST_NEWS', `Retrieved ${result.length} news items`, {
      category,
      limit,
      duration_ms: duration,
      cached: false
    })
    
    return result
  } catch (error) {
    newsLogger.error('GET_LATEST_NEWS', 'Error retrieving news', {
      category,
      limit,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function searchNews(
  searchTerm: string,
  filters?: SearchFilters,
  pagination?: PaginationOptions
): Promise<SearchResult<NewsItem>> {
  const cacheKey = `search:${searchTerm}:${JSON.stringify(filters)}:${JSON.stringify(pagination)}`
  
  // Tenta buscar do cache primeiro
  const cached = cacheManager.news.get<SearchResult<NewsItem>>(cacheKey)
  if (cached) {
    newsLogger.cacheHit(cacheKey)
    return cached
  }
  
  newsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    // Em produção, isso seria uma consulta ao banco
    const allNews = await getLatestNews('all', 1000) // Pega todas as notícias
    
    // Utiliza o mecanismo de busca
    const result = quickSearch(
      allNews,
      searchTerm,
      ['title', 'description', 'content', 'tags'],
      { filters, pagination }
    )
    
    // Salva no cache
    cacheManager.news.set(cacheKey, result, 900) // 15 minutos
    
    // Log da operação
    const duration = Date.now() - startTime
    newsLogger.searchQuery(searchTerm, filters || {}, result.total)
    newsLogger.info('SEARCH_NEWS', `Search completed`, {
      search_term: searchTerm,
      results_count: result.total,
      duration_ms: duration,
      cached: false
    })
    
    return result
  } catch (error) {
    newsLogger.error('SEARCH_NEWS', 'Error searching news', {
      search_term: searchTerm,
      filters,
      pagination,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

// Nova função para buscar notícias por categoria com filtros avançados
export async function getNewsByCategory(
  category: string,
  filters?: SearchFilters,
  pagination?: PaginationOptions
): Promise<SearchResult<NewsItem>> {
  const cacheKey = `category:${category}:${JSON.stringify(filters)}:${JSON.stringify(pagination)}`
  
  const cached = cacheManager.news.get<SearchResult<NewsItem>>(cacheKey)
  if (cached) {
    newsLogger.cacheHit(cacheKey)
    return cached
  }
  
  newsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const allNews = await getLatestNews('all', 1000)
    
    const categoryFilters = {
      ...filters,
      category: category === 'all' ? undefined : category
    }
    
    const result = quickSearch(
      allNews,
      '',
      ['title', 'description'],
      { filters: categoryFilters, pagination }
    )
    
    cacheManager.news.set(cacheKey, result, 1800)
    
    const duration = Date.now() - startTime
    newsLogger.info('GET_NEWS_BY_CATEGORY', `Retrieved ${result.total} news items for category ${category}`, {
      category,
      filters,
      pagination,
      duration_ms: duration,
      cached: false
    })
    
    return result
  } catch (error) {
    newsLogger.error('GET_NEWS_BY_CATEGORY', 'Error retrieving news by category', {
      category,
      filters,
      pagination,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

// Nova função para buscar notícias relacionadas
export async function getRelatedNews(newsId: string, limit: number = 5): Promise<NewsItem[]> {
  const cacheKey = `related:${newsId}:${limit}`
  
  const cached = cacheManager.news.get<NewsItem[]>(cacheKey)
  if (cached) {
    newsLogger.cacheHit(cacheKey)
    return cached
  }
  
  newsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const allNews = await getLatestNews('all', 1000)
    const currentNews = allNews.find(news => news.id === newsId)
    
    if (!currentNews) {
      return []
    }
    
    // Busca notícias relacionadas por categoria e tags
    const related = allNews
      .filter(news => news.id !== newsId)
      .map(news => {
        let score = 0
        
        // Pontos por categoria similar
        if (news.category === currentNews.category) {
          score += 10
        }
        
        // Pontos por tags similares
        const commonTags = news.tags.filter(tag => currentNews.tags.includes(tag))
        score += commonTags.length * 5
        
        // Pontos por fonte similar
        if (news.source === currentNews.source) {
          score += 3
        }
        
        return { news, score }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.news)
    
    cacheManager.news.set(cacheKey, related, 3600)
    
    const duration = Date.now() - startTime
    newsLogger.info('GET_RELATED_NEWS', `Found ${related.length} related news items`, {
      news_id: newsId,
      limit,
      duration_ms: duration,
      cached: false
    })
    
    return related
  } catch (error) {
    newsLogger.error('GET_RELATED_NEWS', 'Error retrieving related news', {
      news_id: newsId,
      limit,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

// Nova função para obter estatísticas de notícias
export async function getNewsStats(): Promise<{
  total: number
  by_category: Record<string, number>
  by_source: Record<string, number>
  recent_count: number
  top_tags: Array<{ tag: string; count: number }>
}> {
  const cacheKey = 'stats:news'
  
  const cached = cacheManager.news.get<any>(cacheKey)
  if (cached) {
    newsLogger.cacheHit(cacheKey)
    return cached
  }
  
  newsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const allNews = await getLatestNews('all', 1000)
    
    const stats = {
      total: allNews.length,
      by_category: {} as Record<string, number>,
      by_source: {} as Record<string, number>,
      recent_count: 0,
      top_tags: [] as Array<{ tag: string; count: number }>
    }
    
    const tagCounts: Record<string, number> = {}
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    for (const news of allNews) {
      // Contagem por categoria
      stats.by_category[news.category] = (stats.by_category[news.category] || 0) + 1
      
      // Contagem por fonte
      stats.by_source[news.source] = (stats.by_source[news.source] || 0) + 1
      
      // Contagem de notícias recentes
      if (new Date(news.published_at) > oneWeekAgo) {
        stats.recent_count++
      }
      
      // Contagem de tags
      for (const tag of news.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      }
    }
    
    // Top 10 tags mais utilizadas
    stats.top_tags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }))
    
    cacheManager.news.set(cacheKey, stats, 3600)
    
    const duration = Date.now() - startTime
    newsLogger.info('GET_NEWS_STATS', `Generated news statistics`, {
      total: stats.total,
      categories: Object.keys(stats.by_category).length,
      sources: Object.keys(stats.by_source).length,
      duration_ms: duration,
      cached: false
    })
    
    return stats
  } catch (error) {
    newsLogger.error('GET_NEWS_STATS', 'Error generating news statistics', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

// Função para invalidar cache de notícias
export function invalidateNewsCache(pattern?: string): number {
  const invalidated = cacheManager.news.invalidate(pattern || '.*')
  newsLogger.info('INVALIDATE_CACHE', `Invalidated ${invalidated} cache entries`, {
    pattern: pattern || 'all'
  })
  return invalidated
}