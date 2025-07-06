// Sistema de monitoramento e alertas para APIs e sync

interface MetricData {
  timestamp: number
  value: number
  metadata?: Record<string, any>
}

interface AlertConfig {
  threshold: number
  operator: 'gt' | 'lt' | 'eq'
  timeWindow: number // em minutos
  cooldown: number // em minutos
}

interface Alert {
  id: string
  type: 'error_rate' | 'response_time' | 'sync_failures' | 'api_quota'
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: number
  resolved: boolean
}

class PerformanceMonitor {
  private metrics: Map<string, MetricData[]> = new Map()
  private alerts: Alert[] = []
  private alertConfigs: Map<string, AlertConfig> = new Map()

  constructor() {
    // Configurar alertas padrão
    this.alertConfigs.set('news_api_errors', {
      threshold: 5,
      operator: 'gt',
      timeWindow: 60,
      cooldown: 30
    })
    
    this.alertConfigs.set('youtube_api_errors', {
      threshold: 3,
      operator: 'gt',
      timeWindow: 60,
      cooldown: 30
    })
    
    this.alertConfigs.set('sync_response_time', {
      threshold: 30000, // 30 segundos
      operator: 'gt',
      timeWindow: 10,
      cooldown: 15
    })
    
    this.alertConfigs.set('daily_sync_failures', {
      threshold: 2,
      operator: 'gt',
      timeWindow: 1440, // 24 horas
      cooldown: 720 // 12 horas
    })
  }

  // Registrar métrica
  recordMetric(name: string, value: number, metadata?: Record<string, any>): void {
    const metric: MetricData = {
      timestamp: Date.now(),
      value,
      metadata
    }

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const metrics = this.metrics.get(name)!
    metrics.push(metric)

    // Manter apenas últimas 1000 métricas por tipo
    if (metrics.length > 1000) {
      metrics.splice(0, metrics.length - 1000)
    }

    // Verificar alertas
    this.checkAlerts(name)
  }

  // Verificar condições de alerta
  private checkAlerts(metricName: string): void {
    const config = this.alertConfigs.get(metricName)
    if (!config) return

    const metrics = this.metrics.get(metricName) || []
    const cutoffTime = Date.now() - (config.timeWindow * 60 * 1000)
    const recentMetrics = metrics.filter(m => m.timestamp > cutoffTime)

    if (recentMetrics.length === 0) return

    let shouldAlert = false
    let alertValue = 0

    switch (config.operator) {
      case 'gt':
        alertValue = Math.max(...recentMetrics.map(m => m.value))
        shouldAlert = alertValue > config.threshold
        break
      case 'lt':
        alertValue = Math.min(...recentMetrics.map(m => m.value))
        shouldAlert = alertValue < config.threshold
        break
      case 'eq':
        shouldAlert = recentMetrics.some(m => m.value === config.threshold)
        alertValue = config.threshold
        break
    }

    if (shouldAlert) {
      this.createAlert(metricName, alertValue, config)
    }
  }

  // Criar alerta
  private createAlert(metricName: string, value: number, config: AlertConfig): void {
    const lastAlert = this.alerts
      .filter(a => a.type === metricName as any && !a.resolved)
      .sort((a, b) => b.timestamp - a.timestamp)[0]

    // Verificar cooldown
    if (lastAlert && (Date.now() - lastAlert.timestamp) < (config.cooldown * 60 * 1000)) {
      return
    }

    const alert: Alert = {
      id: `${metricName}_${Date.now()}`,
      type: metricName as any,
      message: this.generateAlertMessage(metricName, value, config),
      severity: this.calculateSeverity(metricName, value),
      timestamp: Date.now(),
      resolved: false
    }

    this.alerts.push(alert)
    this.sendAlert(alert)
  }

  // Gerar mensagem de alerta
  private generateAlertMessage(metricName: string, value: number, config: AlertConfig): string {
    const messages: Record<string, string> = {
      'news_api_errors': `News API error rate high: ${value} errors in ${config.timeWindow} minutes`,
      'youtube_api_errors': `YouTube API error rate high: ${value} errors in ${config.timeWindow} minutes`,
      'sync_response_time': `Sync response time high: ${value}ms (threshold: ${config.threshold}ms)`,
      'daily_sync_failures': `Daily sync failures: ${value} failures in last 24 hours`
    }

    return messages[metricName] || `Alert for ${metricName}: value ${value} exceeded threshold ${config.threshold}`
  }

  // Calcular severidade do alerta
  private calculateSeverity(metricName: string, value: number): Alert['severity'] {
    const severityRules: Record<string, (value: number) => Alert['severity']> = {
      'news_api_errors': (v) => v > 20 ? 'critical' : v > 10 ? 'high' : 'medium',
      'youtube_api_errors': (v) => v > 15 ? 'critical' : v > 8 ? 'high' : 'medium',
      'sync_response_time': (v) => v > 60000 ? 'critical' : v > 45000 ? 'high' : 'medium',
      'daily_sync_failures': (v) => v > 5 ? 'critical' : v > 3 ? 'high' : 'medium'
    }

    return severityRules[metricName]?.(value) || 'low'
  }

  // Enviar alerta (implementar integração com serviços externos)
  private async sendAlert(alert: Alert): Promise<void> {
    console.error(`🚨 ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`)
    
    // Aqui você pode integrar com:
    // - Slack webhook
    // - Discord webhook
    // - Email service
    // - SMS service
    // - PagerDuty
    
    try {
      // Exemplo de webhook para Slack/Discord
      if (process.env.WEBHOOK_URL && alert.severity !== 'low') {
        await fetch(process.env.WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 **${alert.severity.toUpperCase()} ALERT**\n${alert.message}`,
            username: 'AutoPropelidos Monitor',
            icon_emoji: alert.severity === 'critical' ? ':fire:' : ':warning:'
          })
        })
      }
    } catch (error) {
      console.error('Failed to send alert notification:', error)
    }
  }

  // Obter estatísticas de métricas
  getMetricStats(metricName: string, timeWindow: number = 60): {
    count: number
    avg: number
    min: number
    max: number
    sum: number
  } {
    const metrics = this.metrics.get(metricName) || []
    const cutoffTime = Date.now() - (timeWindow * 60 * 1000)
    const recentMetrics = metrics.filter(m => m.timestamp > cutoffTime)

    if (recentMetrics.length === 0) {
      return { count: 0, avg: 0, min: 0, max: 0, sum: 0 }
    }

    const values = recentMetrics.map(m => m.value)
    const sum = values.reduce((a, b) => a + b, 0)

    return {
      count: recentMetrics.length,
      avg: sum / recentMetrics.length,
      min: Math.min(...values),
      max: Math.max(...values),
      sum
    }
  }

  // Obter alertas ativos
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.resolved)
  }

  // Resolver alerta
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved = true
      console.log(`✅ Alert resolved: ${alert.message}`)
    }
  }

  // Obter dashboard de saúde do sistema
  getHealthDashboard(): {
    overall_health: 'healthy' | 'warning' | 'critical'
    active_alerts: number
    metrics_summary: Record<string, any>
    last_sync_times: Record<string, string>
  } {
    const activeAlerts = this.getActiveAlerts()
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical').length
    const highAlerts = activeAlerts.filter(a => a.severity === 'high').length

    let overall_health: 'healthy' | 'warning' | 'critical' = 'healthy'
    if (criticalAlerts > 0) overall_health = 'critical'
    else if (highAlerts > 0 || activeAlerts.length > 3) overall_health = 'warning'

    return {
      overall_health,
      active_alerts: activeAlerts.length,
      metrics_summary: {
        news_api_errors: this.getMetricStats('news_api_errors', 60),
        youtube_api_errors: this.getMetricStats('youtube_api_errors', 60),
        sync_response_time: this.getMetricStats('sync_response_time', 60),
        sync_success_rate: this.calculateSuccessRate()
      },
      last_sync_times: this.getLastSyncTimes()
    }
  }

  // Calcular taxa de sucesso
  private calculateSuccessRate(): number {
    const successMetrics = this.metrics.get('sync_success') || []
    const failureMetrics = this.metrics.get('sync_failure') || []
    
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000) // Últimas 24 horas
    const recentSuccess = successMetrics.filter(m => m.timestamp > cutoffTime).length
    const recentFailures = failureMetrics.filter(m => m.timestamp > cutoffTime).length
    
    const total = recentSuccess + recentFailures
    return total > 0 ? (recentSuccess / total) * 100 : 100
  }

  // Obter horários dos últimos syncs
  private getLastSyncTimes(): Record<string, string> {
    const syncTypes = ['news_sync', 'video_sync', 'trending_sync', 'cleanup_sync']
    const lastSyncs: Record<string, string> = {}

    for (const syncType of syncTypes) {
      const metrics = this.metrics.get(syncType) || []
      if (metrics.length > 0) {
        const lastSync = metrics[metrics.length - 1]
        lastSyncs[syncType] = new Date(lastSync.timestamp).toISOString()
      } else {
        lastSyncs[syncType] = 'never'
      }
    }

    return lastSyncs
  }
}

// Instância global do monitor
export const performanceMonitor = new PerformanceMonitor()

// Funções de conveniência para logging
export const monitoring = {
  // Registrar sucesso de sync
  recordSyncSuccess: (type: string, duration: number, itemsProcessed: number) => {
    performanceMonitor.recordMetric('sync_success', 1, { type, duration, itemsProcessed })
    performanceMonitor.recordMetric(`${type}_sync`, duration, { itemsProcessed })
  },

  // Registrar falha de sync
  recordSyncFailure: (type: string, error: string) => {
    performanceMonitor.recordMetric('sync_failure', 1, { type, error })
    performanceMonitor.recordMetric(`${type}_errors`, 1, { error })
  },

  // Registrar erro de API
  recordApiError: (apiType: 'news' | 'youtube', error: string, endpoint?: string) => {
    performanceMonitor.recordMetric(`${apiType}_api_errors`, 1, { error, endpoint })
  },

  // Registrar tempo de resposta
  recordResponseTime: (operation: string, duration: number) => {
    performanceMonitor.recordMetric('sync_response_time', duration, { operation })
  },

  // Obter dashboard
  getDashboard: () => performanceMonitor.getHealthDashboard(),

  // Obter alertas ativos
  getAlerts: () => performanceMonitor.getActiveAlerts(),

  // Resolver alerta
  resolveAlert: (alertId: string) => performanceMonitor.resolveAlert(alertId)
}