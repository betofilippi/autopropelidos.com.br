import type { RateLimitConfig } from '@/lib/types/services'
import { logger } from './logger'

interface RateLimitEntry {
  count: number
  resetTime: number
  windowStart: number
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>()
  private configs = new Map<string, RateLimitConfig>()

  constructor() {
    // Cleanup de entradas expiradas a cada 5 minutos
    setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetTime < now) {
        this.limits.delete(key)
      }
    }
  }

  addConfig(endpoint: string, config: RateLimitConfig) {
    this.configs.set(endpoint, config)
  }

  getConfig(endpoint: string): RateLimitConfig | undefined {
    return this.configs.get(endpoint)
  }

  check(identifier: string, endpoint: string): { allowed: boolean; remaining: number; resetTime: number } {
    const config = this.configs.get(endpoint)
    if (!config) {
      // Se não há configuração, permite
      return { allowed: true, remaining: Infinity, resetTime: 0 }
    }

    const key = `${endpoint}:${identifier}`
    const now = Date.now()
    const windowMs = config.window * 1000

    let entry = this.limits.get(key)

    // Se não existe entrada ou a janela expirou, cria nova
    if (!entry || (now - entry.windowStart) >= windowMs) {
      entry = {
        count: 0,
        resetTime: now + windowMs,
        windowStart: now
      }
    }

    entry.count++
    this.limits.set(key, entry)

    const allowed = entry.count <= config.requests
    const remaining = Math.max(0, config.requests - entry.count)

    if (!allowed) {
      logger.warn('RATE_LIMIT_EXCEEDED', `Rate limit exceeded for ${identifier} on ${endpoint}`, {
        identifier,
        endpoint,
        count: entry.count,
        limit: config.requests,
        window: config.window
      })
    }

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime
    }
  }

  reset(identifier: string, endpoint?: string) {
    if (endpoint) {
      const key = `${endpoint}:${identifier}`
      this.limits.delete(key)
    } else {
      // Remove todas as entradas para o identificador
      for (const key of this.limits.keys()) {
        if (key.endsWith(`:${identifier}`)) {
          this.limits.delete(key)
        }
      }
    }
  }

  getStats() {
    return {
      active_limits: this.limits.size,
      configured_endpoints: this.configs.size
    }
  }
}

// Instância global do rate limiter
const rateLimiter = new RateLimiter()

// Configurações padrão para diferentes endpoints
rateLimiter.addConfig('/api/search', { requests: 100, window: 3600 }) // 100 req/hora
rateLimiter.addConfig('/api/news', { requests: 200, window: 3600 }) // 200 req/hora
rateLimiter.addConfig('/api/videos', { requests: 150, window: 3600 }) // 150 req/hora
rateLimiter.addConfig('/api/vehicles', { requests: 300, window: 3600 }) // 300 req/hora
rateLimiter.addConfig('/api/regulations', { requests: 100, window: 3600 }) // 100 req/hora
rateLimiter.addConfig('/api/analytics', { requests: 50, window: 3600 }) // 50 req/hora

// Rate limits mais restritivos para endpoints sensíveis
rateLimiter.addConfig('/api/analytics/export', { requests: 5, window: 3600 }) // 5 req/hora
rateLimiter.addConfig('/api/analytics/invalidate', { requests: 10, window: 3600 }) // 10 req/hora

export default rateLimiter

// Função helper para criar middleware de rate limiting
export function createRateLimitMiddleware(endpoint: string) {
  return (identifier: string) => {
    return rateLimiter.check(identifier, endpoint)
  }
}

// Função para extrair identificador da requisição
export function getRequestIdentifier(request: Request): string {
  // Primeiro tenta pegar o IP real do header X-Forwarded-For
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  // Depois tenta o header X-Real-IP
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Por último, usa um identificador padrão (em desenvolvimento)
  return 'unknown'
}

// Função para aplicar rate limiting em um endpoint
export async function applyRateLimit(
  request: Request,
  endpoint: string
): Promise<{ success: boolean; headers: Record<string, string>; error?: string }> {
  const identifier = getRequestIdentifier(request)
  const result = rateLimiter.check(identifier, endpoint)

  const headers = {
    'X-RateLimit-Limit': rateLimiter.getConfig(endpoint)?.requests.toString() || 'unlimited',
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString()
  }

  if (!result.allowed) {
    const config = rateLimiter.getConfig(endpoint)
    return {
      success: false,
      headers,
      error: config?.message || 'Rate limit exceeded. Please try again later.'
    }
  }

  return { success: true, headers }
}