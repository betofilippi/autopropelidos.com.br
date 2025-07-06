interface WebhookPayload {
  event: string
  timestamp: string
  data?: any
  [key: string]: any
}

interface WebhookConfig {
  url: string
  secret?: string
  retries?: number
  timeout?: number
  headers?: Record<string, string>
}

interface WebhookAttempt {
  id: string
  url: string
  payload: WebhookPayload
  attempt: number
  status: 'pending' | 'success' | 'failed'
  response?: {
    status: number
    statusText: string
    headers: Record<string, string>
    body: string
  }
  error?: string
  timestamp: Date
}

export class WebhookService {
  private pendingWebhooks: Map<string, WebhookAttempt> = new Map()
  private failedWebhooks: WebhookAttempt[] = []
  private maxRetries = 3
  private retryDelay = 1000 // 1 second

  constructor() {
    this.startRetryProcessor()
  }

  async send(url: string, payload: WebhookPayload, config: WebhookConfig = {}): Promise<boolean> {
    const attemptId = this.generateAttemptId()
    
    const attempt: WebhookAttempt = {
      id: attemptId,
      url,
      payload,
      attempt: 1,
      status: 'pending',
      timestamp: new Date()
    }

    this.pendingWebhooks.set(attemptId, attempt)

    try {
      const success = await this.executeWebhook(attempt, config)
      
      if (success) {
        attempt.status = 'success'
        this.pendingWebhooks.delete(attemptId)
        return true
      } else {
        attempt.status = 'failed'
        this.scheduleRetry(attempt, config)
        return false
      }
    } catch (error) {
      attempt.status = 'failed'
      attempt.error = error instanceof Error ? error.message : 'Unknown error'
      this.scheduleRetry(attempt, config)
      return false
    }
  }

  private async executeWebhook(attempt: WebhookAttempt, config: WebhookConfig): Promise<boolean> {
    const {
      timeout = 10000,
      headers = {},
      secret
    } = config

    const requestHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'AutoPropelidos-Webhook/1.0',
      ...headers
    }

    // Add signature if secret is provided
    if (secret) {
      const signature = await this.generateSignature(attempt.payload, secret)
      requestHeaders['X-Webhook-Signature'] = signature
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(attempt.url, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(attempt.payload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      attempt.response = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: await response.text()
      }

      // Consider 2xx status codes as success
      if (response.status >= 200 && response.status < 300) {
        console.log(`Webhook delivered successfully: ${attempt.url}`)
        return true
      } else {
        console.warn(`Webhook failed with status ${response.status}: ${attempt.url}`)
        return false
      }
    } catch (error) {
      console.error(`Webhook delivery failed: ${attempt.url}`, error)
      attempt.error = error instanceof Error ? error.message : 'Unknown error'
      return false
    }
  }

  private async generateSignature(payload: WebhookPayload, secret: string): Promise<string> {
    const crypto = await import('crypto')
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(JSON.stringify(payload))
    return `sha256=${hmac.digest('hex')}`
  }

  private scheduleRetry(attempt: WebhookAttempt, config: WebhookConfig) {
    const maxRetries = config.retries || this.maxRetries
    
    if (attempt.attempt >= maxRetries) {
      console.error(`Webhook failed after ${maxRetries} attempts: ${attempt.url}`)
      this.failedWebhooks.push(attempt)
      this.pendingWebhooks.delete(attempt.id)
      return
    }

    // Exponential backoff
    const delay = this.retryDelay * Math.pow(2, attempt.attempt - 1)
    
    setTimeout(() => {
      this.retryWebhook(attempt, config)
    }, delay)
  }

  private async retryWebhook(attempt: WebhookAttempt, config: WebhookConfig) {
    attempt.attempt++
    attempt.status = 'pending'
    attempt.timestamp = new Date()

    console.log(`Retrying webhook (attempt ${attempt.attempt}): ${attempt.url}`)

    try {
      const success = await this.executeWebhook(attempt, config)
      
      if (success) {
        attempt.status = 'success'
        this.pendingWebhooks.delete(attempt.id)
      } else {
        attempt.status = 'failed'
        this.scheduleRetry(attempt, config)
      }
    } catch (error) {
      attempt.status = 'failed'
      attempt.error = error instanceof Error ? error.message : 'Unknown error'
      this.scheduleRetry(attempt, config)
    }
  }

  private startRetryProcessor() {
    // Clean up old failed webhooks every hour
    setInterval(() => {
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
      this.failedWebhooks = this.failedWebhooks.filter(
        webhook => webhook.timestamp > cutoffTime
      )
    }, 60 * 60 * 1000)
  }

  private generateAttemptId(): string {
    return `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Status methods
  getPendingWebhooks(): WebhookAttempt[] {
    return Array.from(this.pendingWebhooks.values())
  }

  getFailedWebhooks(): WebhookAttempt[] {
    return [...this.failedWebhooks]
  }

  getWebhookStats(): {
    pending: number
    failed: number
    totalAttempts: number
  } {
    const pending = this.pendingWebhooks.size
    const failed = this.failedWebhooks.length
    const totalAttempts = pending + failed + 
      Array.from(this.pendingWebhooks.values()).reduce((sum, w) => sum + w.attempt, 0)

    return {
      pending,
      failed,
      totalAttempts
    }
  }

  // Utility methods for common webhook events
  async notifyContentUpdate(contentId: string, contentType: 'news' | 'video', action: 'created' | 'updated' | 'deleted') {
    const webhookUrl = process.env.CONTENT_WEBHOOK_URL
    if (!webhookUrl) return

    return this.send(webhookUrl, {
      event: 'content_update',
      timestamp: new Date().toISOString(),
      data: {
        contentId,
        contentType,
        action
      }
    })
  }

  async notifySystemAlert(level: 'info' | 'warning' | 'error', message: string, details?: any) {
    const webhookUrl = process.env.SYSTEM_WEBHOOK_URL
    if (!webhookUrl) return

    return this.send(webhookUrl, {
      event: 'system_alert',
      timestamp: new Date().toISOString(),
      level,
      message,
      details
    })
  }

  async notifyUserAction(userId: string, action: string, details?: any) {
    const webhookUrl = process.env.USER_WEBHOOK_URL
    if (!webhookUrl) return

    return this.send(webhookUrl, {
      event: 'user_action',
      timestamp: new Date().toISOString(),
      data: {
        userId,
        action,
        details
      }
    })
  }

  async notifyAnalyticsEvent(event: string, data: any) {
    const webhookUrl = process.env.ANALYTICS_WEBHOOK_URL
    if (!webhookUrl) return

    return this.send(webhookUrl, {
      event: 'analytics_event',
      timestamp: new Date().toISOString(),
      analyticsEvent: event,
      data
    })
  }

  // Health check
  async healthCheck(): Promise<{
    healthy: boolean
    pending: number
    failed: number
    lastError?: string
  }> {
    const stats = this.getWebhookStats()
    const recentFailures = this.failedWebhooks.filter(
      w => w.timestamp > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
    )

    return {
      healthy: recentFailures.length === 0,
      pending: stats.pending,
      failed: stats.failed,
      lastError: recentFailures[0]?.error
    }
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    console.log('Shutting down webhook service...')
    
    // Wait for pending webhooks to complete (max 30 seconds)
    const maxWait = 30000
    const startTime = Date.now()
    
    while (this.pendingWebhooks.size > 0 && (Date.now() - startTime) < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`Webhook service shut down. Pending: ${this.pendingWebhooks.size}`)
  }
}

// Singleton instance
export const webhookService = new WebhookService()

// Cleanup on process exit
process.on('SIGINT', async () => {
  await webhookService.shutdown()
})

process.on('SIGTERM', async () => {
  await webhookService.shutdown()
})