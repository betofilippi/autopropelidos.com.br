// Configurações para APIs externas
export const API_CONFIG = {
  // YouTube Data API v3
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || '',
    baseUrl: 'https://www.googleapis.com/youtube/v3',
    quotaLimit: 10000, // Limite diário padrão
    rateLimits: {
      search: { requests: 100, window: 100 }, // 100 requests per 100 seconds
      videos: { requests: 100, window: 100 },
      channels: { requests: 100, window: 100 }
    },
    maxResults: 50, // Máximo por requisição
    fallbackToMock: process.env.NODE_ENV === 'development'
  },

  // News API
  newsApi: {
    apiKey: process.env.NEWS_API_KEY || '',
    baseUrl: 'https://newsapi.org/v2',
    quotaLimit: 1000, // Limite diário para plano gratuito
    rateLimits: {
      everything: { requests: 5000, window: 3600 }, // 5000 per hour
      topHeadlines: { requests: 5000, window: 3600 }
    },
    maxResults: 100, // Máximo por requisição
    fallbackToMock: process.env.NODE_ENV === 'development'
  },

  // Configurações para outras APIs futuras
  maps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    fallbackToMock: true
  },

  analytics: {
    googleAnalytics: {
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
      apiSecret: process.env.GA_API_SECRET || ''
    },
    fallbackToMock: process.env.NODE_ENV === 'development'
  }
}

// Função para verificar se as APIs estão configuradas
export function validateApiConfig() {
  const issues: string[] = []

  if (!API_CONFIG.youtube.apiKey && !API_CONFIG.youtube.fallbackToMock) {
    issues.push('YouTube API key is missing')
  }

  if (!API_CONFIG.newsApi.apiKey && !API_CONFIG.newsApi.fallbackToMock) {
    issues.push('News API key is missing')
  }

  return {
    isValid: issues.length === 0,
    issues
  }
}

// Configurações de retry e timeout
export const REQUEST_CONFIG = {
  timeout: 10000, // 10 segundos
  retryAttempts: 3,
  retryDelay: 1000, // 1 segundo
  retryMultiplier: 2 // Delay exponencial
}

// Headers padrão para requisições
export const DEFAULT_HEADERS = {
  'User-Agent': 'AutopropellidosBR/1.0',
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

// Função para fazer requisições com retry
export async function makeApiRequest(
  url: string,
  options: RequestInit = {},
  retries = REQUEST_CONFIG.retryAttempts
): Promise<Response> {
  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers
    },
    signal: AbortSignal.timeout(REQUEST_CONFIG.timeout)
  }

  try {
    const response = await fetch(url, mergedOptions)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return response
  } catch (error) {
    if (retries > 0 && !(error instanceof TypeError)) {
      // Espera antes de tentar novamente
      await new Promise(resolve => 
        setTimeout(resolve, REQUEST_CONFIG.retryDelay * (REQUEST_CONFIG.retryAttempts - retries + 1))
      )
      return makeApiRequest(url, options, retries - 1)
    }
    throw error
  }
}

// Função para verificar quota das APIs
export function checkApiQuota(apiName: keyof typeof API_CONFIG, requestsUsed: number): {
  withinLimit: boolean
  remaining: number
  percentage: number
} {
  const config = API_CONFIG[apiName] as any
  if (!config?.quotaLimit) {
    return { withinLimit: true, remaining: Infinity, percentage: 0 }
  }

  const remaining = config.quotaLimit - requestsUsed
  const percentage = (requestsUsed / config.quotaLimit) * 100

  return {
    withinLimit: remaining > 0,
    remaining: Math.max(0, remaining),
    percentage: Math.min(100, percentage)
  }
}

// Storage para tracking de uso de quota (em produção, usar Redis ou DB)
const quotaUsage = new Map<string, { count: number, resetTime: number }>()

export function trackApiUsage(apiName: string, requests: number = 1) {
  const today = new Date().toISOString().split('T')[0]
  const key = `${apiName}:${today}`
  
  const entry = quotaUsage.get(key) || { count: 0, resetTime: Date.now() + 24 * 60 * 60 * 1000 }
  entry.count += requests
  
  quotaUsage.set(key, entry)
  
  // Cleanup de entradas antigas
  const now = Date.now()
  for (const [k, v] of quotaUsage.entries()) {
    if (v.resetTime < now) {
      quotaUsage.delete(k)
    }
  }
  
  return entry.count
}

export function getApiUsage(apiName: string): number {
  const today = new Date().toISOString().split('T')[0]
  const key = `${apiName}:${today}`
  return quotaUsage.get(key)?.count || 0
}