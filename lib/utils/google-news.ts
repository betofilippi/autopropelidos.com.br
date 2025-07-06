import { NewsItem } from '@/lib/types/services'
import { getLatestNews } from '@/lib/services/news'

// Configurações específicas para Google News
export const GOOGLE_NEWS_CONFIG = {
  // Categorias aceitas pelo Google News
  validSections: [
    'World', 'Nation', 'Business', 'Technology', 'Entertainment',
    'Sports', 'Science', 'Health', 'Opinion', 'Politics'
  ],
  
  // Mapeamento de categorias internas para Google News
  categoryMapping: {
    regulation: 'Politics',
    safety: 'Health',
    technology: 'Technology',
    urban_mobility: 'Business',
    general: 'Nation'
  },
  
  // Configurações de tempo
  maxAge: 48 * 60 * 60 * 1000, // 48 horas em ms
  minRelevanceScore: 70,
  maxArticles: 30,
  
  // Keywords obrigatórias para relevância
  requiredKeywords: [
    'patinete elétrico',
    'bicicleta elétrica',
    'ciclomotor',
    'autopropelidos',
    'mobilidade urbana',
    'CONTRAN 996'
  ]
}

// Função para validar se a notícia é elegível para Google News
export function isEligibleForGoogleNews(news: NewsItem): boolean {
  const now = new Date()
  const publishedDate = new Date(news.published_at)
  const ageInMs = now.getTime() - publishedDate.getTime()
  
  // Verificar critérios básicos
  const checks = {
    isRecent: ageInMs <= GOOGLE_NEWS_CONFIG.maxAge,
    hasMinRelevance: news.relevance_score >= GOOGLE_NEWS_CONFIG.minRelevanceScore,
    hasTitle: news.title && news.title.length >= 10,
    hasDescription: news.description && news.description.length >= 50,
    hasValidCategory: news.category in GOOGLE_NEWS_CONFIG.categoryMapping,
    hasRelevantKeywords: GOOGLE_NEWS_CONFIG.requiredKeywords.some(keyword => 
      news.title.toLowerCase().includes(keyword.toLowerCase()) ||
      news.description.toLowerCase().includes(keyword.toLowerCase())
    )
  }
  
  // Log para debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`Google News eligibility for "${news.title}":`, checks)
  }
  
  return Object.values(checks).every(check => check === true)
}

// Função para gerar Google News compliant metadata
export function generateGoogleNewsMetadata(news: NewsItem) {
  const googleNewsSection = GOOGLE_NEWS_CONFIG.categoryMapping[
    news.category as keyof typeof GOOGLE_NEWS_CONFIG.categoryMapping
  ] || 'Nation'
  
  return {
    'news:keywords': news.tags.filter(tag => 
      GOOGLE_NEWS_CONFIG.requiredKeywords.includes(tag)
    ).join(', '),
    'news:section': googleNewsSection,
    'news:publication': 'Portal Autopropelidos',
    'news:publication_date': new Date(news.published_at).toISOString(),
    'news:title': news.title,
    'news:language': 'pt',
    'news:access': 'Registration', // ou 'Subscription' se for pago
    'news:genres': 'PressRelease,Blog', // Gêneros permitidos
    'syndication-source': `https://autopropelidos.com.br/noticias/${generateSlug(news.title)}`,
    'original-source': news.url
  }
}

// Função para gerar slugs (reutilizada)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Função para otimizar título para Google News
export function optimizeNewsTitle(title: string): string {
  // Remover caracteres especiais problemáticos
  let optimized = title
    .replace(/[""'']/g, '"') // Normalizar aspas
    .replace(/[–—]/g, '-') // Normalizar traços
    .trim()
  
  // Garantir que não ultrapasse 110 caracteres (recomendado pelo Google)
  if (optimized.length > 110) {
    optimized = optimized.substring(0, 107) + '...'
  }
  
  // Adicionar keywords relevantes se não estiverem presentes
  const hasRelevantKeyword = GOOGLE_NEWS_CONFIG.requiredKeywords.some(keyword =>
    optimized.toLowerCase().includes(keyword.toLowerCase())
  )
  
  if (!hasRelevantKeyword && optimized.length < 90) {
    // Tentar adicionar keyword mais relevante baseada no contexto
    if (optimized.toLowerCase().includes('patinete')) {
      optimized = optimized.replace(/patinete/i, 'patinete elétrico')
    } else if (optimized.toLowerCase().includes('bicicleta')) {
      optimized = optimized.replace(/bicicleta/i, 'bicicleta elétrica')
    }
  }
  
  return optimized
}

// Função para otimizar descrição para Google News
export function optimizeNewsDescription(description: string): string {
  let optimized = description
    .replace(/[""'']/g, '"')
    .replace(/[–—]/g, '-')
    .trim()
  
  // Garantir tamanho ideal (155-160 caracteres)
  if (optimized.length > 160) {
    optimized = optimized.substring(0, 157) + '...'
  } else if (optimized.length < 120) {
    // Adicionar contexto relevante se a descrição for muito curta
    const contextPhrases = [
      'segundo regulamentação CONTRAN 996',
      'para equipamentos autopropelidos',
      'de acordo com nova legislação',
      'sobre mobilidade urbana sustentável'
    ]
    
    const availableSpace = 157 - optimized.length
    const suitablePhrase = contextPhrases.find(phrase => 
      phrase.length <= availableSpace - 3 // -3 para espaços e vírgula
    )
    
    if (suitablePhrase) {
      optimized += `, ${suitablePhrase}.`
    }
  }
  
  return optimized
}

// Função para gerar keywords otimizadas para Google News
export function generateOptimizedKeywords(news: NewsItem): string[] {
  const baseKeywords = [...news.tags]
  const optimizedKeywords = new Set<string>()
  
  // Adicionar keywords obrigatórias que fazem sentido
  GOOGLE_NEWS_CONFIG.requiredKeywords.forEach(keyword => {
    if (news.title.toLowerCase().includes(keyword.toLowerCase()) ||
        news.description.toLowerCase().includes(keyword.toLowerCase())) {
      optimizedKeywords.add(keyword)
    }
  })
  
  // Adicionar keywords específicas baseadas na categoria
  const categoryKeywords = {
    regulation: ['regulamentação', 'legislação', 'CONTRAN', 'normas de trânsito'],
    safety: ['segurança', 'capacete', 'proteção', 'acidentes', 'prevenção'],
    technology: ['tecnologia', 'inovação', 'bateria', 'elétrico', 'sustentável'],
    urban_mobility: ['mobilidade urbana', 'transporte', 'cidade', 'trânsito', 'sustentabilidade'],
    general: ['notícias', 'informação', 'atualização']
  }
  
  const relevantCategoryKeywords = categoryKeywords[news.category as keyof typeof categoryKeywords] || []
  relevantCategoryKeywords.forEach(keyword => {
    if (news.title.toLowerCase().includes(keyword.toLowerCase()) ||
        news.description.toLowerCase().includes(keyword.toLowerCase())) {
      optimizedKeywords.add(keyword)
    }
  })
  
  // Adicionar keywords originais relevantes
  baseKeywords.forEach(keyword => {
    if (keyword.length >= 3 && keyword.length <= 25) {
      optimizedKeywords.add(keyword)
    }
  })
  
  // Limitar a 10 keywords (recomendação do Google)
  return Array.from(optimizedKeywords).slice(0, 10)
}

// Função para validar conformidade com Google News
export function validateGoogleNewsCompliance(news: NewsItem): {
  isCompliant: boolean
  issues: string[]
  suggestions: string[]
} {
  const issues: string[] = []
  const suggestions: string[] = []
  
  // Verificar idade da notícia
  const ageInHours = (Date.now() - new Date(news.published_at).getTime()) / (1000 * 60 * 60)
  if (ageInHours > 48) {
    issues.push('Notícia muito antiga para Google News (>48h)')
  }
  
  // Verificar título
  if (!news.title || news.title.length < 10) {
    issues.push('Título muito curto ou inexistente')
  } else if (news.title.length > 110) {
    suggestions.push('Título muito longo, considere encurtar para <110 caracteres')
  }
  
  // Verificar descrição
  if (!news.description || news.description.length < 50) {
    issues.push('Descrição muito curta ou inexistente')
  } else if (news.description.length > 160) {
    suggestions.push('Descrição muito longa, considere encurtar para <160 caracteres')
  }
  
  // Verificar relevância
  if (news.relevance_score < GOOGLE_NEWS_CONFIG.minRelevanceScore) {
    issues.push(`Score de relevância baixo (${news.relevance_score}% < ${GOOGLE_NEWS_CONFIG.minRelevanceScore}%)`)
  }
  
  // Verificar keywords relevantes
  const hasRelevantKeywords = GOOGLE_NEWS_CONFIG.requiredKeywords.some(keyword =>
    news.title.toLowerCase().includes(keyword.toLowerCase()) ||
    news.description.toLowerCase().includes(keyword.toLowerCase())
  )
  
  if (!hasRelevantKeywords) {
    issues.push('Não contém keywords relevantes para o nicho')
    suggestions.push('Adicione palavras-chave como "patinete elétrico", "mobilidade urbana", etc.')
  }
  
  // Verificar imagem
  if (!news.image_url) {
    suggestions.push('Adicione imagem para melhor performance no Google News')
  }
  
  // Verificar tags
  if (news.tags.length < 3) {
    suggestions.push('Adicione mais tags relevantes (mínimo 3-5)')
  } else if (news.tags.length > 10) {
    suggestions.push('Muitas tags podem diluir a relevância, mantenha 5-10')
  }
  
  const isCompliant = issues.length === 0
  
  return {
    isCompliant,
    issues,
    suggestions
  }
}

// Função para gerar relatório de otimização para Google News
export async function generateGoogleNewsReport(): Promise<{
  totalNews: number
  eligibleNews: number
  eligibilityRate: number
  commonIssues: Record<string, number>
  topPerformers: NewsItem[]
  recommendations: string[]
}> {
  const allNews = await getLatestNews('all', 100)
  const eligibleNews = allNews.filter(isEligibleForGoogleNews)
  
  // Analisar problemas comuns
  const commonIssues: Record<string, number> = {}
  const recommendations = new Set<string>()
  
  allNews.forEach(news => {
    const validation = validateGoogleNewsCompliance(news)
    
    validation.issues.forEach(issue => {
      commonIssues[issue] = (commonIssues[issue] || 0) + 1
    })
    
    validation.suggestions.forEach(suggestion => {
      recommendations.add(suggestion)
    })
  })
  
  // Top performers (notícias com melhor score e compliance)
  const topPerformers = eligibleNews
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 5)
  
  return {
    totalNews: allNews.length,
    eligibleNews: eligibleNews.length,
    eligibilityRate: (eligibleNews.length / allNews.length) * 100,
    commonIssues,
    topPerformers,
    recommendations: Array.from(recommendations)
  }
}

// Função para gerar sitemap específico para Google News Publisher Center
export async function generatePublisherCenterSitemap(): Promise<string> {
  const recentNews = await getLatestNews('all', 50)
  const eligibleNews = recentNews.filter(isEligibleForGoogleNews)
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${eligibleNews.map(news => {
  const slug = generateSlug(news.title)
  const metadata = generateGoogleNewsMetadata(news)
  
  return `
  <url>
    <loc>https://autopropelidos.com.br/noticias/${slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Portal Autopropelidos</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${metadata['news:publication_date']}</news:publication_date>
      <news:title><![CDATA[${optimizeNewsTitle(news.title)}]]></news:title>
      <news:keywords><![CDATA[${generateOptimizedKeywords(news).join(', ')}]]></news:keywords>
    </news:news>
  </url>`
}).join('')}
</urlset>`
  
  return sitemap
}

export {
  GOOGLE_NEWS_CONFIG,
  isEligibleForGoogleNews,
  generateGoogleNewsMetadata,
  optimizeNewsTitle,
  optimizeNewsDescription,
  generateOptimizedKeywords,
  validateGoogleNewsCompliance,
  generateGoogleNewsReport,
  generatePublisherCenterSitemap
}