import { createAdminClient } from '@/lib/supabase/admin'
import { newsAPIService } from '@/lib/services/newsapi'
// import { youTubeService } from '@/lib/services/youtube' // Commented out for build compatibility
import type { NewsItem, Video } from '@/lib/types'

interface SyncResult {
  news: {
    fetched: number
    inserted: number
    updated: number
    errors: number
  }
  videos: {
    fetched: number
    inserted: number
    updated: number
    errors: number
  }
  timestamp: string
  duration: number
}

export class SyncService {
  private isRunning = false
  private lastSyncTime: Date | null = null
  private syncInterval: NodeJS.Timeout | null = null

  private mapNewsCategory(category: string): 'regulation' | 'safety' | 'technology' | 'urban_mobility' | 'general' {
    switch (category) {
      case 'legislacao':
        return 'regulation'
      case 'seguranca':
        return 'safety'
      case 'manutencao':
        return 'technology'
      case 'sustentabilidade':
        return 'urban_mobility'
      default:
        return 'general'
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
      if (text.includes(keyword)) {
        tags.push(keyword)
      }
    })
    
    return [...new Set(tags)] // Remove duplicates
  }

  private calculateRelevanceScore(newsItem: NewsItem): number {
    let score = 50 // Base score
    const text = `${newsItem.title} ${newsItem.content}`.toLowerCase()
    
    // High-priority keywords
    const highPriorityKeywords = ['contran', '996', 'regulamentação', 'lei federal']
    highPriorityKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 15
    })
    
    // Medium-priority keywords
    const mediumPriorityKeywords = ['segurança', 'acidente', 'norma', 'fiscalização']
    mediumPriorityKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 10
    })
    
    // Recent news gets higher score
    const daysOld = (Date.now() - new Date(newsItem.published_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysOld < 7) score += 20
    else if (daysOld < 30) score += 10
    
    return Math.min(score, 100)
  }

  async syncNews(): Promise<SyncResult['news']> {
    const result = {
      fetched: 0,
      inserted: 0,
      updated: 0,
      errors: 0,
    }

    try {
      const supabase = createAdminClient()
      
      // Fetch latest news from NewsAPI
      console.log('Fetching news from NewsAPI...')
      const newsItems = await newsAPIService.getPortugueseNews()
      console.log(`Fetched ${newsItems.length} news items from NewsAPI`)
      result.fetched = newsItems.length

      // Process each news item
      for (const newsItem of newsItems) {
        try {
          // Check if news already exists by url
          const { data: existing } = await supabase
            .schema('public')
            .from('news')
            .select('id, published_at')
            .eq('url', newsItem.source_url)
            .single()

          if (existing) {
            // Update if the published date is different
            if (existing.published_at !== newsItem.published_at) {
              const { error } = await supabase
                .schema('public')
                .from('news')
                .update({
                  title: newsItem.title,
                  description: newsItem.excerpt,
                  content: newsItem.content,
                  image_url: newsItem.image_url,
                  published_at: newsItem.published_at,
                  category: this.mapNewsCategory(newsItem.category),
                })
                .eq('id', existing.id)

              if (error) {
                console.error('Error updating news:', error)
                result.errors++
              } else {
                result.updated++
              }
            }
          } else {
            // Insert new news item
            const { error } = await supabase
              .schema('public')
              .from('news')
              .insert({
                title: newsItem.title,
                description: newsItem.excerpt,
                content: newsItem.content,
                image_url: newsItem.image_url,
                source: newsItem.source,
                url: newsItem.source_url,
                published_at: newsItem.published_at,
                category: this.mapNewsCategory(newsItem.category),
                tags: this.extractTags(newsItem),
                relevance_score: this.calculateRelevanceScore(newsItem),
              })

            if (error) {
              console.error('Error inserting news:', error)
              result.errors++
            } else {
              result.inserted++
            }
          }
        } catch (error) {
          console.error('Error processing news item:', error)
          result.errors++
        }
      }
    } catch (error) {
      console.error('Error syncing news:', error)
      console.error('Full error details:', JSON.stringify(error, null, 2))
      result.errors++
    }

    return result
  }

  async syncVideos(): Promise<SyncResult['videos']> {
    const result = {
      fetched: 0,
      inserted: 0,
      updated: 0,
      errors: 0,
    }

    try {
      const supabase = createAdminClient()
      
      // Fetch relevant videos from YouTube
      console.log('Fetching videos from YouTube...')
      // const videos = await youTubeService.getRelevantVideos() // Commented out for build compatibility
      const videos: Video[] = [] // Fallback empty array for build compatibility
      console.log(`Fetched ${videos.length} videos from YouTube`)
      result.fetched = videos.length

      // Process each video
      for (const video of videos) {
        try {
          // Check if video already exists by youtube_id
          const { data: existing } = await supabase
            .schema('public')
            .from('videos')
            .select('id, view_count')
            .eq('youtube_id', video.youtube_id)
            .single()

          if (existing) {
            // Update view count if different
            if (existing.view_count !== video.views) {
              const { error } = await supabase
                .schema('public')
                .from('videos')
                .update({
                  view_count: video.views,
                  title: video.title,
                  description: video.description,
                  thumbnail_url: video.thumbnail_url,
                })
                .eq('id', existing.id)

              if (error) {
                console.error('Error updating video:', error)
                result.errors++
              } else {
                result.updated++
              }
            }
          } else {
            // Insert new video
            const { error } = await supabase
              .schema('public')
              .from('videos')
              .insert({
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
                relevance_score: this.calculateVideoRelevance(video),
              })

            if (error) {
              console.error('Error inserting video:', error)
              result.errors++
            } else {
              result.inserted++
            }
          }
        } catch (error) {
          console.error('Error processing video:', error)
          result.errors++
        }
      }
    } catch (error) {
      console.error('Error syncing videos:', error)
      console.error('Full error details:', JSON.stringify(error, null, 2))
      result.errors++
    }

    return result
  }

  async performSync(): Promise<SyncResult> {
    if (this.isRunning) {
      throw new Error('Sync is already running')
    }

    this.isRunning = true
    const startTime = Date.now()

    try {
      // Run both syncs in parallel
      const [newsResult, videosResult] = await Promise.all([
        this.syncNews(),
        this.syncVideos(),
      ])

      const duration = Date.now() - startTime
      this.lastSyncTime = new Date()

      const result: SyncResult = {
        news: newsResult,
        videos: videosResult,
        timestamp: this.lastSyncTime.toISOString(),
        duration,
      }

      // Log sync result
      console.log('Sync completed:', {
        ...result,
        duration: `${(duration / 1000).toFixed(2)}s`,
      })

      return result
    } finally {
      this.isRunning = false
    }
  }

  startScheduledSync(intervalHours: number = 6): void {
    if (this.syncInterval) {
      this.stopScheduledSync()
    }

    // Perform initial sync
    this.performSync().catch(error => {
      console.error('Initial sync failed:', error)
    })

    // Schedule regular syncs
    this.syncInterval = setInterval(() => {
      this.performSync().catch(error => {
        console.error('Scheduled sync failed:', error)
      })
    }, intervalHours * 60 * 60 * 1000)

    console.log(`Scheduled sync started - will run every ${intervalHours} hours`)
  }

  stopScheduledSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
      console.log('Scheduled sync stopped')
    }
  }

  getSyncStatus(): {
    isRunning: boolean
    lastSyncTime: Date | null
    isScheduled: boolean
  } {
    return {
      isRunning: this.isRunning,
      lastSyncTime: this.lastSyncTime,
      isScheduled: this.syncInterval !== null,
    }
  }

  async cleanupOldContent(daysToKeep: number = 90): Promise<{
    newsDeleted: number
    videosDeleted: number
  }> {
    const { createClient } = await import('../../supabase/client')
    const supabase = createClient()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    // Delete old news
    const { count: newsDeleted } = await supabase
      .schema('public')
      .from('news')
      .delete()
      .lt('published_at', cutoffDate.toISOString())
      .select('id', { count: 'exact', head: true })

    // Delete old videos
    const { count: videosDeleted } = await supabase
      .schema('public')
      .from('videos')
      .delete()
      .lt('published_at', cutoffDate.toISOString())
      .select('id', { count: 'exact', head: true })

    console.log(`Cleanup completed: ${newsDeleted || 0} news items and ${videosDeleted || 0} videos deleted`)

    return {
      newsDeleted: newsDeleted || 0,
      videosDeleted: videosDeleted || 0,
    }
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
      if (text.includes(keyword)) {
        tags.push(keyword)
      }
    })
    
    return [...new Set(tags)]
  }

  private calculateVideoRelevance(video: Video): number {
    let score = 50
    const text = `${video.title} ${video.description}`.toLowerCase()
    
    // High-priority keywords
    if (text.includes('contran') || text.includes('996')) score += 20
    if (text.includes('regulamentação') || text.includes('lei')) score += 15
    if (text.includes('segurança')) score += 10
    
    // Popular videos get higher score
    if (video.views > 100000) score += 15
    else if (video.views > 50000) score += 10
    else if (video.views > 10000) score += 5
    
    // Recent videos get higher score
    const daysOld = (Date.now() - new Date(video.published_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysOld < 30) score += 10
    else if (daysOld < 90) score += 5
    
    return Math.min(score, 100)
  }
}

export const syncService = new SyncService()