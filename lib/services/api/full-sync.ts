import { createAdminClient } from '@/lib/supabase/admin'
import { newsAPIService } from '@/lib/services/newsapi'
import { youTubeService } from '@/lib/services/youtube'
import { AnalyticsService } from '@/lib/services/analytics'
import { WebhookService } from '@/lib/services/webhook'
import type { NewsItem, Video } from '@/lib/types'

interface FullSyncOptions {
  batchSize: number
  maxRetries: number
  includeAnalytics: boolean
  forceRefresh: boolean
  webhook?: string | null
  priority: 'low' | 'normal' | 'high'
}

interface SyncProgress {
  total: number
  completed: number
  failed: number
  percentage: number
  currentPhase: string
  estimatedTimeRemaining: number
}

interface JobStatus {
  jobId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  startTime: Date
  endTime?: Date
  progress: SyncProgress
  errors: string[]
  results?: {
    news: { fetched: number; inserted: number; updated: number; errors: number }
    videos: { fetched: number; inserted: number; updated: number; errors: number }
    analytics?: { processed: number; errors: number }
  }
  options: FullSyncOptions
}

export class FullSyncService {
  private jobs: Map<string, JobStatus> = new Map()
  private currentJobId: string | null = null
  private analyticsService = new AnalyticsService()
  private webhookService = new WebhookService()

  generateJobId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getJobId(): string {
    return this.currentJobId || this.generateJobId()
  }

  getStatus(): {
    isRunning: boolean
    currentJobId: string | null
    activeJobs: number
    estimatedCompletion?: Date
  } {
    const activeJobs = Array.from(this.jobs.values()).filter(
      job => job.status === 'running' || job.status === 'pending'
    )

    const currentJob = this.currentJobId ? this.jobs.get(this.currentJobId) : null
    const estimatedCompletion = currentJob?.progress.estimatedTimeRemaining
      ? new Date(Date.now() + currentJob.progress.estimatedTimeRemaining * 1000)
      : undefined

    return {
      isRunning: activeJobs.length > 0,
      currentJobId: this.currentJobId,
      activeJobs: activeJobs.length,
      estimatedCompletion
    }
  }

  getJobStatus(jobId: string): JobStatus | null {
    return this.jobs.get(jobId) || null
  }

  async startFullSync(options: FullSyncOptions): Promise<void> {
    const jobId = this.generateJobId()
    this.currentJobId = jobId

    const job: JobStatus = {
      jobId,
      status: 'pending',
      startTime: new Date(),
      progress: {
        total: 0,
        completed: 0,
        failed: 0,
        percentage: 0,
        currentPhase: 'Initializing',
        estimatedTimeRemaining: 0
      },
      errors: [],
      options
    }

    this.jobs.set(jobId, job)

    // Start sync process asynchronously
    this.performFullSync(jobId).catch(error => {
      const job = this.jobs.get(jobId)
      if (job) {
        job.status = 'failed'
        job.endTime = new Date()
        job.errors.push(error.message)
        this.jobs.set(jobId, job)
      }
    })
  }

  private async performFullSync(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId)
    if (!job) return

    try {
      job.status = 'running'
      job.progress.currentPhase = 'Fetching content sources'
      this.jobs.set(jobId, job)

      // Notify webhook of start
      if (job.options.webhook) {
        await this.webhookService.send(job.options.webhook, {
          event: 'sync_started',
          jobId,
          timestamp: new Date().toISOString()
        })
      }

      // Phase 1: Fetch and estimate total work
      const newsItems = await newsAPIService.getPortugueseNews()
      const videos = await youTubeService.getRelevantVideos()
      
      job.progress.total = newsItems.length + videos.length
      job.progress.currentPhase = 'Processing news articles'
      this.jobs.set(jobId, job)

      // Phase 2: Process news in batches
      const newsResult = await this.processBatchedNews(newsItems, job)
      
      job.progress.currentPhase = 'Processing videos'
      this.jobs.set(jobId, job)

      // Phase 3: Process videos in batches
      const videosResult = await this.processBatchedVideos(videos, job)

      // Phase 4: Analytics processing (optional)
      let analyticsResult
      if (job.options.includeAnalytics) {
        job.progress.currentPhase = 'Processing analytics'
        this.jobs.set(jobId, job)
        analyticsResult = await this.processAnalytics(job)
      }

      // Phase 5: Cleanup and optimization
      job.progress.currentPhase = 'Finalizing'
      this.jobs.set(jobId, job)
      await this.performCleanup(job)

      // Complete the job
      job.status = 'completed'
      job.endTime = new Date()
      job.progress.percentage = 100
      job.progress.currentPhase = 'Completed'
      job.results = {
        news: newsResult,
        videos: videosResult,
        analytics: analyticsResult
      }
      this.jobs.set(jobId, job)

      // Notify webhook of completion
      if (job.options.webhook) {
        await this.webhookService.send(job.options.webhook, {
          event: 'sync_completed',
          jobId,
          results: job.results,
          duration: job.endTime.getTime() - job.startTime.getTime(),
          timestamp: new Date().toISOString()
        })
      }

    } catch (error) {
      job.status = 'failed'
      job.endTime = new Date()
      job.errors.push(error instanceof Error ? error.message : 'Unknown error')
      this.jobs.set(jobId, job)

      // Notify webhook of failure
      if (job.options.webhook) {
        await this.webhookService.send(job.options.webhook, {
          event: 'sync_failed',
          jobId,
          error: job.errors[job.errors.length - 1],
          timestamp: new Date().toISOString()
        })
      }
    } finally {
      if (this.currentJobId === jobId) {
        this.currentJobId = null
      }
    }
  }

  private async processBatchedNews(newsItems: NewsItem[], job: JobStatus) {
    const result = { fetched: newsItems.length, inserted: 0, updated: 0, errors: 0 }
    const supabase = createAdminClient()
    const { batchSize, maxRetries } = job.options

    for (let i = 0; i < newsItems.length; i += batchSize) {
      const batch = newsItems.slice(i, i + batchSize)
      
      for (const newsItem of batch) {
        let retries = 0
        let success = false

        while (retries < maxRetries && !success) {
          try {
            // Check if news exists
            const { data: existing } = await supabase
              .schema('autopropelidos.com.br')
              .from('news')
              .select('id, published_at')
              .eq('url', newsItem.source_url)
              .single()

            if (existing && !job.options.forceRefresh) {
              // Update if needed
              if (existing.published_at !== newsItem.published_at) {
                await supabase
                  .schema('autopropelidos.com.br')
                  .from('news')
                  .update({
                    title: newsItem.title,
                    description: newsItem.excerpt,
                    content: newsItem.content,
                    image_url: newsItem.image_url,
                    published_at: newsItem.published_at
                  })
                  .eq('id', existing.id)
                result.updated++
              }
            } else {
              // Insert new or force refresh
              await supabase
                .schema('autopropelidos.com.br')
                .from('news')
                .upsert({
                  title: newsItem.title,
                  description: newsItem.excerpt,
                  content: newsItem.content,
                  image_url: newsItem.image_url,
                  source: newsItem.source,
                  url: newsItem.source_url,
                  published_at: newsItem.published_at,
                  category: this.mapNewsCategory(newsItem.category),
                  tags: this.extractTags(newsItem),
                  relevance_score: this.calculateRelevanceScore(newsItem)
                })
              result.inserted++
            }
            success = true
          } catch (error) {
            retries++
            if (retries >= maxRetries) {
              result.errors++
              job.errors.push(`Failed to process news item after ${maxRetries} retries: ${error}`)
            }
          }
        }

        // Update progress
        job.progress.completed++
        job.progress.percentage = Math.round((job.progress.completed / job.progress.total) * 100)
        job.progress.estimatedTimeRemaining = this.calculateETA(job)
        this.jobs.set(job.jobId, job)
      }

      // Brief pause between batches to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return result
  }

  private async processBatchedVideos(videos: Video[], job: JobStatus) {
    const result = { fetched: videos.length, inserted: 0, updated: 0, errors: 0 }
    const supabase = createAdminClient()
    const { batchSize, maxRetries } = job.options

    for (let i = 0; i < videos.length; i += batchSize) {
      const batch = videos.slice(i, i + batchSize)
      
      for (const video of batch) {
        let retries = 0
        let success = false

        while (retries < maxRetries && !success) {
          try {
            // Check if video exists
            const { data: existing } = await supabase
              .schema('autopropelidos.com.br')
              .from('videos')
              .select('id, view_count')
              .eq('youtube_id', video.youtube_id)
              .single()

            if (existing && !job.options.forceRefresh) {
              // Update view count if different
              if (existing.view_count !== video.views) {
                await supabase
                  .schema('autopropelidos.com.br')
                  .from('videos')
                  .update({
                    view_count: video.views,
                    title: video.title,
                    description: video.description,
                    thumbnail_url: video.thumbnail_url
                  })
                  .eq('id', existing.id)
                result.updated++
              }
            } else {
              // Insert new or force refresh
              await supabase
                .schema('autopropelidos.com.br')
                .from('videos')
                .upsert({
                  youtube_id: video.youtube_id,
                  title: video.title,
                  description: video.description,
                  thumbnail_url: video.thumbnail_url,
                  channel_name: video.channel_name,
                  channel_id: video.channel_id,
                  duration: video.duration,
                  view_count: video.views,
                  published_at: video.published_at,
                  category: this.categorizeVideo(video),
                  tags: this.extractVideoTags(video),
                  relevance_score: this.calculateVideoRelevance(video)
                })
              result.inserted++
            }
            success = true
          } catch (error) {
            retries++
            if (retries >= maxRetries) {
              result.errors++
              job.errors.push(`Failed to process video after ${maxRetries} retries: ${error}`)
            }
          }
        }

        // Update progress
        job.progress.completed++
        job.progress.percentage = Math.round((job.progress.completed / job.progress.total) * 100)
        job.progress.estimatedTimeRemaining = this.calculateETA(job)
        this.jobs.set(job.jobId, job)
      }

      // Brief pause between batches
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return result
  }

  private async processAnalytics(job: JobStatus) {
    try {
      const processed = await this.analyticsService.processRecentContent()
      return { processed, errors: 0 }
    } catch (error) {
      job.errors.push(`Analytics processing failed: ${error}`)
      return { processed: 0, errors: 1 }
    }
  }

  private async performCleanup(job: JobStatus) {
    const supabase = createAdminClient()
    
    // Clean up duplicate entries
    await supabase.rpc('remove_duplicate_news')
    await supabase.rpc('remove_duplicate_videos')
    
    // Update trending scores
    await supabase.rpc('update_trending_scores')
    
    // Vacuum and analyze tables for better performance
    await supabase.rpc('optimize_tables')
  }

  private calculateETA(job: JobStatus): number {
    const elapsed = Date.now() - job.startTime.getTime()
    const rate = job.progress.completed / (elapsed / 1000) // items per second
    const remaining = job.progress.total - job.progress.completed
    return remaining / rate
  }

  async cancelJob(jobId: string, force: boolean = false): Promise<{found: boolean, cancelled: boolean}> {
    const job = this.jobs.get(jobId)
    if (!job) return { found: false, cancelled: false }

    if (job.status === 'completed' || job.status === 'failed') {
      return { found: true, cancelled: false }
    }

    if (force || job.status === 'pending') {
      job.status = 'cancelled'
      job.endTime = new Date()
      this.jobs.set(jobId, job)
      
      if (this.currentJobId === jobId) {
        this.currentJobId = null
      }
      
      return { found: true, cancelled: true }
    }

    return { found: true, cancelled: false }
  }

  async cancelAllJobs(force: boolean = false): Promise<{cancelled: number}> {
    let cancelled = 0
    
    for (const [jobId, job] of this.jobs.entries()) {
      if (job.status === 'running' || job.status === 'pending') {
        if (force || job.status === 'pending') {
          job.status = 'cancelled'
          job.endTime = new Date()
          this.jobs.set(jobId, job)
          cancelled++
        }
      }
    }
    
    this.currentJobId = null
    return { cancelled }
  }

  // Helper methods (same as in sync.ts)
  private mapNewsCategory(category: string): 'regulation' | 'safety' | 'technology' | 'urban_mobility' | 'general' {
    switch (category) {
      case 'legislacao': return 'regulation'
      case 'seguranca': return 'safety'
      case 'manutencao': return 'technology'
      case 'sustentabilidade': return 'urban_mobility'
      default: return 'general'
    }
  }

  private extractTags(newsItem: NewsItem): string[] {
    const tags: string[] = []
    const text = `${newsItem.title} ${newsItem.content}`.toLowerCase()
    
    const keywords = [
      'patinete', 'bicicleta', 'elétrico', 'mobilidade', 'urbana',
      'segurança', 'regulamentação', 'contran', '996', 'autopropelido',
      'ciclomotor', 'sustentável', 'trânsito', 'lei', 'norma'
    ]
    
    keywords.forEach(keyword => {
      if (text.includes(keyword)) tags.push(keyword)
    })
    
    return [...new Set(tags)]
  }

  private calculateRelevanceScore(newsItem: NewsItem): number {
    let score = 50
    const text = `${newsItem.title} ${newsItem.content}`.toLowerCase()
    
    const highPriorityKeywords = ['contran', '996', 'regulamentação', 'lei federal']
    highPriorityKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 15
    })
    
    const mediumPriorityKeywords = ['segurança', 'acidente', 'norma', 'fiscalização']
    mediumPriorityKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 10
    })
    
    const daysOld = (Date.now() - new Date(newsItem.published_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysOld < 7) score += 20
    else if (daysOld < 30) score += 10
    
    return Math.min(score, 100)
  }

  private categorizeVideo(video: Video): 'news_report' | 'educational' | 'analysis' | 'review' | 'tutorial' {
    const text = `${video.title} ${video.description}`.toLowerCase()
    
    if (text.includes('tutorial') || text.includes('como') || text.includes('passo a passo')) {
      return 'tutorial'
    }
    if (text.includes('review') || text.includes('análise') || text.includes('teste')) {
      return 'review'
    }
    if (text.includes('lei') || text.includes('regulamenta') || text.includes('norma')) {
      return 'educational'
    }
    if (text.includes('jornal') || text.includes('notícia') || text.includes('reportagem')) {
      return 'news_report'
    }
    
    return 'analysis'
  }

  private extractVideoTags(video: Video): string[] {
    const tags: string[] = []
    const text = `${video.title} ${video.description}`.toLowerCase()
    
    const keywords = [
      'patinete', 'bicicleta', 'elétrico', 'mobilidade', 'urbana',
      'segurança', 'regulamentação', 'contran', '996', 'autopropelido',
      'tutorial', 'review', 'teste', 'manutenção', 'dicas'
    ]
    
    keywords.forEach(keyword => {
      if (text.includes(keyword)) tags.push(keyword)
    })
    
    return [...new Set(tags)]
  }

  private calculateVideoRelevance(video: Video): number {
    let score = 50
    const text = `${video.title} ${video.description}`.toLowerCase()
    
    if (text.includes('contran') || text.includes('996')) score += 20
    if (text.includes('regulamentação') || text.includes('lei')) score += 15
    if (text.includes('segurança')) score += 10
    
    if (video.views > 100000) score += 15
    else if (video.views > 50000) score += 10
    else if (video.views > 10000) score += 5
    
    const daysOld = (Date.now() - new Date(video.published_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysOld < 30) score += 10
    else if (daysOld < 90) score += 5
    
    return Math.min(score, 100)
  }
}