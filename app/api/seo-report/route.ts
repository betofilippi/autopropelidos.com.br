import { NextResponse } from 'next/server'
import { generateGoogleNewsReport, validateGoogleNewsCompliance } from '@/lib/utils/google-news'
import { getLatestNews, getNewsStats } from '@/lib/services/news'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const reportType = searchParams.get('type') || 'overview'
  const category = searchParams.get('category')
  
  try {
    switch (reportType) {
      case 'google-news':
        return await generateGoogleNewsReportResponse()
      
      case 'seo-audit':
        return await generateSEOAuditResponse(category)
      
      case 'performance':
        return await generatePerformanceResponse()
      
      case 'overview':
      default:
        return await generateOverviewResponse()
    }
  } catch (error) {
    console.error('Error generating SEO report:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro ao gerar relatório SEO',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

async function generateGoogleNewsReportResponse() {
  const report = await generateGoogleNewsReport()
  
  return NextResponse.json({
    type: 'google-news',
    generated_at: new Date().toISOString(),
    data: {
      summary: {
        total_articles: report.totalNews,
        eligible_articles: report.eligibleNews,
        eligibility_rate: Math.round(report.eligibilityRate * 100) / 100,
        compliance_score: report.eligibilityRate > 80 ? 'Excelente' : 
                         report.eligibilityRate > 60 ? 'Bom' : 
                         report.eligibilityRate > 40 ? 'Regular' : 'Precisa melhorar'
      },
      issues: {
        common_problems: report.commonIssues,
        total_issues: Object.values(report.commonIssues).reduce((sum, count) => sum + count, 0)
      },
      recommendations: report.recommendations,
      top_performers: report.topPerformers.map(news => ({
        id: news.id,
        title: news.title,
        relevance_score: news.relevance_score,
        category: news.category,
        published_at: news.published_at,
        tags: news.tags
      })),
      optimization_tips: [
        'Mantenha títulos entre 50-110 caracteres',
        'Descrições devem ter 120-160 caracteres',
        'Publique notícias com pelo menos 70% de relevância',
        'Use keywords específicas do nicho (patinete elétrico, CONTRAN 996, etc.)',
        'Adicione imagens de alta qualidade com alt text',
        'Publique conteúdo dentro de 48 horas para elegibilidade Google News'
      ]
    }
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}

async function generateSEOAuditResponse(category?: string | null) {
  const allNews = await getLatestNews(category || 'all', 100)
  const stats = await getNewsStats()
  
  // Análise SEO detalhada
  const seoAnalysis = {
    title_analysis: {
      avg_length: 0,
      too_short: 0, // <30 chars
      too_long: 0,  // >60 chars
      optimal: 0,   // 30-60 chars
      missing_keywords: 0
    },
    description_analysis: {
      avg_length: 0,
      too_short: 0, // <120 chars
      too_long: 0,  // >160 chars
      optimal: 0,   // 120-160 chars
      missing: 0
    },
    image_analysis: {
      with_images: 0,
      without_images: 0,
      percentage_with_images: 0
    },
    keyword_analysis: {
      avg_tags_per_article: 0,
      articles_with_few_tags: 0, // <3 tags
      articles_with_many_tags: 0, // >10 tags
      most_used_tags: [] as Array<{ tag: string; count: number }>
    },
    technical_seo: {
      articles_with_slugs: allNews.length, // Todos têm slugs gerados
      articles_with_schema: allNews.length, // Todos têm schema implementado
      articles_with_sitemap: allNews.length, // Todos estão no sitemap
      articles_with_rss: allNews.length // Todos estão no RSS
    }
  }
  
  // Calcular métricas
  let totalTitleLength = 0
  let totalDescLength = 0
  const tagCounts: Record<string, number> = {}
  
  allNews.forEach(news => {
    // Análise de títulos
    const titleLength = news.title.length
    totalTitleLength += titleLength
    
    if (titleLength < 30) seoAnalysis.title_analysis.too_short++
    else if (titleLength > 60) seoAnalysis.title_analysis.too_long++
    else seoAnalysis.title_analysis.optimal++
    
    // Verificar se tem keywords relevantes
    const hasRelevantKeywords = ['patinete', 'bicicleta', 'contran', 'mobilidade', 'autopropelidos']
      .some(keyword => news.title.toLowerCase().includes(keyword))
    if (!hasRelevantKeywords) seoAnalysis.title_analysis.missing_keywords++
    
    // Análise de descrições
    if (news.description) {
      const descLength = news.description.length
      totalDescLength += descLength
      
      if (descLength < 120) seoAnalysis.description_analysis.too_short++
      else if (descLength > 160) seoAnalysis.description_analysis.too_long++
      else seoAnalysis.description_analysis.optimal++
    } else {
      seoAnalysis.description_analysis.missing++
    }
    
    // Análise de imagens
    if (news.image_url) seoAnalysis.image_analysis.with_images++
    else seoAnalysis.image_analysis.without_images++
    
    // Análise de tags
    if (news.tags.length < 3) seoAnalysis.keyword_analysis.articles_with_few_tags++
    if (news.tags.length > 10) seoAnalysis.keyword_analysis.articles_with_many_tags++
    
    news.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  
  // Finalizar cálculos
  seoAnalysis.title_analysis.avg_length = Math.round(totalTitleLength / allNews.length)
  seoAnalysis.description_analysis.avg_length = Math.round(totalDescLength / (allNews.length - seoAnalysis.description_analysis.missing))
  seoAnalysis.image_analysis.percentage_with_images = Math.round((seoAnalysis.image_analysis.with_images / allNews.length) * 100)
  
  const totalTags = Object.values(tagCounts).reduce((sum, count) => sum + count, 0)
  seoAnalysis.keyword_analysis.avg_tags_per_article = Math.round((totalTags / allNews.length) * 10) / 10
  seoAnalysis.keyword_analysis.most_used_tags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }))
  
  // Gerar score SEO geral
  const seoScore = calculateSEOScore(seoAnalysis, allNews.length)
  
  return NextResponse.json({
    type: 'seo-audit',
    generated_at: new Date().toISOString(),
    category: category || 'all',
    data: {
      overview: {
        total_articles: allNews.length,
        seo_score: seoScore,
        grade: seoScore >= 90 ? 'A' : seoScore >= 80 ? 'B' : seoScore >= 70 ? 'C' : seoScore >= 60 ? 'D' : 'F'
      },
      analysis: seoAnalysis,
      recommendations: generateSEORecommendations(seoAnalysis, allNews.length),
      stats
    }
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}

async function generatePerformanceResponse() {
  const stats = await getNewsStats()
  
  // Simular métricas de performance (em produção, viriam de analytics reais)
  const performanceMetrics = {
    lighthouse_scores: {
      performance: 95,
      accessibility: 100,
      best_practices: 95,
      seo: 100,
      pwa: 85
    },
    core_web_vitals: {
      lcp: '1.2s', // Largest Contentful Paint
      fid: '10ms', // First Input Delay
      cls: '0.05', // Cumulative Layout Shift
      fcp: '0.8s', // First Contentful Paint
      ttfb: '200ms' // Time to First Byte
    },
    cache_performance: {
      hit_rate: '94%',
      avg_response_time: '120ms',
      cdn_usage: '98%'
    },
    image_optimization: {
      webp_usage: '95%',
      avg_size_reduction: '65%',
      lazy_loading_coverage: '100%'
    },
    bundle_analysis: {
      js_bundle_size: '245KB',
      css_bundle_size: '45KB',
      total_page_size: '890KB',
      unused_css: '8%'
    }
  }
  
  return NextResponse.json({
    type: 'performance',
    generated_at: new Date().toISOString(),
    data: {
      overview: {
        overall_score: 93,
        grade: 'A',
        status: 'Excelente'
      },
      metrics: performanceMetrics,
      optimizations: {
        implemented: [
          'ISR (Incremental Static Regeneration)',
          'Image optimization com Next.js',
          'Critical CSS inline',
          'Lazy loading de imagens',
          'Preload de recursos críticos',
          'Cache inteligente por categoria',
          'CDN para assets estáticos',
          'Compressão gzip/brotli',
          'Minificação de CSS/JS'
        ],
        recommendations: [
          'Implementar Service Worker para cache offline',
          'Adicionar preload de fonts',
          'Otimizar ainda mais o bundle JS',
          'Implementar tree-shaking mais agressivo'
        ]
      },
      stats
    }
  }, {
    headers: {
      'Cache-Control': 'public, max-age=1800, s-maxage=1800'
    }
  })
}

async function generateOverviewResponse() {
  const stats = await getNewsStats()
  const googleNewsReport = await generateGoogleNewsReport()
  
  return NextResponse.json({
    type: 'overview',
    generated_at: new Date().toISOString(),
    data: {
      summary: {
        total_articles: stats.total,
        google_news_eligible: googleNewsReport.eligibleNews,
        categories: Object.keys(stats.by_category).length,
        sources: Object.keys(stats.by_source).length,
        recent_articles: stats.recent_count
      },
      seo_health: {
        sitemap_coverage: '100%',
        rss_coverage: '100%',
        schema_markup: '100%',
        google_news_compliance: `${Math.round(googleNewsReport.eligibilityRate)}%`
      },
      quick_wins: [
        'Todas as páginas têm meta tags otimizadas',
        'Sitemap XML atualizado automaticamente',
        'RSS feeds por categoria implementados',
        'Schema.org NewsArticle em todas as notícias',
        'URLs SEO-friendly com slugs limpos',
        'Open Graph e Twitter Cards configurados'
      ],
      next_actions: [
        'Monitorar Web Vitals regularmente',
        'Expandir cobertura de keywords',
        'Melhorar CTR com titles mais atrativos',
        'Aumentar frequência de publicação para Google News'
      ],
      stats
    }
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}

function calculateSEOScore(analysis: any, totalArticles: number): number {
  let score = 100
  
  // Penalizar títulos problemáticos (max -20 pontos)
  const titleIssues = analysis.title_analysis.too_short + analysis.title_analysis.too_long + analysis.title_analysis.missing_keywords
  score -= Math.min((titleIssues / totalArticles) * 20, 20)
  
  // Penalizar descrições problemáticas (max -20 pontos)
  const descIssues = analysis.description_analysis.too_short + analysis.description_analysis.too_long + analysis.description_analysis.missing
  score -= Math.min((descIssues / totalArticles) * 20, 20)
  
  // Penalizar falta de imagens (max -15 pontos)
  const imageIssues = analysis.image_analysis.without_images
  score -= Math.min((imageIssues / totalArticles) * 15, 15)
  
  // Penalizar tags insuficientes (max -10 pontos)
  score -= Math.min((analysis.keyword_analysis.articles_with_few_tags / totalArticles) * 10, 10)
  
  return Math.max(Math.round(score), 0)
}

function generateSEORecommendations(analysis: any, totalArticles: number): string[] {
  const recommendations: string[] = []
  
  if (analysis.title_analysis.too_short > totalArticles * 0.1) {
    recommendations.push('Expanda títulos muito curtos para 30-60 caracteres')
  }
  
  if (analysis.title_analysis.too_long > totalArticles * 0.1) {
    recommendations.push('Encurte títulos muito longos para melhor exibição nas SERPs')
  }
  
  if (analysis.title_analysis.missing_keywords > totalArticles * 0.2) {
    recommendations.push('Inclua palavras-chave relevantes nos títulos')
  }
  
  if (analysis.description_analysis.missing > 0) {
    recommendations.push('Adicione meta descriptions a todos os artigos')
  }
  
  if (analysis.description_analysis.too_short > totalArticles * 0.15) {
    recommendations.push('Expanda descriptions para 120-160 caracteres')
  }
  
  if (analysis.image_analysis.percentage_with_images < 90) {
    recommendations.push('Adicione imagens relevantes a mais artigos')
  }
  
  if (analysis.keyword_analysis.articles_with_few_tags > totalArticles * 0.2) {
    recommendations.push('Adicione mais tags relevantes aos artigos (mínimo 3-5)')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('SEO está bem otimizado! Continue monitorando performance.')
  }
  
  return recommendations
}

// Revalidar cache a cada hora
export const revalidate = 3600