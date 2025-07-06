import type { LogEntry } from '@/lib/types/services'

class Logger {
  private service: string
  private enableConsole: boolean
  private enableFile: boolean
  private logLevel: 'debug' | 'info' | 'warn' | 'error'

  constructor(service: string, options: {
    enableConsole?: boolean
    enableFile?: boolean
    logLevel?: 'debug' | 'info' | 'warn' | 'error'
  } = {}) {
    this.service = service
    this.enableConsole = options.enableConsole ?? true
    this.enableFile = options.enableFile ?? false
    this.logLevel = options.logLevel ?? 'info'
  }

  private shouldLog(level: LogEntry['level']): boolean {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 }
    return levels[level] >= levels[this.logLevel]
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString()
    const level = entry.level.toUpperCase().padEnd(5)
    const service = entry.service.padEnd(15)
    const action = entry.action.padEnd(20)
    
    let message = `[${timestamp}] ${level} ${service} ${action} ${entry.message}`
    
    if (entry.metadata) {
      message += ` | ${JSON.stringify(entry.metadata)}`
    }
    
    return message
  }

  private createLogEntry(
    level: LogEntry['level'],
    action: string,
    message: string,
    metadata?: Record<string, any>,
    userId?: string,
    ipAddress?: string
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      action,
      message,
      metadata,
      user_id: userId,
      ip_address: ipAddress
    }
  }

  private writeLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return

    if (this.enableConsole) {
      const formattedMessage = this.formatMessage(entry)
      
      switch (entry.level) {
        case 'debug':
          console.debug(formattedMessage)
          break
        case 'info':
          console.info(formattedMessage)
          break
        case 'warn':
          console.warn(formattedMessage)
          break
        case 'error':
          console.error(formattedMessage)
          break
      }
    }

    // Em produção, aqui você salvaria em arquivo ou enviaria para serviço de logging
    if (this.enableFile) {
      // TODO: Implementar escrita em arquivo
      // fs.appendFile('logs/app.log', this.formatMessage(entry) + '\n')
    }
  }

  debug(action: string, message: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry('debug', action, message, metadata)
    this.writeLog(entry)
  }

  info(action: string, message: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry('info', action, message, metadata)
    this.writeLog(entry)
  }

  warn(action: string, message: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry('warn', action, message, metadata)
    this.writeLog(entry)
  }

  error(action: string, message: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry('error', action, message, metadata)
    this.writeLog(entry)
  }

  // Métodos específicos para diferentes tipos de eventos
  apiRequest(method: string, path: string, userId?: string, ipAddress?: string): void {
    this.info('API_REQUEST', `${method} ${path}`, {
      method,
      path,
      user_id: userId,
      ip_address: ipAddress
    })
  }

  apiResponse(method: string, path: string, statusCode: number, duration: number): void {
    this.info('API_RESPONSE', `${method} ${path} - ${statusCode}`, {
      method,
      path,
      status_code: statusCode,
      duration_ms: duration
    })
  }

  cacheHit(key: string): void {
    this.debug('CACHE_HIT', `Cache hit for key: ${key}`, { key })
  }

  cacheMiss(key: string): void {
    this.debug('CACHE_MISS', `Cache miss for key: ${key}`, { key })
  }

  cacheSet(key: string, ttl: number): void {
    this.debug('CACHE_SET', `Cache set for key: ${key}`, { key, ttl })
  }

  databaseQuery(query: string, duration: number): void {
    this.debug('DB_QUERY', `Database query executed`, {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      duration_ms: duration
    })
  }

  externalAPI(service: string, endpoint: string, duration: number, success: boolean): void {
    this.info('EXTERNAL_API', `${service} API call to ${endpoint}`, {
      service,
      endpoint,
      duration_ms: duration,
      success
    })
  }

  userAction(action: string, userId: string, metadata?: Record<string, any>): void {
    this.info('USER_ACTION', `User ${userId} performed ${action}`, {
      action,
      user_id: userId,
      ...metadata
    })
  }

  performanceMetric(metric: string, value: number, unit: string): void {
    this.info('PERFORMANCE', `${metric}: ${value}${unit}`, {
      metric,
      value,
      unit
    })
  }

  searchQuery(query: string, filters: Record<string, any>, resultsCount: number): void {
    this.info('SEARCH_QUERY', `Search performed: "${query}"`, {
      query,
      filters,
      results_count: resultsCount
    })
  }

  contentAccess(type: string, id: string, userId?: string): void {
    this.info('CONTENT_ACCESS', `${type} accessed: ${id}`, {
      content_type: type,
      content_id: id,
      user_id: userId
    })
  }
}

// Instâncias globais para diferentes serviços
export const newsLogger = new Logger('NEWS_SERVICE')
export const videosLogger = new Logger('VIDEOS_SERVICE')
export const vehiclesLogger = new Logger('VEHICLES_SERVICE')
export const regulationsLogger = new Logger('REGULATIONS_SERVICE')
export const analyticsLogger = new Logger('ANALYTICS_SERVICE')
export const searchLogger = new Logger('SEARCH_SERVICE')
export const cacheLogger = new Logger('CACHE_SERVICE')

// Logger genérico
export const logger = new Logger('GENERAL')

export default Logger