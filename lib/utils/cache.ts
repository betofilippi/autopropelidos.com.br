import type { CacheConfig } from '@/lib/types/services'

interface CacheItem<T> {
  data: T
  expires: number
  created: number
  accessed: number
  hits: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()
  private config: CacheConfig
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0
  }

  constructor(config: CacheConfig) {
    this.config = config
    
    // Cleanup de itens expirados a cada 5 minutos
    setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    let evicted = 0
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expires < now) {
        this.cache.delete(key)
        evicted++
      }
    }
    
    this.stats.evictions += evicted
    
    // Se ainda está cheio, remove os itens menos acessados
    if (this.cache.size > this.config.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => {
          // Ordena por último acesso e número de hits
          const scoreA = a[1].accessed + (a[1].hits * 1000)
          const scoreB = b[1].accessed + (b[1].hits * 1000)
          return scoreA - scoreB
        })
      
      const toRemove = entries.slice(0, entries.length - this.config.maxSize)
      toRemove.forEach(([key]) => {
        this.cache.delete(key)
        evicted++
      })
      
      this.stats.evictions += evicted
    }
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      this.stats.misses++
      return null
    }
    
    if (item.expires < Date.now()) {
      this.cache.delete(key)
      this.stats.misses++
      return null
    }
    
    // Atualiza estatísticas de acesso
    item.accessed = Date.now()
    item.hits++
    this.stats.hits++
    
    return item.data
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const expires = Date.now() + ((ttl || this.config.ttl) * 1000)
    const now = Date.now()
    
    this.cache.set(key, {
      data,
      expires,
      created: now,
      accessed: now,
      hits: 0
    })
    
    this.stats.sets++
    
    // Verifica se precisa fazer cleanup
    if (this.cache.size > this.config.maxSize) {
      this.cleanup()
    }
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      this.stats.deletes++
    }
    return deleted
  }

  clear(): void {
    this.cache.clear()
    this.stats.deletes += this.cache.size
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    return item !== undefined && item.expires >= Date.now()
  }

  size(): number {
    return this.cache.size
  }

  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      memoryUsage: this.cache.size / this.config.maxSize
    }
  }

  // Método para invalidar cache baseado em padrões
  invalidatePattern(pattern: string): number {
    const regex = new RegExp(pattern)
    let deleted = 0
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
        deleted++
      }
    }
    
    this.stats.deletes += deleted
    return deleted
  }

  // Método para pré-aquecer cache
  warmUp<T>(key: string, dataLoader: () => Promise<T>, ttl?: number): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await dataLoader()
        this.set(key, data, ttl)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    })
  }
}

// Instância global do cache
const globalCache = new MemoryCache({
  ttl: 3600, // 1 hora
  maxSize: 1000,
  strategy: 'memory'
})

// Funções utilitárias para cache
export function getCacheKey(prefix: string, ...params: any[]): string {
  return `${prefix}:${params.map(p => 
    typeof p === 'object' ? JSON.stringify(p) : String(p)
  ).join(':')}`
}

export function withCache<T>(
  key: string,
  dataLoader: () => Promise<T>,
  ttl?: number
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      // Tenta buscar do cache primeiro
      const cached = globalCache.get<T>(key)
      if (cached !== null) {
        resolve(cached)
        return
      }
      
      // Se não encontrou no cache, carrega os dados
      const data = await dataLoader()
      globalCache.set(key, data, ttl)
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}

export function invalidateCache(pattern: string): number {
  return globalCache.invalidatePattern(pattern)
}

export function getCacheStats() {
  return globalCache.getStats()
}

export function clearCache(): void {
  globalCache.clear()
}

// Cache específico para diferentes tipos de dados
export const cacheManager = {
  news: {
    get: <T>(key: string) => globalCache.get<T>(`news:${key}`),
    set: <T>(key: string, data: T, ttl = 1800) => globalCache.set(`news:${key}`, data, ttl),
    invalidate: (pattern = '.*') => globalCache.invalidatePattern(`news:${pattern}`)
  },
  videos: {
    get: <T>(key: string) => globalCache.get<T>(`videos:${key}`),
    set: <T>(key: string, data: T, ttl = 3600) => globalCache.set(`videos:${key}`, data, ttl),
    invalidate: (pattern = '.*') => globalCache.invalidatePattern(`videos:${pattern}`)
  },
  vehicles: {
    get: <T>(key: string) => globalCache.get<T>(`vehicles:${key}`),
    set: <T>(key: string, data: T, ttl = 7200) => globalCache.set(`vehicles:${key}`, data, ttl),
    invalidate: (pattern = '.*') => globalCache.invalidatePattern(`vehicles:${pattern}`)
  },
  regulations: {
    get: <T>(key: string) => globalCache.get<T>(`regulations:${key}`),
    set: <T>(key: string, data: T, ttl = 86400) => globalCache.set(`regulations:${key}`, data, ttl),
    invalidate: (pattern = '.*') => globalCache.invalidatePattern(`regulations:${pattern}`)
  },
  analytics: {
    get: <T>(key: string) => globalCache.get<T>(`analytics:${key}`),
    set: <T>(key: string, data: T, ttl = 900) => globalCache.set(`analytics:${key}`, data, ttl),
    invalidate: (pattern = '.*') => globalCache.invalidatePattern(`analytics:${pattern}`)
  }
}

export default globalCache