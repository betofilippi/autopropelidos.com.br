// Configurações para Incremental Static Regeneration (ISR)

export const ISR_CONFIG = {
  // Revalidação em segundos
  revalidate: {
    // Páginas principais
    home: 3600, // 1 hora
    about: 86400, // 24 horas
    
    // Conteúdo dinâmico
    news: {
      list: 1800, // 30 minutos
      detail: 3600, // 1 hora
      category: 1800 // 30 minutos
    },
    
    videos: {
      list: 3600, // 1 hora
      detail: 7200, // 2 horas
      category: 3600 // 1 hora
    },
    
    vehicles: {
      list: 7200, // 2 horas
      detail: 86400, // 24 horas (catálogo muda pouco)
      category: 7200 // 2 horas
    },
    
    regulations: {
      list: 43200, // 12 horas (mudanças menos frequentes)
      detail: 86400, // 24 horas
      category: 43200 // 12 horas
    },
    
    // Ferramentas e utilidades
    tools: 86400, // 24 horas
    search: 0, // Sempre dinâmico
    
    // Páginas administrativas
    analytics: 300, // 5 minutos
    dashboard: 600 // 10 minutos
  },
  
  // Configurações de fallback
  fallback: {
    // true = mostra loading, false = 404, 'blocking' = espera gerar
    news: 'blocking',
    videos: 'blocking', 
    vehicles: true,
    regulations: true
  },
  
  // On-demand revalidation tags
  tags: {
    news: ['news', 'content'],
    videos: ['videos', 'content'],
    vehicles: ['vehicles', 'catalog'],
    regulations: ['regulations', 'legal'],
    all: ['content', 'catalog', 'legal']
  }
}

// Função para obter configuração de revalidação
export function getRevalidateTime(contentType: string, pageType: string = 'list'): number {
  const config = ISR_CONFIG.revalidate[contentType as keyof typeof ISR_CONFIG.revalidate]
  
  if (typeof config === 'number') {
    return config
  }
  
  if (typeof config === 'object' && config !== null) {
    return config[pageType as keyof typeof config] || 3600
  }
  
  return 3600 // Default: 1 hora
}

// Função para invalidar cache por tags
export async function revalidateByTag(tag: string): Promise<boolean> {
  try {
    // Em Next.js 13+, usar revalidateTag()
    if (typeof revalidateTag !== 'undefined') {
      await revalidateTag(tag)
      return true
    }
    
    // Fallback para versões anteriores
    console.log(`Revalidation triggered for tag: ${tag}`)
    return true
  } catch (error) {
    console.error('Error revalidating tag:', tag, error)
    return false
  }
}

// Função para invalidar cache por path
export async function revalidateByPath(path: string): Promise<boolean> {
  try {
    // Em Next.js 13+, usar revalidatePath()
    if (typeof revalidatePath !== 'undefined') {
      await revalidatePath(path)
      return true
    }
    
    // Fallback para versões anteriores
    console.log(`Revalidation triggered for path: ${path}`)
    return true
  } catch (error) {
    console.error('Error revalidating path:', path, error)
    return false
  }
}

// Função para invalidar múltiplos caches
export async function revalidateMultiple(
  paths: string[] = [],
  tags: string[] = []
): Promise<{ success: boolean; results: Array<{ type: string; target: string; success: boolean }> }> {
  const results = []
  
  // Revalida paths
  for (const path of paths) {
    const success = await revalidateByPath(path)
    results.push({ type: 'path', target: path, success })
  }
  
  // Revalida tags
  for (const tag of tags) {
    const success = await revalidateByTag(tag)
    results.push({ type: 'tag', target: tag, success })
  }
  
  const allSuccess = results.every(r => r.success)
  
  return { success: allSuccess, results }
}

// Configurações de cache estático
export const STATIC_CACHE_CONFIG = {
  // Headers de cache para recursos estáticos
  headers: {
    // Imagens
    images: {
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 ano
      'Vary': 'Accept-Encoding'
    },
    
    // CSS/JS
    assets: {
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 ano
      'Vary': 'Accept-Encoding'
    },
    
    // Fontes
    fonts: {
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 ano
      'Access-Control-Allow-Origin': '*'
    },
    
    // API responses
    api: {
      'Cache-Control': 'public, max-age=300, s-maxage=600', // 5min client, 10min CDN
      'Vary': 'Accept-Encoding, Authorization'
    },
    
    // Páginas HTML
    pages: {
      'Cache-Control': 'public, max-age=0, s-maxage=86400', // 0 client, 24h CDN
      'Vary': 'Accept-Encoding'
    }
  }
}

// Função para gerar chaves de cache
export function generateCacheKey(
  type: string,
  identifier: string,
  params: Record<string, any> = {}
): string {
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  return `${type}:${identifier}${paramString ? `:${paramString}` : ''}`
}

// Função para determinar se deve usar cache
export function shouldUseCache(
  request: Request,
  options: { respectCacheHeaders?: boolean; bypassOnAuth?: boolean } = {}
): boolean {
  const { respectCacheHeaders = true, bypassOnAuth = true } = options
  
  // Bypass cache se tem autorização e configurado para isso
  if (bypassOnAuth && request.headers.get('Authorization')) {
    return false
  }
  
  // Respeita headers de cache
  if (respectCacheHeaders) {
    const cacheControl = request.headers.get('Cache-Control')
    if (cacheControl?.includes('no-cache') || cacheControl?.includes('no-store')) {
      return false
    }
  }
  
  // Apenas GET requests são cacheáveis
  return request.method === 'GET'
}

// Configurações de estratégias de cache por tipo de conteúdo
export const CACHE_STRATEGIES = {
  news: {
    strategy: 'stale-while-revalidate',
    maxAge: ISR_CONFIG.revalidate.news.list,
    staleWhileRevalidate: ISR_CONFIG.revalidate.news.list * 2
  },
  
  videos: {
    strategy: 'cache-first',
    maxAge: ISR_CONFIG.revalidate.videos.list,
    networkTimeoutSeconds: 5
  },
  
  vehicles: {
    strategy: 'cache-first',
    maxAge: ISR_CONFIG.revalidate.vehicles.list,
    networkTimeoutSeconds: 10
  },
  
  regulations: {
    strategy: 'cache-first',
    maxAge: ISR_CONFIG.revalidate.regulations.list,
    networkTimeoutSeconds: 10
  },
  
  search: {
    strategy: 'network-first',
    maxAge: 300, // 5 minutos
    networkTimeoutSeconds: 3
  }
}

declare global {
  function revalidateTag(tag: string): Promise<void>
  function revalidatePath(path: string): Promise<void>
}