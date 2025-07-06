import type { NewsItem } from '@/lib/types/services'

// Função para calcular similaridade entre strings usando Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      )
    }
  }
  
  return matrix[str2.length][str1.length]
}

// Função para calcular similaridade percentual
function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length)
  if (maxLength === 0) return 1
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase())
  return (maxLength - distance) / maxLength
}

// Função para normalizar texto para comparação
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove pontuação
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim()
}

// Função para extrair palavras-chave de um texto
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
    'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
    'para', 'por', 'com', 'sem', 'sob', 'sobre', 'até', 'desde',
    'e', 'ou', 'mas', 'que', 'se', 'não', 'já', 'ainda',
    'é', 'são', 'foi', 'foram', 'será', 'será', 'tem', 'têm'
  ])
  
  return normalizeText(text)
    .split(' ')
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 10) // Limita a 10 palavras-chave
}

// Interface para resultado de deduplicação
interface DeduplicationResult {
  unique: NewsItem[]
  duplicates: Array<{
    original: NewsItem
    duplicate: NewsItem
    similarity: number
    reason: string
  }>
}

// Função principal de deduplicação
export function deduplicateNews(newsItems: NewsItem[]): DeduplicationResult {
  const unique: NewsItem[] = []
  const duplicates: Array<{
    original: NewsItem
    duplicate: NewsItem
    similarity: number
    reason: string
  }> = []
  
  for (const currentItem of newsItems) {
    let isDuplicate = false
    
    for (const uniqueItem of unique) {
      // Verificar duplicata por URL exata
      if (currentItem.url === uniqueItem.url) {
        duplicates.push({
          original: uniqueItem,
          duplicate: currentItem,
          similarity: 1.0,
          reason: 'identical_url'
        })
        isDuplicate = true
        break
      }
      
      // Verificar similaridade de título
      const titleSimilarity = calculateSimilarity(
        normalizeText(currentItem.title),
        normalizeText(uniqueItem.title)
      )
      
      if (titleSimilarity > 0.85) {
        duplicates.push({
          original: uniqueItem,
          duplicate: currentItem,
          similarity: titleSimilarity,
          reason: 'similar_title'
        })
        isDuplicate = true
        break
      }
      
      // Verificar similaridade de descrição
      if (currentItem.description && uniqueItem.description) {
        const descSimilarity = calculateSimilarity(
          normalizeText(currentItem.description),
          normalizeText(uniqueItem.description)
        )
        
        if (descSimilarity > 0.90) {
          duplicates.push({
            original: uniqueItem,
            duplicate: currentItem,
            similarity: descSimilarity,
            reason: 'similar_description'
          })
          isDuplicate = true
          break
        }
      }
      
      // Verificar palavras-chave comuns
      const currentKeywords = extractKeywords(currentItem.title + ' ' + (currentItem.description || ''))
      const uniqueKeywords = extractKeywords(uniqueItem.title + ' ' + (uniqueItem.description || ''))
      
      const commonKeywords = currentKeywords.filter(word => uniqueKeywords.includes(word))
      const keywordSimilarity = commonKeywords.length / Math.max(currentKeywords.length, uniqueKeywords.length)
      
      if (keywordSimilarity > 0.75 && commonKeywords.length >= 3) {
        duplicates.push({
          original: uniqueItem,
          duplicate: currentItem,
          similarity: keywordSimilarity,
          reason: 'similar_keywords'
        })
        isDuplicate = true
        break
      }
    }
    
    if (!isDuplicate) {
      unique.push(currentItem)
    }
  }
  
  return { unique, duplicates }
}

// Função para deduplicar vídeos do YouTube
export function deduplicateVideos(videos: any[]): any {
  const unique: any[] = []
  const duplicates: any[] = []
  
  for (const currentVideo of videos) {
    let isDuplicate = false
    
    for (const uniqueVideo of unique) {
      // Verificar por YouTube ID
      if (currentVideo.youtube_id === uniqueVideo.youtube_id) {
        duplicates.push({
          original: uniqueVideo,
          duplicate: currentVideo,
          similarity: 1.0,
          reason: 'identical_youtube_id'
        })
        isDuplicate = true
        break
      }
      
      // Verificar similaridade de título
      const titleSimilarity = calculateSimilarity(
        normalizeText(currentVideo.title),
        normalizeText(uniqueVideo.title)
      )
      
      if (titleSimilarity > 0.90) {
        duplicates.push({
          original: uniqueVideo,
          duplicate: currentVideo,
          similarity: titleSimilarity,
          reason: 'similar_title'
        })
        isDuplicate = true
        break
      }
    }
    
    if (!isDuplicate) {
      unique.push(currentVideo)
    }
  }
  
  return { unique, duplicates }
}

// Função para calcular score de qualidade de conteúdo
export function calculateContentQuality(item: NewsItem): number {
  let score = 0
  
  // Pontos por título bem formado
  if (item.title) {
    if (item.title.length >= 20 && item.title.length <= 100) score += 20
    if (!/^[A-Z]/.test(item.title)) score -= 5 // Título deve começar com maiúscula
    if (item.title.includes('?') || item.title.includes('!')) score += 5 // Títulos informativos
  }
  
  // Pontos por descrição
  if (item.description) {
    if (item.description.length >= 50) score += 15
    if (item.description.length >= 150) score += 10
  }
  
  // Pontos por fonte confiável
  const trustedSources = [
    'g1', 'globo', 'folha', 'estadao', 'uol', 'r7', 'cnn', 'band',
    'exame', 'valor', 'terra', 'metropoles', 'gazeta'
  ]
  
  if (trustedSources.some(source => 
    item.source.toLowerCase().includes(source) || 
    item.url.toLowerCase().includes(source)
  )) {
    score += 25
  }
  
  // Pontos por ter imagem
  if (item.image_url && item.image_url.startsWith('http')) {
    score += 10
  }
  
  // Pontos por categoria específica
  if (['regulation', 'safety'].includes(item.category)) {
    score += 15
  }
  
  // Pontos por data recente
  if (item.published_at) {
    const publishedDate = new Date(item.published_at)
    const now = new Date()
    const daysDiff = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysDiff <= 1) score += 20      // Últimas 24h
    else if (daysDiff <= 7) score += 15  // Última semana
    else if (daysDiff <= 30) score += 10 // Último mês
  }
  
  // Penalidades
  if (item.title.toLowerCase().includes('click') || 
      item.title.toLowerCase().includes('incrível')) {
    score -= 15 // Possível clickbait
  }
  
  return Math.max(0, Math.min(100, score))
}

// Função para ranking de conteúdo por múltiplos fatores
export function rankContent(items: NewsItem[]): NewsItem[] {
  return items
    .map(item => ({
      ...item,
      quality_score: calculateContentQuality(item),
      final_score: (item.relevance_score + calculateContentQuality(item)) / 2
    }))
    .sort((a, b) => b.final_score - a.final_score)
}