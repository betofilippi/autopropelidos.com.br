import { Video } from '@/lib/types'
import type { YouTubeSearchResponse, YouTubeVideo } from '@/lib/types/api'
import { createClient } from '@/lib/supabase/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3'

// Canais confiáveis de notícias e análises
const TRUSTED_CHANNELS = [
  'UCX8pU3lBmmGiEchT8kq_LrQ', // Band Jornalismo
  'UCoa-D_VfMkFrCYodrOC9-mA', // Jornal da Record
  'UCG1QNnL7s6MYqHSoBl7LRbQ', // CNN Brasil
  'UC08cNmV6kNFGKcFM0sWTqTg', // Jovem Pan News
  'UCFFasG7aLweCJcktLoveydA', // SBT News
]

// Termos de busca otimizados
const SEARCH_QUERIES = [
  'patinete elétrico brasil',
  'bicicleta elétrica regulamentação',
  'CONTRAN 996',
  'autopropelidos brasil',
  'mobilidade urbana elétrica',
  'ciclomotor brasil',
  'segurança patinete elétrico',
  'acidente patinete elétrico brasil',
  'lei patinete elétrico'
]

export async function searchYouTubeVideos(
  query: string,
  maxResults: number = 10,
  pageToken?: string
): Promise<YouTubeSearchResponse | null> {
  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      videoDuration: 'medium,long', // Vídeos médios e longos (mais informativos)
      relevanceLanguage: 'pt',
      regionCode: 'BR',
      maxResults: maxResults.toString(),
      order: 'date',
      publishedAfter: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // Último ano
      key: YOUTUBE_API_KEY
    })

    if (pageToken) {
      params.append('pageToken', pageToken)
    }

    const response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${params}`, {
      next: { revalidate: 3600 } // Cache por 1 hora
    })

    if (!response.ok) {
      console.error('YouTube API error:', response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return null
  }
}

export async function getVideoDetails(videoIds: string[]): Promise<any> {
  try {
    const params = new URLSearchParams({
      part: 'contentDetails,statistics',
      id: videoIds.join(','),
      key: YOUTUBE_API_KEY
    })

    const response = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${params}`)
    
    if (!response.ok) {
      console.error('YouTube API error:', response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching video details:', error)
    return null
  }
}

export async function aggregateYouTubeVideos() {
  const supabase = await createClient()
  const allVideos: YouTubeVideo[] = []

  // Buscar vídeos para cada termo
  for (const query of SEARCH_QUERIES) {
    const searchData = await searchYouTubeVideos(query, 5)
    if (searchData && searchData.items) {
      allVideos.push(...searchData.items)
    }
  }

  // Buscar vídeos de canais confiáveis
  for (const channelId of TRUSTED_CHANNELS) {
    const channelQuery = `patinete elétrico OR bicicleta elétrica OR mobilidade urbana`
    const params = new URLSearchParams({
      part: 'snippet',
      channelId: channelId,
      q: channelQuery,
      type: 'video',
      maxResults: '5',
      order: 'date',
      key: YOUTUBE_API_KEY
    })

    try {
      const response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        if (data.items) {
          allVideos.push(...data.items)
        }
      }
    } catch (error) {
      console.error(`Error fetching videos from channel ${channelId}:`, error)
    }
  }

  // Filtrar duplicatas
  const uniqueVideos = Array.from(
    new Map(allVideos.map(video => [video.id.videoId, video])).values()
  )

  // Obter detalhes adicionais dos vídeos
  const videoIds = uniqueVideos.map(v => v.id.videoId)
  const videoDetails = await getVideoDetails(videoIds)
  
  // Salvar no banco
  for (const video of uniqueVideos) {
    const details = videoDetails?.items?.find((d: any) => d.id === video.id.videoId)
    const category = categorizeVideo(video)
    const relevanceScore = calculateVideoRelevance(video)
    
    // Verificar se o vídeo já existe
    const { data: existing } = await supabase
      .from('"autopropelidos.com.br"."videos"')
      .select('id')
      .eq('youtube_id', video.id.videoId)
      .single()

    if (!existing) {
      await supabase.from('"autopropelidos.com.br"."videos"').insert({
        youtube_id: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        channel_name: video.snippet.channelTitle,
        channel_id: video.snippet.channelId,
        thumbnail_url: video.snippet.thumbnails.high.url,
        published_at: video.snippet.publishedAt,
        duration: details?.contentDetails?.duration,
        view_count: details?.statistics?.viewCount ? parseInt(details.statistics.viewCount) : null,
        category,
        tags: video.snippet.tags || [],
        relevance_score: relevanceScore
      })
    }
  }
}

function categorizeVideo(video: YouTubeVideo): string {
  const text = `${video.snippet.title} ${video.snippet.description}`.toLowerCase()
  
  if (text.includes('jornal') || text.includes('notícia') || text.includes('reportagem')) {
    return 'news_report'
  }
  if (text.includes('como') || text.includes('tutorial') || text.includes('passo a passo')) {
    return 'tutorial'
  }
  if (text.includes('review') || text.includes('análise') || text.includes('teste')) {
    return 'review'
  }
  if (text.includes('lei') || text.includes('regulamenta') || text.includes('norma')) {
    return 'educational'
  }
  
  return 'analysis'
}

function calculateVideoRelevance(video: YouTubeVideo): number {
  let score = 0
  const text = `${video.snippet.title} ${video.snippet.description}`.toLowerCase()
  
  // Pontos por palavras-chave relevantes
  const keywords = ['contran', '996', 'regulamenta', 'lei', 'segurança', 'mobilidade']
  keywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 15
    }
  })
  
  // Pontos por canal confiável
  if (TRUSTED_CHANNELS.includes(video.snippet.channelId)) {
    score += 30
  }
  
  // Pontos por data recente (últimos 6 meses)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  if (new Date(video.snippet.publishedAt) > sixMonthsAgo) {
    score += 20
  }
  
  return Math.min(score, 100)
}

// New service class for better organization and quota management
export class YouTubeService {
  private quotaUsed = 0
  private quotaResetTime = Date.now() + 24 * 60 * 60 * 1000
  private readonly DAILY_QUOTA_LIMIT = 10000
  private readonly SEARCH_COST = 100
  private readonly VIDEO_DETAILS_COST = 1
  private cache = new Map<string, { data: Video[], timestamp: number }>()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

  private checkQuota(cost: number): void {
    const now = Date.now()
    if (now > this.quotaResetTime) {
      this.quotaUsed = 0
      this.quotaResetTime = now + 24 * 60 * 60 * 1000
    }

    if (this.quotaUsed + cost > this.DAILY_QUOTA_LIMIT) {
      throw new Error('YouTube API quota exceeded. Please try again tomorrow.')
    }
  }

  private updateQuotaUsage(cost: number): void {
    this.quotaUsed += cost
  }

  private parseDuration(duration: string): string {
    // Convert ISO 8601 duration to human-readable format
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return '0:00'

    const hours = match[1] ? parseInt(match[1]) : 0
    const minutes = match[2] ? parseInt(match[2]) : 0
    const seconds = match[3] ? parseInt(match[3]) : 0

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  async searchVideosWithDetails(query: string, maxResults: number = 25): Promise<Video[]> {
    // Check cache first
    const cacheKey = query
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    try {
      this.checkQuota(this.SEARCH_COST)
      
      const searchResults = await searchYouTubeVideos(query, maxResults)
      if (!searchResults || !searchResults.items) {
        return []
      }

      this.updateQuotaUsage(this.SEARCH_COST)

      const videoIds = searchResults.items.map(v => v.id.videoId)
      const details = await this.getVideoDetailsWithQuota(videoIds)

      const videos: Video[] = searchResults.items.map(video => {
        const detail = details?.items?.find((d: any) => d.id === video.id.videoId)
        return {
          id: '', // Will be generated by Supabase
          youtube_id: video.id.videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail_url: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
          channel_name: video.snippet.channelTitle,
          channel_id: video.snippet.channelId,
          duration: detail ? this.parseDuration(detail.contentDetails.duration) : '0:00',
          views: detail && detail.statistics?.viewCount ? parseInt(detail.statistics.viewCount) : 0,
          published_at: video.snippet.publishedAt,
          created_at: new Date().toISOString(),
        }
      })

      // Update cache
      this.cache.set(cacheKey, {
        data: videos,
        timestamp: Date.now(),
      })

      return videos
    } catch (error) {
      console.error('Error fetching videos from YouTube:', error)
      throw error
    }
  }

  private async getVideoDetailsWithQuota(videoIds: string[]): Promise<any> {
    if (videoIds.length === 0) return { items: [] }

    this.checkQuota(this.VIDEO_DETAILS_COST * Math.ceil(videoIds.length / 50))
    const details = await getVideoDetails(videoIds)
    this.updateQuotaUsage(this.VIDEO_DETAILS_COST * Math.ceil(videoIds.length / 50))
    
    return details
  }

  async searchMultipleQueries(queries: string[]): Promise<Video[]> {
    const allVideos: Video[] = []
    const seenIds = new Set<string>()

    for (const query of queries) {
      try {
        const videos = await this.searchVideosWithDetails(query, 10)
        
        // Filter out duplicates
        for (const video of videos) {
          if (!seenIds.has(video.youtube_id)) {
            seenIds.add(video.youtube_id)
            allVideos.push(video)
          }
        }
      } catch (error) {
        console.error(`Error fetching videos for query "${query}":`, error)
        // Continue with other queries even if one fails
      }
    }

    // Sort by views (most viewed first)
    return allVideos.sort((a, b) => (b.views || 0) - (a.views || 0))
  }

  async getRelevantVideos(): Promise<Video[]> {
    const queries = [
      'patinete eletrico',
      'bicicleta eletrica',
      'mobilidade urbana',
      'CONTRAN 996',
      'autopropelidos',
    ]

    return this.searchMultipleQueries(queries)
  }

  getQuotaStatus(): { used: number; limit: number; resetTime: Date } {
    return {
      used: this.quotaUsed,
      limit: this.DAILY_QUOTA_LIMIT,
      resetTime: new Date(this.quotaResetTime),
    }
  }
}

export const youTubeService = new YouTubeService()

export async function getLatestVideos(
  category?: string,
  limit: number = 10
) {
  // Use mock data for now until Supabase is properly configured
  console.log('Using mock data for videos - Supabase not configured')
  return getMockVideos(category, limit)
  
  /*
  // Commented out until Supabase is configured
  const supabase = await createClient()
  
  try {
    let query = supabase
      .from('videos')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit)
    
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching videos from database:', error)
      // Fallback to mock data if database fails
      return getMockVideos(category, limit)
    }
    
    return data || []
  } catch (error) {
    console.error('Database connection error:', error)
    // Fallback to mock data if database connection fails
    return getMockVideos(category, limit)
  }
  */
}

function getMockVideos(category?: string, limit: number = 10) {
  const mockVideos = [
    {
      id: '1',
      youtube_id: 'dQw4w9WgXcQ',
      title: 'Resolução 996 do CONTRAN Explicada - Tudo sobre Equipamentos Autopropelidos',
      description: 'Entenda completamente a nova regulamentação que define patinetes elétricos, bicicletas elétricas e ciclomotores',
      channel_name: 'Portal do Trânsito Oficial',
      channel_id: 'UC1234567890',
      thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=300&fit=crop&crop=center',
      published_at: '2023-06-20T15:30:00Z',
      duration: 'PT8M45S',
      view_count: 125000,
      category: 'educational',
      tags: ['CONTRAN', '996', 'regulamentação', 'autopropelidos'],
      relevance_score: 98
    },
    {
      id: '2',
      youtube_id: 'abc123def456',
      title: 'Como Usar Patinete Elétrico com Segurança - Guia Completo',
      description: 'Dicas essenciais de segurança para circular com patinetes elétricos nas ruas e ciclofaixas',
      channel_name: 'Jornal da Band',
      channel_id: 'UCX8pU3lBmmGiEchT8kq_LrQ',
      thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=300&fit=crop&crop=center',
      published_at: '2023-11-15T09:20:00Z',
      duration: 'PT12M30S',
      view_count: 89000,
      category: 'tutorial',
      tags: ['segurança', 'patinete elétrico', 'trânsito'],
      relevance_score: 92
    },
    {
      id: '3',
      youtube_id: 'ghi789jkl012',
      title: 'Teste: Melhores Bicicletas Elétricas de 2024',
      description: 'Análise completa dos modelos mais populares de e-bikes disponíveis no mercado brasileiro',
      channel_name: 'Auto Esporte',
      channel_id: 'UC08cNmV6kNFGKcFM0sWTqTg',
      thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=300&fit=crop&crop=center',
      published_at: '2024-01-08T14:15:00Z',
      duration: 'PT18M22S',
      view_count: 156000,
      category: 'review',
      tags: ['bicicleta elétrica', 'teste', 'review'],
      relevance_score: 85
    },
    {
      id: '4',
      youtube_id: 'mno345pqr678',
      title: 'Acidente com Patinete: O que Fazer e Como Evitar',
      description: 'Reportagem especial sobre acidentes com equipamentos de micromobilidade e medidas preventivas',
      channel_name: 'Record News',
      channel_id: 'UCoa-D_VfMkFrCYodrOC9-mA',
      thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=300&fit=crop&crop=center',
      published_at: '2023-09-22T20:45:00Z',
      duration: 'PT15M10S',
      view_count: 67000,
      category: 'news_report',
      tags: ['acidente', 'segurança', 'prevenção'],
      relevance_score: 88
    },
    {
      id: '5',
      youtube_id: 'stu901vwx234',
      title: 'Mobilidade Urbana: O Futuro das Cidades Inteligentes',
      description: 'Como os equipamentos autopropelidos estão transformando o transporte urbano no Brasil',
      channel_name: 'CNN Brasil',
      channel_id: 'UCG1QNnL7s6MYqHSoBl7LRbQ',
      thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=300&fit=crop&crop=center',
      published_at: '2024-02-28T11:00:00Z',
      duration: 'PT22M15S',
      view_count: 203000,
      category: 'analysis',
      tags: ['mobilidade urbana', 'futuro', 'cidades inteligentes'],
      relevance_score: 79
    },
    {
      id: '6',
      youtube_id: 'yza567bcd890',
      title: 'Documentação para Ciclomotores: Passo a Passo Completo',
      description: 'Tutorial detalhado sobre como regularizar seu ciclomotor conforme a nova legislação',
      channel_name: 'DETRAN Oficial',
      channel_id: 'UC98765432100',
      thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=300&fit=crop&crop=center',
      published_at: '2024-03-05T16:30:00Z',
      duration: 'PT10M40S',
      view_count: 45000,
      category: 'tutorial',
      tags: ['documentação', 'ciclomotor', 'DETRAN'],
      relevance_score: 94
    }
  ]

  let filteredVideos = mockVideos
  if (category && category !== 'all') {
    filteredVideos = mockVideos.filter(video => video.category === category)
  }

  return filteredVideos.slice(0, limit)
}

export async function searchVideos(searchTerm: string) {
  // Use mock data for now until Supabase is properly configured
  console.log('Using mock search for videos - Supabase not configured')
  const allVideos = getMockVideos()
  
  const filteredVideos = allVideos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return filteredVideos.slice(0, 20)
  
  /*
  // Commented out until Supabase is configured
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('relevance_score', { ascending: false })
    .limit(20)
  
  if (error) {
    console.error('Error searching videos:', error)
    return []
  }
  
  return data || []
  */
}