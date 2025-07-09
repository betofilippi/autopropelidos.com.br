import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NewsItem } from '@/lib/types/services'
import { newsAPIService } from '@/lib/services/newsapi'
import { aggregateNews } from '@/lib/services/news'
import type { NewsItem as DatabaseNewsItem } from '@/lib/types'

// Verificar se as APIs estão configuradas
const isNewsAPIConfigured = !!process.env.NEWS_API_KEY
const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY

// Dados mock como fallback
const mockNewsData: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Nova regulamentação para patinetes elétricos aprovada',
    description: 'Conselho Nacional de Trânsito aprova novas regras para uso de patinetes elétricos em vias públicas.',
    content: 'O Conselho Nacional de Trânsito (CONTRAN) aprovou hoje novas regulamentações para o uso de patinetes elétricos em vias públicas. As novas regras incluem...',
    url: 'https://example.com/news/1',
    image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format&q=80',
    source: 'Portal G1',
    published_at: new Date().toISOString(),
    category: 'regulation',
    tags: ['patinete', 'regulamentação', 'CONTRAN'],
    relevance_score: 95
  },
  {
    id: 'news-2',
    title: 'Mercado de bicicletas elétricas cresce 150% no Brasil',
    description: 'Vendas de bicicletas elétricas apresentam crescimento exponencial no mercado brasileiro.',
    content: 'O mercado de bicicletas elétricas no Brasil registrou um crescimento de 150% no último ano, segundo dados da Associação Brasileira dos Fabricantes de Motocicletas...',
    url: 'https://example.com/news/2',
    image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop&auto=format&q=80',
    source: 'Valor Econômico',
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    category: 'technology',
    tags: ['bicicleta elétrica', 'mercado', 'crescimento'],
    relevance_score: 88
  }
]

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || 'all'
    
    let newsData: NewsItem[] = []
    let source = 'unknown'
    
    // Tentar buscar dados reais da NewsAPI
    if (isNewsAPIConfigured) {
      try {
        console.log('🔍 Fetching real news from NewsAPI...')
        const realNews = await newsAPIService.getPortugueseNews()
        if (realNews && realNews.length > 0) {
          // Transform from database format to service format
          newsData = realNews.map((item: DatabaseNewsItem): NewsItem => ({
            id: item.id,
            title: item.title,
            description: item.excerpt,
            content: item.content,
            url: item.source_url,
            source: item.source,
            published_at: item.published_at,
            category: item.category,
            tags: [], // Database doesn't have tags, use empty array
            image_url: item.image_url || undefined,
            relevance_score: 50 // Default relevance score
          }))
          source = 'newsapi'
          console.log(`✅ Successfully fetched ${newsData.length} news articles from NewsAPI`)
        } else {
          console.log('⚠️ NewsAPI returned no data')
          source = 'newsapi_empty'
        }
      } catch (error) {
        console.error('❌ Error fetching from NewsAPI:', error)
        source = 'newsapi_failed'
      }
    } else {
      console.warn('⚠️ NewsAPI not configured - NEWS_API_KEY missing')
      source = 'newsapi_not_configured'
    }
    
    // Se não conseguiu dados da NewsAPI, usar dados do banco
    if (newsData.length === 0 && isSupabaseConfigured) {
      try {
        console.log('🔍 Fetching news from database...')
        const supabase = createAdminClient()
        const { data: dbNews, error } = await supabase
          .schema('public')
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(50)
        
        if (error) {
          console.error('❌ Database error:', error)
          source = 'database_failed'
        } else if (dbNews && dbNews.length > 0) {
          // Transform database format to service format
          newsData = dbNews.map((item: DatabaseNewsItem): NewsItem => ({
            id: item.id,
            title: item.title,
            description: item.excerpt,
            content: item.content,
            url: item.source_url,
            source: item.source,
            published_at: item.published_at,
            category: item.category,
            tags: [], // Database doesn't have tags, use empty array
            image_url: item.image_url || undefined,
            relevance_score: 50 // Default relevance score
          }))
          source = 'database'
          console.log(`✅ Successfully fetched ${newsData.length} news articles from database`)
        } else {
          console.log('⚠️ Database returned no data')
          source = 'database_empty'
        }
      } catch (error) {
        console.error('❌ Error fetching from database:', error)
        source = 'database_failed'
      }
    }
    
    // Se ainda não tem dados, usar mock
    if (newsData.length === 0) {
      console.log('⚠️ Using mock data as fallback')
      newsData = mockNewsData
      source = 'mock_fallback'
    }
    
    // Filtrar por categoria se especificada
    let filteredNews = newsData
    if (category !== 'all' && newsData.length > 0) {
      filteredNews = newsData.filter(news => news.category === category)
    }
    
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      data: filteredNews.slice(0, limit),
      metadata: {
        total: filteredNews.length,
        limit,
        category,
        timestamp: new Date().toISOString(),
        responseTime,
        source,
        configured: {
          newsapi: isNewsAPIConfigured,
          supabase: isSupabaseConfigured
        }
      }
    })
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    console.error('❌ Error in news API:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch news data',
      metadata: {
        timestamp: new Date().toISOString(),
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        configured: {
          newsapi: isNewsAPIConfigured,
          supabase: isSupabaseConfigured
        }
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { source, force_refresh } = await request.json()
    
    if (!isNewsAPIConfigured) {
      return NextResponse.json({
        success: false,
        error: 'NewsAPI not configured',
        details: 'NEWS_API_KEY environment variable is required'
      }, { status: 400 })
    }
    
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured',
        details: 'Supabase environment variables are required'
      }, { status: 400 })
    }
    
    console.log('🔄 Starting news aggregation...')
    
    // Executar agregação real de notícias
    const result = await aggregateNews()
    
    console.log('✅ News aggregation completed:', result)
    
    return NextResponse.json({
      success: result.success,
      message: `Synchronized ${result.processed || 0} news articles`,
      data: {
        synced_count: result.processed || 0,
        source: source || 'newsapi',
        force_refresh: force_refresh || false,
        last_sync: new Date().toISOString(),
        errors: result.errors || []
      }
    })
    
  } catch (error) {
    console.error('❌ Error in news sync:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to sync news data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}