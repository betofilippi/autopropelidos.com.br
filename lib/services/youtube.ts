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

export async function aggregateYouTubeVideos(): Promise<{ success: boolean; processed: number; errors: string[] }> {
  const startTime = Date.now()
  const errors: string[] = []
  let processed = 0
  
  if (!YOUTUBE_API_KEY) {
    const error = 'YOUTUBE_API_KEY not configured'
    console.error('AGGREGATE_YOUTUBE', error)
    return { success: false, processed: 0, errors: [error] }
  }

  try {
    // Durante o build, não tenta conectar ao Supabase
    if (typeof window === 'undefined') {
      return { success: true, processed: 0, errors: ['Build time - skipping database operations'] }
    }
    
    const supabase = await createClient()
    const allVideos: YouTubeVideo[] = []

    // Buscar vídeos para cada termo
    for (const query of SEARCH_QUERIES) {
      try {
        const searchData = await searchYouTubeVideos(query, 5)
        if (searchData && searchData.items) {
          allVideos.push(...searchData.items)
          console.log(`Fetched ${searchData.items.length} videos for query: ${query}`)
        }
      } catch (error) {
        const errorMsg = `Error fetching videos for query ${query}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMsg)
        console.error('AGGREGATE_YOUTUBE', errorMsg)
      }
    }

    // Buscar vídeos de canais confiáveis
    for (const channelId of TRUSTED_CHANNELS) {
      try {
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

        const response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${params}`)
        if (response.ok) {
          const data = await response.json()
          if (data.items) {
            allVideos.push(...data.items)
            console.log(`Fetched ${data.items.length} videos from channel: ${channelId}`)
          }
        }
      } catch (error) {
        const errorMsg = `Error fetching videos from channel ${channelId}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMsg)
        console.error('AGGREGATE_YOUTUBE', errorMsg)
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
      try {
        const details = videoDetails?.items?.find((d: any) => d.id === video.id.videoId)
        const category = categorizeVideo(video)
        const relevanceScore = calculateVideoRelevance(video)
        
        // Verificar se o vídeo já existe
        const { data: existing } = await supabase
          .from('videos')
          .select('id')
          .eq('youtube_id', video.id.videoId)
          .single()

        if (!existing) {
          const { error } = await supabase.from('videos').insert({
            youtube_id: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            channel_name: video.snippet.channelTitle,
            channel_id: video.snippet.channelId,
            thumbnail_url: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
            published_at: video.snippet.publishedAt,
            duration: details?.contentDetails?.duration,
            view_count: details?.statistics?.viewCount ? parseInt(details.statistics.viewCount) : null,
            category,
            tags: video.snippet.tags || [],
            relevance_score: relevanceScore
          })
          
          if (error) {
            throw error
          }
          
          processed++
          console.log(`Saved video: ${video.snippet.title}`)
        }
      } catch (error) {
        const errorMsg = `Error saving video ${video.snippet.title}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMsg)
        console.error('AGGREGATE_YOUTUBE', errorMsg)
      }
    }

    const duration = Date.now() - startTime
    const success = errors.length === 0
    
    console.log('AGGREGATE_YOUTUBE', `Aggregation completed`, {
      processed,
      total_videos: allVideos.length,
      unique_videos: uniqueVideos.length,
      errors: errors.length,
      duration_ms: duration,
      success
    })

    return { success, processed, errors }
  } catch (error) {
    const errorMsg = `Critical error in aggregateYouTubeVideos: ${error instanceof Error ? error.message : 'Unknown error'}`
    errors.push(errorMsg)
    console.error('AGGREGATE_YOUTUBE', errorMsg)
    return { success: false, processed, errors }
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

export async function getLatestVideos(
  category?: string,
  limit: number = 10
) {
  // Durante o build (processo do servidor), sempre usar mock data
  if (typeof window === 'undefined') {
    const mockVideos = [
    {
      id: '1',
      youtube_id: 'dQw4w9WgXcQ',
      title: 'Resolução 996 do CONTRAN Explicada - Tudo sobre Equipamentos Autopropelidos',
      description: 'Entenda completamente a nova regulamentação que define patinetes elétricos, bicicletas elétricas e ciclomotores',
      channel_name: 'Portal do Trânsito Oficial',
      channel_id: 'UC1234567890',
      thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
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
      thumbnail_url: 'https://img.youtube.com/vi/abc123def456/mqdefault.jpg',
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
      thumbnail_url: 'https://img.youtube.com/vi/ghi789jkl012/mqdefault.jpg',
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
      thumbnail_url: 'https://img.youtube.com/vi/mno345pqr678/mqdefault.jpg',
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
      thumbnail_url: 'https://img.youtube.com/vi/stu901vwx234/mqdefault.jpg',
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
      thumbnail_url: 'https://img.youtube.com/vi/yza567bcd890/mqdefault.jpg',
      published_at: '2024-03-05T16:30:00Z',
      duration: 'PT10M40S',
      view_count: 45000,
      category: 'tutorial',
      tags: ['documentação', 'ciclomotor', 'DETRAN'],
      relevance_score: 94
    },
    {
      id: '7',
      youtube_id: 'qwerty123456',
      title: 'Patinetes Elétricos: Mudanças na Lei de Trânsito 2024',
      description: 'Análise das principais alterações no Código de Trânsito Brasileiro para equipamentos autopropelidos',
      channel_name: 'Especialista em Trânsito',
      channel_id: 'UC_EspecialistaTransito',
      thumbnail_url: 'https://img.youtube.com/vi/qwerty123456/mqdefault.jpg',
      published_at: '2024-01-15T10:00:00Z',
      duration: 'PT14M18S',
      view_count: 78000,
      category: 'educational',
      tags: ['lei de trânsito', 'mudanças', 'patinetes elétricos'],
      relevance_score: 91
    },
    {
      id: '8',
      youtube_id: 'asdfgh789012',
      title: 'Unboxing: Patinete Elétrico Xiaomi Mi Pro 2 - Vale a Pena?',
      description: 'Teste completo do popular patinete elétrico Xiaomi, incluindo performance, autonomia e segurança',
      channel_name: 'TechReview Brasil',
      channel_id: 'UC_TechReviewBR',
      thumbnail_url: 'https://img.youtube.com/vi/asdfgh789012/mqdefault.jpg',
      published_at: '2024-02-10T14:25:00Z',
      duration: 'PT16M50S',
      view_count: 142000,
      category: 'review',
      tags: ['unboxing', 'xiaomi', 'patinete elétrico', 'teste'],
      relevance_score: 82
    },
    {
      id: '9',
      youtube_id: 'zxcvbn345678',
      title: 'Manutenção de Bicicletas Elétricas: Guia Prático',
      description: 'Como manter sua e-bike em perfeito estado: limpeza, lubrificação e cuidados com a bateria',
      channel_name: 'Bike Mecânica',
      channel_id: 'UC_BikeMecanica',
      thumbnail_url: 'https://img.youtube.com/vi/zxcvbn345678/mqdefault.jpg',
      published_at: '2024-03-20T09:15:00Z',
      duration: 'PT11M30S',
      view_count: 56000,
      category: 'tutorial',
      tags: ['manutenção', 'bicicleta elétrica', 'bateria'],
      relevance_score: 79
    },
    {
      id: '10',
      youtube_id: 'mnbvcx901234',
      title: 'Reportagem: Boom dos Patinetes Elétricos no Brasil',
      description: 'Investigação sobre o crescimento exponencial do mercado de patinetes elétricos no país',
      channel_name: 'Fantástico',
      channel_id: 'UC_Fantastico',
      thumbnail_url: 'https://img.youtube.com/vi/mnbvcx901234/mqdefault.jpg',
      published_at: '2024-04-05T20:30:00Z',
      duration: 'PT13M45S',
      view_count: 298000,
      category: 'news_report',
      tags: ['reportagem', 'mercado', 'crescimento'],
      relevance_score: 87
    },
    {
      id: '11',
      youtube_id: 'poiuyt567890',
      title: 'Ciclomotores: Como Escolher o Modelo Ideal',
      description: 'Guia completo para escolher o ciclomotor perfeito para suas necessidades de mobilidade urbana',
      channel_name: 'Mobilidade Urbana TV',
      channel_id: 'UC_MobilidadeUrbana',
      thumbnail_url: 'https://img.youtube.com/vi/poiuyt567890/mqdefault.jpg',
      published_at: '2024-03-10T16:45:00Z',
      duration: 'PT19M20S',
      view_count: 73000,
      category: 'tutorial',
      tags: ['ciclomotor', 'escolha', 'mobilidade urbana'],
      relevance_score: 83
    },
    {
      id: '12',
      youtube_id: 'lkjhgf432109',
      title: 'Segurança Digital: Apps para Patinetes e Bicicletas Elétricas',
      description: 'Análise dos melhores aplicativos para monitorar e proteger seus equipamentos de micromobilidade',
      channel_name: 'Segurança Digital',
      channel_id: 'UC_SegurancaDigital',
      thumbnail_url: 'https://img.youtube.com/vi/lkjhgf432109/mqdefault.jpg',
      published_at: '2024-04-18T12:00:00Z',
      duration: 'PT8M55S',
      view_count: 42000,
      category: 'analysis',
      tags: ['aplicativos', 'segurança', 'tecnologia'],
      relevance_score: 75
    },
    {
      id: '13',
      youtube_id: 'rewqas876543',
      title: 'Debate: Patinetes Elétricos nas Calçadas - Permitir ou Proibir?',
      description: 'Discussão sobre o uso de patinetes elétricos em espaços públicos com especialistas e autoridades',
      channel_name: 'Debate Nacional',
      channel_id: 'UC_DebateNacional',
      thumbnail_url: 'https://img.youtube.com/vi/rewqas876543/mqdefault.jpg',
      published_at: '2024-05-02T19:15:00Z',
      duration: 'PT25M40S',
      view_count: 187000,
      category: 'analysis',
      tags: ['debate', 'calçadas', 'regulamentação'],
      relevance_score: 89
    },
    {
      id: '14',
      youtube_id: 'tgbyhn098765',
      title: 'Bicicletas Elétricas vs Patinetes: Qual é Melhor?',
      description: 'Comparação completa entre bicicletas elétricas e patinetes elétricos para diferentes perfis de usuários',
      channel_name: 'Comparativos Tech',
      channel_id: 'UC_ComparativosTech',
      thumbnail_url: 'https://img.youtube.com/vi/tgbyhn098765/mqdefault.jpg',
      published_at: '2024-05-15T13:30:00Z',
      duration: 'PT17M12S',
      view_count: 114000,
      category: 'review',
      tags: ['comparação', 'bicicleta vs patinete', 'análise'],
      relevance_score: 84
    },
    {
      id: '15',
      youtube_id: 'vfrcde210987',
      title: 'Entrevista: Futuro da Mobilidade Urbana no Brasil',
      description: 'Conversa com especialista sobre as tendências e o futuro dos equipamentos autopropelidos no país',
      channel_name: 'Futuro Hoje',
      channel_id: 'UC_FuturoHoje',
      thumbnail_url: 'https://img.youtube.com/vi/vfrcde210987/mqdefault.jpg',
      published_at: '2024-05-28T15:45:00Z',
      duration: 'PT21M35S',
      view_count: 95000,
      category: 'educational',
      tags: ['futuro', 'mobilidade', 'especialista'],
      relevance_score: 81
    },
    {
      id: '16',
      youtube_id: 'bgtyhn543210',
      title: 'Acidentes com Equipamentos Autopropelidos: Estatísticas 2024',
      description: 'Análise detalhada dos dados de acidentes envolvendo patinetes e bicicletas elétricas no Brasil',
      channel_name: 'Estatísticas do Trânsito',
      channel_id: 'UC_EstatisticasTransito',
      thumbnail_url: 'https://img.youtube.com/vi/bgtyhn543210/mqdefault.jpg',
      published_at: '2024-06-08T11:20:00Z',
      duration: 'PT12M18S',
      view_count: 67000,
      category: 'analysis',
      tags: ['estatísticas', 'acidentes', 'dados'],
      relevance_score: 86
    },
    {
      id: '17',
      youtube_id: 'nhujmi876543',
      title: 'DIY: Customização de Patinetes Elétricos',
      description: 'Tutorial sobre como personalizar e melhorar seu patinete elétrico com acessórios e modificações',
      channel_name: 'DIY Mobilidade',
      channel_id: 'UC_DIYMobilidade',
      thumbnail_url: 'https://img.youtube.com/vi/nhujmi876543/mqdefault.jpg',
      published_at: '2024-04-25T14:10:00Z',
      duration: 'PT15M55S',
      view_count: 38000,
      category: 'tutorial',
      tags: ['DIY', 'customização', 'modificações'],
      relevance_score: 71
    },
    {
      id: '18',
      youtube_id: 'qazwsx109876',
      title: 'Economia Verde: Impacto Ambiental dos Equipamentos Elétricos',
      description: 'Estudo sobre os benefícios ambientais da substituição de veículos a combustão por equipamentos elétricos',
      channel_name: 'Planeta Verde',
      channel_id: 'UC_PlanetaVerde',
      thumbnail_url: 'https://img.youtube.com/vi/qazwsx109876/mqdefault.jpg',
      published_at: '2024-06-12T10:30:00Z',
      duration: 'PT18M42S',
      view_count: 89000,
      category: 'educational',
      tags: ['meio ambiente', 'sustentabilidade', 'economia verde'],
      relevance_score: 78
    }
  ]

    let filteredVideos = mockVideos
    if (category && category !== 'all') {
      filteredVideos = mockVideos.filter(video => video.category === category)
    }

    return filteredVideos.slice(0, limit)
  }
  
  // Durante o build, pula a consulta ao banco para evitar erros
  if (YOUTUBE_API_KEY && typeof window !== 'undefined') {
    try {
      const supabase = await createClient()
      let query = supabase
        .from('videos')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit)

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (!error && data && data.length > 0) {
        return data
      }
    } catch (dbError) {
      console.error('Database error, falling back to mock data:', dbError)
    }
  }
  
  // Fallback para mock data se não houver API key ou dados no banco
  const mockVideos = [
    {
      id: '1',
      youtube_id: 'dQw4w9WgXcQ',
      title: 'Resolução 996 do CONTRAN Explicada - Tudo sobre Equipamentos Autopropelidos',
      description: 'Entenda completamente a nova regulamentação que define patinetes elétricos, bicicletas elétricas e ciclomotores',
      channel_name: 'Portal do Trânsito Oficial',
      channel_id: 'UC1234567890',
      thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      published_at: '2023-06-20T15:30:00Z',
      duration: 'PT8M45S',
      view_count: 125000,
      category: 'educational',
      tags: ['CONTRAN', '996', 'regulamentação', 'autopropelidos'],
      relevance_score: 98
    }
  ]

  let filteredVideos = mockVideos
  if (category && category !== 'all') {
    filteredVideos = mockVideos.filter(video => video.category === category)
  }

  return filteredVideos.slice(0, limit)
}

export async function searchVideos(searchTerm: string) {
  try {
    // Durante o build, retorna array vazio
    if (typeof window === 'undefined') {
      return []
    }
    
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
  } catch (error) {
    console.error('Error in searchVideos:', error)
    return []
  }
}