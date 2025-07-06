import { createAdminClient } from '@/lib/supabase/admin'
import { CacheService } from '@/lib/services/cache'
import { WebhookService } from '@/lib/services/webhook'
import os from 'os'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'error'
  timestamp: string
  uptime: number
  version: string
  checks: Record<string, HealthCheck>
  metrics: HealthMetrics
  alerts: Alert[]
}

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'error'
  responseTime: number
  message?: string
  details?: any
  lastChecked: string
}

interface HealthMetrics {
  system: {
    cpu: {
      usage: number
      load: number[]
    }
    memory: {
      total: number
      used: number
      free: number
      percentage: number
    }
    disk: {
      total: number
      used: number
      free: number
      percentage: number
    }
  }
  application: {
    requests: {
      total: number
      successful: number
      failed: number
      averageResponseTime: number
    }
    database: {
      connections: number
      queries: number
      slowQueries: number
      averageQueryTime: number
    }
    cache: {
      hits: number
      misses: number
      hitRate: number
      evictions: number
    }
  }
  external: {
    newsAPI: {
      status: 'healthy' | 'degraded' | 'unhealthy'
      quota: number
      responseTime: number
    }
    youtubeAPI: {
      status: 'healthy' | 'degraded' | 'unhealthy'
      quota: number
      responseTime: number
    }
    supabase: {
      status: 'healthy' | 'degraded' | 'unhealthy'
      responseTime: number
    }
  }
}

interface Alert {
  id: string
  level: 'info' | 'warning' | 'error' | 'critical'
  message: string
  details?: any
  timestamp: string
  acknowledged: boolean
  resolved: boolean
}

interface HealthConfig {
  checkInterval: number
  alertThresholds: {
    cpu: number
    memory: number
    disk: number
    responseTime: number
    errorRate: number
  }
  maintenanceMode: boolean
  maintenanceMessage?: string
}

export class HealthMonitoringService {
  private cacheService = new CacheService()
  private webhookService = new WebhookService()
  private metrics: HealthMetrics = this.initializeMetrics()
  private alerts: Alert[] = []
  private config: HealthConfig = this.getDefaultConfig()
  private isRunning = false
  private checkInterval: NodeJS.Timeout | null = null

  constructor() {
    this.startMonitoring()
  }

  private initializeMetrics(): HealthMetrics {
    return {
      system: {
        cpu: { usage: 0, load: [0, 0, 0] },
        memory: { total: 0, used: 0, free: 0, percentage: 0 },
        disk: { total: 0, used: 0, free: 0, percentage: 0 }
      },
      application: {
        requests: { total: 0, successful: 0, failed: 0, averageResponseTime: 0 },
        database: { connections: 0, queries: 0, slowQueries: 0, averageQueryTime: 0 },
        cache: { hits: 0, misses: 0, hitRate: 0, evictions: 0 }
      },
      external: {
        newsAPI: { status: 'healthy', quota: 0, responseTime: 0 },
        youtubeAPI: { status: 'healthy', quota: 0, responseTime: 0 },
        supabase: { status: 'healthy', responseTime: 0 }
      }
    }
  }

  private getDefaultConfig(): HealthConfig {
    return {
      checkInterval: 30000, // 30 seconds
      alertThresholds: {
        cpu: 80,
        memory: 85,
        disk: 90,
        responseTime: 5000,
        errorRate: 5
      },
      maintenanceMode: false
    }
  }

  private startMonitoring() {
    if (this.isRunning) return

    this.isRunning = true
    this.checkInterval = setInterval(async () => {
      await this.collectMetrics()
      await this.checkAlerts()
    }, this.config.checkInterval)

    console.log('Health monitoring started')
  }

  private async collectMetrics() {
    try {
      // System metrics
      this.metrics.system.cpu.usage = await this.getCpuUsage()
      this.metrics.system.cpu.load = os.loadavg()
      this.metrics.system.memory = this.getMemoryUsage()
      this.metrics.system.disk = await this.getDiskUsage()

      // Application metrics
      this.metrics.application.cache = await this.getCacheMetrics()
      this.metrics.application.database = await this.getDatabaseMetrics()

      // External service metrics
      this.metrics.external.newsAPI = await this.checkNewsAPIHealth()
      this.metrics.external.youtubeAPI = await this.checkYouTubeAPIHealth()
      this.metrics.external.supabase = await this.checkSupabaseHealth()

    } catch (error) {
      console.error('Error collecting metrics:', error)
    }
  }

  private async checkAlerts() {
    const newAlerts: Alert[] = []

    // CPU usage alert
    if (this.metrics.system.cpu.usage > this.config.alertThresholds.cpu) {
      newAlerts.push({
        id: `cpu_${Date.now()}`,
        level: 'warning',
        message: `High CPU usage detected: ${this.metrics.system.cpu.usage.toFixed(2)}%`,
        details: { cpuUsage: this.metrics.system.cpu.usage },
        timestamp: new Date().toISOString(),
        acknowledged: false,
        resolved: false
      })
    }

    // Memory usage alert
    if (this.metrics.system.memory.percentage > this.config.alertThresholds.memory) {
      newAlerts.push({
        id: `memory_${Date.now()}`,
        level: 'warning',
        message: `High memory usage detected: ${this.metrics.system.memory.percentage.toFixed(2)}%`,
        details: { memoryUsage: this.metrics.system.memory },
        timestamp: new Date().toISOString(),
        acknowledged: false,
        resolved: false
      })
    }

    // Disk usage alert
    if (this.metrics.system.disk.percentage > this.config.alertThresholds.disk) {
      newAlerts.push({
        id: `disk_${Date.now()}`,
        level: 'error',
        message: `High disk usage detected: ${this.metrics.system.disk.percentage.toFixed(2)}%`,
        details: { diskUsage: this.metrics.system.disk },
        timestamp: new Date().toISOString(),
        acknowledged: false,
        resolved: false
      })
    }

    // External service alerts
    if (this.metrics.external.newsAPI.status !== 'healthy') {
      newAlerts.push({
        id: `newsapi_${Date.now()}`,
        level: 'warning',
        message: `News API is ${this.metrics.external.newsAPI.status}`,
        details: { newsAPI: this.metrics.external.newsAPI },
        timestamp: new Date().toISOString(),
        acknowledged: false,
        resolved: false
      })
    }

    if (this.metrics.external.youtubeAPI.status !== 'healthy') {
      newAlerts.push({
        id: `youtube_${Date.now()}`,
        level: 'warning',
        message: `YouTube API is ${this.metrics.external.youtubeAPI.status}`,
        details: { youtubeAPI: this.metrics.external.youtubeAPI },
        timestamp: new Date().toISOString(),
        acknowledged: false,
        resolved: false
      })
    }

    if (this.metrics.external.supabase.status !== 'healthy') {
      newAlerts.push({
        id: `supabase_${Date.now()}`,
        level: 'critical',
        message: `Supabase is ${this.metrics.external.supabase.status}`,
        details: { supabase: this.metrics.external.supabase },
        timestamp: new Date().toISOString(),
        acknowledged: false,
        resolved: false
      })
    }

    // Add new alerts and send notifications
    for (const alert of newAlerts) {
      this.alerts.push(alert)
      await this.sendAlertNotification(alert)
    }

    // Clean up old resolved alerts
    this.cleanupOldAlerts()
  }

  private async sendAlertNotification(alert: Alert) {
    try {
      // Send webhook notification
      await this.webhookService.notifySystemAlert(alert.level, alert.message, alert.details)

      // Log to database
      const supabase = createAdminClient()
      await supabase
        .schema('autopropelidos.com.br')
        .from('health_alerts')
        .insert({
          id: alert.id,
          level: alert.level,
          message: alert.message,
          details: alert.details,
          timestamp: alert.timestamp,
          acknowledged: alert.acknowledged,
          resolved: alert.resolved
        })

    } catch (error) {
      console.error('Error sending alert notification:', error)
    }
  }

  private cleanupOldAlerts() {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
    this.alerts = this.alerts.filter(alert => new Date(alert.timestamp) > cutoffTime)
  }

  // Public health check methods
  async getBasicHealth(): Promise<HealthStatus> {
    const startTime = Date.now()
    
    const checks: Record<string, HealthCheck> = {
      uptime: {
        status: 'healthy',
        responseTime: 0,
        message: `Up for ${Math.floor(process.uptime())} seconds`,
        lastChecked: new Date().toISOString()
      },
      memory: {
        status: this.metrics.system.memory.percentage < 80 ? 'healthy' : 'degraded',
        responseTime: Date.now() - startTime,
        message: `Memory usage: ${this.metrics.system.memory.percentage.toFixed(2)}%`,
        lastChecked: new Date().toISOString()
      }
    }

    const overallStatus = this.determineOverallStatus(checks)

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      checks,
      metrics: this.metrics,
      alerts: this.alerts.filter(a => !a.resolved)
    }
  }

  async getDetailedHealth(): Promise<HealthStatus> {
    const startTime = Date.now()
    
    const checks: Record<string, HealthCheck> = {
      database: await this.performDatabaseCheck(),
      cache: await this.performCacheCheck(),
      external_apis: await this.performExternalAPICheck(),
      system_resources: await this.performSystemResourceCheck()
    }

    const overallStatus = this.determineOverallStatus(checks)

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      checks,
      metrics: this.metrics,
      alerts: this.alerts.filter(a => !a.resolved)
    }
  }

  async getDatabaseHealth(): Promise<HealthCheck> {
    return this.performDatabaseCheck()
  }

  async getExternalServicesHealth(): Promise<Record<string, HealthCheck>> {
    return {
      newsAPI: await this.checkNewsAPIHealth(),
      youtubeAPI: await this.checkYouTubeAPIHealth(),
      supabase: await this.checkSupabaseHealth()
    }
  }

  async getPerformanceMetrics(): Promise<HealthMetrics> {
    await this.collectMetrics()
    return this.metrics
  }

  async getFullHealthCheck(): Promise<HealthStatus> {
    const startTime = Date.now()
    
    const checks: Record<string, HealthCheck> = {
      database: await this.performDatabaseCheck(),
      cache: await this.performCacheCheck(),
      external_apis: await this.performExternalAPICheck(),
      system_resources: await this.performSystemResourceCheck(),
      application: await this.performApplicationCheck(),
      security: await this.performSecurityCheck()
    }

    const overallStatus = this.determineOverallStatus(checks)

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      checks,
      metrics: this.metrics,
      alerts: this.alerts.filter(a => !a.resolved)
    }
  }

  // Individual check methods
  private async performDatabaseCheck(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .schema('autopropelidos.com.br')
        .from('news')
        .select('id')
        .limit(1)

      const responseTime = Date.now() - startTime

      if (error) {
        return {
          status: 'unhealthy',
          responseTime,
          message: 'Database connection failed',
          details: { error: error.message },
          lastChecked: new Date().toISOString()
        }
      }

      return {
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        message: `Database responsive in ${responseTime}ms`,
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'error',
        responseTime: Date.now() - startTime,
        message: 'Database check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        lastChecked: new Date().toISOString()
      }
    }
  }

  private async performCacheCheck(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      const cacheHealth = await this.cacheService.healthCheck()
      const responseTime = Date.now() - startTime

      return {
        status: cacheHealth.redis ? 'healthy' : 'degraded',
        responseTime,
        message: cacheHealth.redis ? 'Cache is healthy' : 'Using local cache only',
        details: cacheHealth,
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'error',
        responseTime: Date.now() - startTime,
        message: 'Cache check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        lastChecked: new Date().toISOString()
      }
    }
  }

  private async performExternalAPICheck(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      const [newsAPI, youtubeAPI, supabase] = await Promise.all([
        this.checkNewsAPIHealth(),
        this.checkYouTubeAPIHealth(),
        this.checkSupabaseHealth()
      ])

      const responseTime = Date.now() - startTime
      const allHealthy = [newsAPI, youtubeAPI, supabase].every(api => api.status === 'healthy')

      return {
        status: allHealthy ? 'healthy' : 'degraded',
        responseTime,
        message: allHealthy ? 'All external APIs are healthy' : 'Some external APIs are degraded',
        details: { newsAPI, youtubeAPI, supabase },
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'error',
        responseTime: Date.now() - startTime,
        message: 'External API check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        lastChecked: new Date().toISOString()
      }
    }
  }

  private async performSystemResourceCheck(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      await this.collectMetrics()
      const responseTime = Date.now() - startTime

      const cpuOk = this.metrics.system.cpu.usage < this.config.alertThresholds.cpu
      const memoryOk = this.metrics.system.memory.percentage < this.config.alertThresholds.memory
      const diskOk = this.metrics.system.disk.percentage < this.config.alertThresholds.disk

      const allOk = cpuOk && memoryOk && diskOk

      return {
        status: allOk ? 'healthy' : 'degraded',
        responseTime,
        message: allOk ? 'System resources are healthy' : 'High resource usage detected',
        details: this.metrics.system,
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'error',
        responseTime: Date.now() - startTime,
        message: 'System resource check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        lastChecked: new Date().toISOString()
      }
    }
  }

  private async performApplicationCheck(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      // Check if application is responding
      const responseTime = Date.now() - startTime

      return {
        status: 'healthy',
        responseTime,
        message: 'Application is responsive',
        details: {
          nodeVersion: process.version,
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage()
        },
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'error',
        responseTime: Date.now() - startTime,
        message: 'Application check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        lastChecked: new Date().toISOString()
      }
    }
  }

  private async performSecurityCheck(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      const securityIssues = []

      // Check for required environment variables
      const requiredEnvVars = ['NEWS_API_KEY', 'YOUTUBE_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY']
      for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
          securityIssues.push(`Missing required environment variable: ${envVar}`)
        }
      }

      // Check HTTPS in production
      if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL?.startsWith('https://')) {
        securityIssues.push('HTTPS not configured in production')
      }

      const responseTime = Date.now() - startTime

      return {
        status: securityIssues.length === 0 ? 'healthy' : 'degraded',
        responseTime,
        message: securityIssues.length === 0 ? 'Security checks passed' : 'Security issues detected',
        details: { issues: securityIssues },
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'error',
        responseTime: Date.now() - startTime,
        message: 'Security check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        lastChecked: new Date().toISOString()
      }
    }
  }

  // Helper methods for metrics collection
  private async getCpuUsage(): Promise<number> {
    const startUsage = process.cpuUsage()
    await new Promise(resolve => setTimeout(resolve, 100))
    const endUsage = process.cpuUsage(startUsage)
    return ((endUsage.user + endUsage.system) / 1000000) * 100
  }

  private getMemoryUsage() {
    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const usedMemory = totalMemory - freeMemory
    
    return {
      total: totalMemory,
      used: usedMemory,
      free: freeMemory,
      percentage: (usedMemory / totalMemory) * 100
    }
  }

  private async getDiskUsage() {
    // This is a simplified version - in a real implementation,
    // you might want to use a library like 'node-disk-info'
    return {
      total: 100 * 1024 * 1024 * 1024, // 100GB placeholder
      used: 50 * 1024 * 1024 * 1024,   // 50GB placeholder
      free: 50 * 1024 * 1024 * 1024,   // 50GB placeholder
      percentage: 50
    }
  }

  private async getCacheMetrics() {
    const cacheStats = this.cacheService.getStats()
    return {
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      hitRate: cacheStats.hitRate,
      evictions: 0 // This would need to be tracked by the cache service
    }
  }

  private async getDatabaseMetrics() {
    // This would typically come from database monitoring
    return {
      connections: 10, // Placeholder
      queries: 1000,   // Placeholder
      slowQueries: 5,  // Placeholder
      averageQueryTime: 50 // Placeholder
    }
  }

  private async checkNewsAPIHealth() {
    const startTime = Date.now()
    
    try {
      const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=' + process.env.NEWS_API_KEY)
      const responseTime = Date.now() - startTime
      
      return {
        status: response.ok ? 'healthy' : 'degraded',
        quota: response.ok ? 1000 : 0, // Placeholder
        responseTime
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        quota: 0,
        responseTime: Date.now() - startTime
      }
    }
  }

  private async checkYouTubeAPIHealth() {
    const startTime = Date.now()
    
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`)
      const responseTime = Date.now() - startTime
      
      return {
        status: response.ok ? 'healthy' : 'degraded',
        quota: response.ok ? 10000 : 0, // Placeholder
        responseTime
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        quota: 0,
        responseTime: Date.now() - startTime
      }
    }
  }

  private async checkSupabaseHealth() {
    const startTime = Date.now()
    
    try {
      const supabase = createAdminClient()
      const { error } = await supabase
        .schema('autopropelidos.com.br')
        .from('news')
        .select('id')
        .limit(1)
      
      const responseTime = Date.now() - startTime
      
      return {
        status: !error ? 'healthy' : 'unhealthy',
        responseTime
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime
      }
    }
  }

  private determineOverallStatus(checks: Record<string, HealthCheck>): 'healthy' | 'degraded' | 'unhealthy' | 'error' {
    const statuses = Object.values(checks).map(check => check.status)
    
    if (statuses.includes('error')) return 'error'
    if (statuses.includes('unhealthy')) return 'unhealthy'
    if (statuses.includes('degraded')) return 'degraded'
    return 'healthy'
  }

  // Administrative methods
  async runDiagnostics() {
    console.log('Running full diagnostics...')
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        uptime: process.uptime(),
        cpuUsage: process.cpuUsage(),
        memoryUsage: process.memoryUsage()
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasNewsAPI: !!process.env.NEWS_API_KEY,
        hasYouTubeAPI: !!process.env.YOUTUBE_API_KEY,
        hasSupabase: !!process.env.SUPABASE_URL,
        hasRedis: !!process.env.REDIS_URL
      },
      health: await this.getFullHealthCheck(),
      metrics: this.metrics,
      alerts: this.alerts
    }

    return diagnostics
  }

  async resetMetrics() {
    this.metrics = this.initializeMetrics()
    this.alerts = []
    return { success: true, message: 'Metrics reset successfully' }
  }

  async setAlertThreshold(metric: string, threshold: number) {
    if (this.config.alertThresholds.hasOwnProperty(metric)) {
      (this.config.alertThresholds as any)[metric] = threshold
      return { success: true, message: `Alert threshold for ${metric} set to ${threshold}` }
    }
    return { success: false, message: `Invalid metric: ${metric}` }
  }

  async triggerAlert(level: 'info' | 'warning' | 'error' | 'critical', message: string, details?: any) {
    const alert: Alert = {
      id: `manual_${Date.now()}`,
      level,
      message,
      details,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      resolved: false
    }

    this.alerts.push(alert)
    await this.sendAlertNotification(alert)
    
    return { success: true, alert }
  }

  async setMaintenanceMode(enabled: boolean, message?: string) {
    this.config.maintenanceMode = enabled
    this.config.maintenanceMessage = message
    
    return { 
      success: true, 
      message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`,
      maintenanceMode: enabled,
      maintenanceMessage: message
    }
  }

  async updateConfig(newConfig: Partial<HealthConfig>) {
    this.config = { ...this.config, ...newConfig }
    
    // Restart monitoring with new interval if changed
    if (newConfig.checkInterval && this.checkInterval) {
      clearInterval(this.checkInterval)
      this.startMonitoring()
    }
    
    return { success: true, config: this.config }
  }

  // Format for Prometheus metrics
  formatPrometheusMetrics(healthData: HealthStatus): string {
    const metrics = []
    
    // System metrics
    metrics.push(`# HELP autopropelidos_cpu_usage_percent CPU usage percentage`)
    metrics.push(`# TYPE autopropelidos_cpu_usage_percent gauge`)
    metrics.push(`autopropelidos_cpu_usage_percent ${this.metrics.system.cpu.usage}`)
    
    metrics.push(`# HELP autopropelidos_memory_usage_percent Memory usage percentage`)
    metrics.push(`# TYPE autopropelidos_memory_usage_percent gauge`)
    metrics.push(`autopropelidos_memory_usage_percent ${this.metrics.system.memory.percentage}`)
    
    // Application metrics
    metrics.push(`# HELP autopropelidos_cache_hit_rate Cache hit rate percentage`)
    metrics.push(`# TYPE autopropelidos_cache_hit_rate gauge`)
    metrics.push(`autopropelidos_cache_hit_rate ${this.metrics.application.cache.hitRate}`)
    
    // Health status
    metrics.push(`# HELP autopropelidos_health_status Overall health status (0=unhealthy, 1=degraded, 2=healthy)`)
    metrics.push(`# TYPE autopropelidos_health_status gauge`)
    const statusValue = healthData.status === 'healthy' ? 2 : healthData.status === 'degraded' ? 1 : 0
    metrics.push(`autopropelidos_health_status ${statusValue}`)
    
    return metrics.join('\n')
  }

  // Graceful shutdown
  async shutdown() {
    console.log('Shutting down health monitoring...')
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }
    
    this.isRunning = false
    console.log('Health monitoring shut down')
  }
}

// Singleton instance
export const healthMonitoringService = new HealthMonitoringService()

// Cleanup on process exit
process.on('SIGINT', async () => {
  await healthMonitoringService.shutdown()
})

process.on('SIGTERM', async () => {
  await healthMonitoringService.shutdown()
})