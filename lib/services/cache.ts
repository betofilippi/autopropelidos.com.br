// import { createClient } from 'redis' // Temporariamente comentado para usar apenas cache local

interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string
  serialize?: boolean
  compress?: boolean
}

interface CacheStats {
  hits: number
  misses: number
  sets: number
  deletes: number
  hitRate: number
  memoryUsage: string
  totalKeys: number
}

interface WarmupTask {
  key: string
  generator: () => Promise<any>
  ttl: number
  priority: 'high' | 'medium' | 'low'
}

export class CacheService {
  private redis: any = null
  private localCache: Map<string, { data: any; expires: number }> = new Map()
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    hitRate: 0,
    memoryUsage: '0 MB',
    totalKeys: 0
  }
  private warmupTasks: WarmupTask[] = []
  private isRedisConnected = false

  constructor() {
    this.initializeRedis()
    this.startCacheWarming()
    this.startStatsCollection()
  }

  private async initializeRedis() {
    try {
      // Redis temporariamente desabilitado - usando apenas cache local
      if (false && process.env.REDIS_URL) {
        // this.redis = createClient({
        //   url: process.env.REDIS_URL,
        //   socket: {
        //     connectTimeout: 5000,
        //     lazyConnect: true
        //   }
        // })

        // this.redis.on('error', (err: any) => {
        //   console.error('Redis connection error:', err)
        //   this.isRedisConnected = false
        // })

        // this.redis.on('connect', () => {
        //   console.log('Redis connected successfully')
        //   this.isRedisConnected = true
        // })

        // this.redis.on('disconnect', () => {
        //   console.log('Redis disconnected')
        //   this.isRedisConnected = false
        // })

        // await this.redis.connect()
      }
    } catch (error) {
      console.error('Failed to initialize Redis:', error)
      this.isRedisConnected = false
    }
  }

  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const fullKey = this.buildKey(key, options.prefix)
    
    try {
      // Try Redis first if available
      if (this.isRedisConnected && this.redis) {
        const cached = await this.redis.get(fullKey)
        if (cached !== null) {
          this.stats.hits++
          return options.serialize !== false ? JSON.parse(cached) : cached
        }
      }

      // Fallback to local cache
      const localCached = this.localCache.get(fullKey)
      if (localCached && localCached.expires > Date.now()) {
        this.stats.hits++
        return localCached.data
      }

      this.stats.misses++
      return null
    } catch (error) {
      console.error('Cache get error:', error)
      this.stats.misses++
      return null
    }
  }

  async set(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
    const fullKey = this.buildKey(key, options.prefix)
    const ttl = options.ttl || 3600 // Default 1 hour
    const serialized = options.serialize !== false ? JSON.stringify(value) : value

    try {
      // Set in Redis if available
      if (this.isRedisConnected && this.redis) {
        await this.redis.setEx(fullKey, ttl, serialized)
      }

      // Always set in local cache as backup
      this.localCache.set(fullKey, {
        data: value,
        expires: Date.now() + (ttl * 1000)
      })

      this.stats.sets++
      return true
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  }

  async delete(key: string, options: CacheOptions = {}): Promise<boolean> {
    const fullKey = this.buildKey(key, options.prefix)
    
    try {
      // Delete from Redis if available
      if (this.isRedisConnected && this.redis) {
        await this.redis.del(fullKey)
      }

      // Delete from local cache
      this.localCache.delete(fullKey)
      
      this.stats.deletes++
      return true
    } catch (error) {
      console.error('Cache delete error:', error)
      return false
    }
  }

  async clear(pattern?: string): Promise<boolean> {
    try {
      if (pattern) {
        // Delete keys matching pattern
        const keys = await this.getKeys(pattern)
        for (const key of keys) {
          await this.delete(key)
        }
      } else {
        // Clear all cache
        if (this.isRedisConnected && this.redis) {
          await this.redis.flushAll()
        }
        this.localCache.clear()
      }
      
      return true
    } catch (error) {
      console.error('Cache clear error:', error)
      return false
    }
  }

  async clearAll(): Promise<boolean> {
    return this.clear()
  }

  async getKeys(pattern: string): Promise<string[]> {
    try {
      if (this.isRedisConnected && this.redis) {
        return await this.redis.keys(pattern)
      }
      
      // Fallback to local cache
      const keys = Array.from(this.localCache.keys())
      return keys.filter(key => key.includes(pattern))
    } catch (error) {
      console.error('Cache getKeys error:', error)
      return []
    }
  }

  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    const fullKey = this.buildKey(key, options.prefix)
    
    try {
      if (this.isRedisConnected && this.redis) {
        return (await this.redis.exists(fullKey)) === 1
      }
      
      const localCached = this.localCache.get(fullKey)
      return localCached !== undefined && localCached.expires > Date.now()
    } catch (error) {
      console.error('Cache exists error:', error)
      return false
    }
  }

  async increment(key: string, by: number = 1, options: CacheOptions = {}): Promise<number> {
    const fullKey = this.buildKey(key, options.prefix)
    
    try {
      if (this.isRedisConnected && this.redis) {
        const result = await this.redis.incrBy(fullKey, by)
        if (options.ttl) {
          await this.redis.expire(fullKey, options.ttl)
        }
        return result
      }
      
      // Fallback to local cache
      const current = await this.get<number>(key, options) || 0
      const newValue = current + by
      await this.set(key, newValue, options)
      return newValue
    } catch (error) {
      console.error('Cache increment error:', error)
      return 0
    }
  }

  async mget<T>(keys: string[], options: CacheOptions = {}): Promise<(T | null)[]> {
    const fullKeys = keys.map(key => this.buildKey(key, options.prefix))
    
    try {
      if (this.isRedisConnected && this.redis) {
        const values = await this.redis.mGet(fullKeys)
        return values.map((value: any) => 
          value !== null ? (options.serialize !== false ? JSON.parse(value) : value) : null
        )
      }
      
      // Fallback to local cache
      return keys.map(key => {
        const cached = this.localCache.get(this.buildKey(key, options.prefix))
        return cached && cached.expires > Date.now() ? cached.data : null
      })
    } catch (error) {
      console.error('Cache mget error:', error)
      return new Array(keys.length).fill(null)
    }
  }

  async mset(keyValues: Record<string, any>, options: CacheOptions = {}): Promise<boolean> {
    try {
      const operations = Object.entries(keyValues).map(([key, value]) =>
        this.set(key, value, options)
      )
      await Promise.all(operations)
      return true
    } catch (error) {
      console.error('Cache mset error:', error)
      return false
    }
  }

  // Multi-level cache strategy
  async getOrSet<T>(
    key: string,
    generator: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    let cached = await this.get<T>(key, options)
    if (cached !== null) {
      return cached
    }

    // Generate new value
    const value = await generator()
    
    // Set in cache
    await this.set(key, value, options)
    
    return value
  }

  // Cache warming functionality
  addWarmupTask(task: WarmupTask) {
    this.warmupTasks.push(task)
  }

  private async startCacheWarming() {
    // Add default warmup tasks
    this.addWarmupTask({
      key: 'news:latest',
      generator: async () => {
        // This would typically call your news service
        return { warmed: true, timestamp: new Date().toISOString() }
      },
      ttl: 300, // 5 minutes
      priority: 'high'
    })

    this.addWarmupTask({
      key: 'videos:trending',
      generator: async () => {
        // This would typically call your video service
        return { warmed: true, timestamp: new Date().toISOString() }
      },
      ttl: 600, // 10 minutes
      priority: 'high'
    })

    // Run warmup every 5 minutes
    setInterval(() => {
      this.performCacheWarming()
    }, 5 * 60 * 1000)

    // Initial warmup
    setTimeout(() => {
      this.performCacheWarming()
    }, 10000) // Wait 10 seconds after startup
  }

  private async performCacheWarming() {
    console.log('Starting cache warming...')
    
    // Sort by priority
    const sortedTasks = this.warmupTasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    for (const task of sortedTasks) {
      try {
        const exists = await this.exists(task.key)
        if (!exists) {
          console.log(`Warming cache for: ${task.key}`)
          const value = await task.generator()
          await this.set(task.key, value, { ttl: task.ttl })
        }
      } catch (error) {
        console.error(`Cache warming failed for ${task.key}:`, error)
      }
    }
  }

  // Cache invalidation strategies
  async invalidatePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.getKeys(`*${pattern}*`)
      let invalidated = 0
      
      for (const key of keys) {
        await this.delete(key)
        invalidated++
      }
      
      console.log(`Invalidated ${invalidated} cache entries matching pattern: ${pattern}`)
      return invalidated
    } catch (error) {
      console.error('Cache invalidation error:', error)
      return 0
    }
  }

  async invalidateByTags(tags: string[]): Promise<number> {
    let invalidated = 0
    
    for (const tag of tags) {
      const tagKeys = await this.getKeys(`*tag:${tag}*`)
      for (const key of tagKeys) {
        await this.delete(key)
        invalidated++
      }
    }
    
    return invalidated
  }

  // CDN integration preparation
  async invalidateCDN(paths: string[]): Promise<boolean> {
    try {
      // This would integrate with your CDN provider
      // For now, just log the paths that would be invalidated
      console.log('CDN invalidation requested for paths:', paths)
      
      // Example implementation for CloudFlare
      if (process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ZONE_ID) {
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              files: paths.map(path => `https://autopropelidos.com.br${path}`)
            })
          }
        )
        
        return response.ok
      }
      
      return true
    } catch (error) {
      console.error('CDN invalidation error:', error)
      return false
    }
  }

  // Statistics and monitoring
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses
    this.stats.hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0
    this.stats.totalKeys = this.localCache.size
    
    // Memory usage calculation (rough estimate)
    const memoryUsage = JSON.stringify(Array.from(this.localCache.entries())).length
    this.stats.memoryUsage = `${(memoryUsage / 1024 / 1024).toFixed(2)} MB`
    
    return { ...this.stats }
  }

  private startStatsCollection() {
    // Reset stats every hour
    setInterval(() => {
      this.stats = {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        hitRate: 0,
        memoryUsage: '0 MB',
        totalKeys: 0
      }
    }, 60 * 60 * 1000)
  }

  // Cleanup expired local cache entries
  private startCleanup() {
    setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.localCache.entries()) {
        if (entry.expires < now) {
          this.localCache.delete(key)
        }
      }
    }, 5 * 60 * 1000) // Every 5 minutes
  }

  private buildKey(key: string, prefix?: string): string {
    const basePrefix = process.env.CACHE_PREFIX || 'autopropelidos'
    const fullPrefix = prefix ? `${basePrefix}:${prefix}` : basePrefix
    return `${fullPrefix}:${key}`
  }

  // Connection health check
  async healthCheck(): Promise<{
    redis: boolean
    localCache: boolean
    stats: CacheStats
  }> {
    let redisHealthy = false
    
    try {
      if (this.isRedisConnected && this.redis) {
        await this.redis.ping()
        redisHealthy = true
      }
    } catch (error) {
      console.error('Redis health check failed:', error)
    }
    
    return {
      redis: redisHealthy,
      localCache: true,
      stats: this.getStats()
    }
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.quit()
      }
      this.localCache.clear()
      console.log('Cache service shut down gracefully')
    } catch (error) {
      console.error('Error during cache shutdown:', error)
    }
  }
}

// Singleton instance
export const cacheService = new CacheService()

// Cleanup on process exit
process.on('SIGINT', async () => {
  await cacheService.shutdown()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await cacheService.shutdown()
  process.exit(0)
})