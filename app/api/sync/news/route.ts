import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NewsItem } from '@/lib/types/services'

// Mock news data - em produção, você conectaria com APIs reais
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
  },
  {
    id: 'news-3',
    title: 'Acidentes com equipamentos de mobilidade aumentam 30%',
    description: 'Estudo mostra crescimento nos acidentes envolvendo patinetes e bicicletas elétricas.',
    content: 'Um estudo realizado pela Secretaria Nacional de Trânsito mostra que os acidentes envolvendo equipamentos de mobilidade urbana aumentaram 30% no último trimestre...',
    url: 'https://example.com/news/3',
    image_url: 'https://images.unsplash.com/photo-1543762996-8e14c13a8cb8?w=800&h=600&fit=crop&auto=format&q=80',
    source: 'Folha de S.Paulo',
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'safety',
    tags: ['segurança', 'acidentes', 'mobilidade'],
    relevance_score: 82
  },
  {
    id: 'news-4',
    title: 'Novas ciclovias para bicicletas elétricas em São Paulo',
    description: 'Prefeitura de São Paulo anuncia expansão da rede de ciclovias para equipamentos elétricos.',
    content: 'A Prefeitura de São Paulo anunciou hoje a expansão da rede de ciclovias com foco em equipamentos elétricos...',
    url: 'https://example.com/news/4',
    image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format&q=80',
    source: 'Estadão',
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'urban_mobility',
    tags: ['ciclovia', 'São Paulo', 'infraestrutura'],
    relevance_score: 78
  },
  {
    id: 'news-5',
    title: 'Tecnologia de baterias melhora autonomia de patinetes',
    description: 'Nova geração de baterias promete dobrar a autonomia dos patinetes elétricos.',
    content: 'Fabricantes anunciam nova tecnologia de baterias que pode dobrar a autonomia dos patinetes elétricos...',
    url: 'https://example.com/news/5',
    image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop&auto=format&q=80',
    source: 'TechTudo',
    published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'technology',
    tags: ['bateria', 'autonomia', 'inovação'],
    relevance_score: 85
  }
]

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || 'all'
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredNews = mockNewsData
    
    if (category !== 'all') {
      filteredNews = mockNewsData.filter(news => news.category === category)
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
        source: 'mock_api'
      }
    })
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch news data',
      metadata: {
        timestamp: new Date().toISOString(),
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Endpoint para sincronizar notícias com fonte externa
    const { source, force_refresh } = await request.json()
    
    // Simular sincronização
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const syncedCount = mockNewsData.length
    
    return NextResponse.json({
      success: true,
      message: `Synchronized ${syncedCount} news articles`,
      data: {
        synced_count: syncedCount,
        source: source || 'default',
        force_refresh: force_refresh || false,
        last_sync: new Date().toISOString()
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to sync news data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}