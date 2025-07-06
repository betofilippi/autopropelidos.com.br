import type { NewsAPIResponse, NewsAPIArticle } from '@/lib/types/api'
import { createClient } from '@/lib/supabase/server'

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
) {
  // Use mock data for now until Supabase is properly configured
  console.log('Using mock data for news - Supabase not configured')
  return getMockNews(category, limit)
  
  /* 
  // Commented out until Supabase is configured
  const supabase = await createClient()
  
  try {
    let query = supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit)
    
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching news from database:', error)
      // Fallback to mock data if database fails
      return getMockNews(category, limit)
    }
    
    return data || []
  } catch (error) {
    console.error('Database connection error:', error)
    // Fallback to mock data if database connection fails
    return getMockNews(category, limit)
  }
  */
}

function getMockNews(category?: string, limit: number = 10) {
  const mockNews = [
    {
      id: '1',
      title: 'CONTRAN publica Resolução 996: Nova era para equipamentos autopropelidos',
      description: 'Resolução regulamenta patinetes elétricos, bicicletas elétricas e ciclomotores no Brasil',
      url: 'https://example.com/news/1',
      source: 'Portal do Trânsito',
      published_at: '2023-06-15T10:00:00Z',
      category: 'regulation',
      image_url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=500&h=300&fit=crop&crop=center',
      relevance_score: 95
    },
    {
      id: '2', 
      title: 'Segurança no trânsito: Como usar patinetes elétricos corretamente',
      description: 'Especialistas dão dicas importantes para circular com segurança em equipamentos autopropelidos',
      url: 'https://example.com/news/2',
      source: 'G1 Trânsito',
      published_at: '2023-12-01T08:30:00Z',
      category: 'safety',
      image_url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=500&h=300&fit=crop&crop=center',
      relevance_score: 88
    },
    {
      id: '3',
      title: 'Mercado de patinetes elétricos cresce 150% no Brasil',
      description: 'Setor de micromobilidade urbana registra crescimento expressivo após regulamentação',
      url: 'https://example.com/news/3',
      source: 'Folha de São Paulo',
      published_at: '2024-01-10T14:20:00Z',
      category: 'urban_mobility',
      image_url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=500&h=300&fit=crop&crop=center',
      relevance_score: 82
    },
    {
      id: '4',
      title: 'Novas tecnologias em baterias prometem mais autonomia',
      description: 'Fabricantes investem em baterias de lítio mais eficientes para equipamentos elétricos',
      url: 'https://example.com/news/4',
      source: 'TechTudo',
      published_at: '2024-02-05T16:45:00Z',
      category: 'technology',
      image_url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=500&h=300&fit=crop&crop=center',
      relevance_score: 75
    },
    {
      id: '5',
      title: 'Prazo para regularização de ciclomotores termina em 2025',
      description: 'DETRAN orienta proprietários sobre documentação necessária para registro',
      url: 'https://example.com/news/5',
      source: 'UOL Carros',
      published_at: '2024-03-12T09:15:00Z',
      category: 'regulation',
      image_url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=500&h=300&fit=crop&crop=center',
      relevance_score: 92
    },
    {
      id: '6',
      title: 'Ciclofaixas são ampliadas em São Paulo para equipamentos autopropelidos',
      description: 'Prefeitura investe em infraestrutura para micromobilidade urbana',
      url: 'https://example.com/news/6',
      source: 'Estadão',
      published_at: '2024-04-08T11:30:00Z',
      category: 'urban_mobility',
      image_url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=500&h=300&fit=crop&crop=center',
      relevance_score: 79
    }
  ]

  let filteredNews = mockNews
  if (category && category !== 'all') {
    filteredNews = mockNews.filter(news => news.category === category)
  }

  return filteredNews.slice(0, limit)
}

export async function searchNews(searchTerm: string) {
  // Use mock data for now until Supabase is properly configured
  console.log('Using mock search for news - Supabase not configured')
  const allNews = getMockNews()
  
  const filteredNews = allNews.filter(news => 
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return filteredNews.slice(0, 20)
  
  /*
  // Commented out until Supabase is configured
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
    .order('relevance_score', { ascending: false })
    .limit(20)
  
  if (error) {
    console.error('Error searching news:', error)
    return []
  }
  
  return data || []
  */
}