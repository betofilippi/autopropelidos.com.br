import { createAdminClient } from '@/lib/supabase/admin'
import { CacheService } from '@/lib/services/cache'

interface AnalyticsData {
  views: number
  uniqueViews: number
  duration: number
  bounceRate: number
  source: string
  device: string
  location: string
  timestamp: Date
}

interface TrendingScore {
  contentId: string
  contentType: 'news' | 'video'
  score: number
  factors: {
    views: number
    velocity: number
    engagement: number
    recency: number
    relevance: number
    social: number
    predicted: number
  }
  rank: number
  category: string
  timestamp: Date
}

interface PredictionModel {
  features: number[]
  weights: number[]
  bias: number
  accuracy: number
  lastTrained: Date
}

interface MLFeatures {
  viewCount: number
  viewVelocity: number
  engagementRate: number
  timeOnPage: number
  shareCount: number
  commentCount: number
  recencyScore: number
  relevanceScore: number
  seasonalityScore: number
  categoryPopularity: number
  authorCredibility: number
  keywordTrending: number
}

export class AnalyticsService {
  private cacheService = new CacheService()
  private trendingModel: PredictionModel = this.initializeModel()
  private readonly TRENDING_CACHE_KEY = 'trending_scores'
  private readonly ANALYTICS_CACHE_KEY = 'analytics_data'

  constructor() {
    this.startModelTraining()
  }

  private initializeModel(): PredictionModel {
    // Initialize with basic weights - these would be learned from training
    return {
      features: [],
      weights: [
        0.25, // viewCount
        0.20, // viewVelocity
        0.15, // engagementRate
        0.10, // timeOnPage
        0.08, // shareCount
        0.07, // commentCount
        0.15, // recencyScore
        0.12, // relevanceScore
        0.05, // seasonalityScore
        0.08, // categoryPopularity
        0.06, // authorCredibility
        0.09  // keywordTrending
      ],
      bias: 0.1,
      accuracy: 0.75,
      lastTrained: new Date()
    }
  }

  private startModelTraining() {
    // Retrain model every 6 hours
    setInterval(async () => {
      await this.trainTrendingModel()
    }, 6 * 60 * 60 * 1000)

    // Initial training after startup
    setTimeout(() => {
      this.trainTrendingModel()
    }, 60000) // 1 minute after startup
  }

  // Real-time trending calculation
  async calculateTrendingScores(): Promise<TrendingScore[]> {
    const cached = await this.cacheService.get<TrendingScore[]>(this.TRENDING_CACHE_KEY)
    if (cached) return cached

    const supabase = createAdminClient()
    const scores: TrendingScore[] = []

    // Get recent content (last 7 days)
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    // Process news articles
    const { data: news } = await supabase
      .schema('autopropelidos.com.br')
      .from('news')
      .select('*')
      .gte('published_at', cutoffDate.toISOString())
      .order('published_at', { ascending: false })

    for (const article of news || []) {
      const features = await this.extractMLFeatures(article, 'news')
      const score = this.predictTrendingScore(features)
      
      scores.push({
        contentId: article.id,
        contentType: 'news',
        score,
        factors: {
          views: features.viewCount,
          velocity: features.viewVelocity,
          engagement: features.engagementRate,
          recency: features.recencyScore,
          relevance: features.relevanceScore,
          social: features.shareCount + features.commentCount,
          predicted: score
        },
        rank: 0, // Will be set after sorting
        category: article.category,
        timestamp: new Date()
      })
    }

    // Process videos
    const { data: videos } = await supabase
      .schema('autopropelidos.com.br')
      .from('videos')
      .select('*')
      .gte('published_at', cutoffDate.toISOString())
      .order('published_at', { ascending: false })

    for (const video of videos || []) {
      const features = await this.extractMLFeatures(video, 'video')
      const score = this.predictTrendingScore(features)
      
      scores.push({
        contentId: video.id,
        contentType: 'video',
        score,
        factors: {
          views: features.viewCount,
          velocity: features.viewVelocity,
          engagement: features.engagementRate,
          recency: features.recencyScore,
          relevance: features.relevanceScore,
          social: features.shareCount + features.commentCount,
          predicted: score
        },
        rank: 0,
        category: video.category,
        timestamp: new Date()
      })
    }

    // Sort by score and assign ranks
    scores.sort((a, b) => b.score - a.score)
    scores.forEach((score, index) => {
      score.rank = index + 1
    })

    // Cache for 5 minutes
    await this.cacheService.set(this.TRENDING_CACHE_KEY, scores, { ttl: 300 })

    return scores
  }

  private async extractMLFeatures(content: any, type: 'news' | 'video'): Promise<MLFeatures> {
    const supabase = createAdminClient()
    const now = new Date()
    const publishedAt = new Date(content.published_at)
    const ageInHours = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60)

    // Get analytics data for this content
    const { data: analytics } = await supabase
      .schema('autopropelidos.com.br')
      .from('analytics')
      .select('*')
      .eq('content_id', content.id)
      .eq('content_type', type)

    const totalViews = analytics?.reduce((sum, a) => sum + a.views, 0) || 0
    const uniqueViews = analytics?.reduce((sum, a) => sum + a.unique_views, 0) || 0
    const totalDuration = analytics?.reduce((sum, a) => sum + a.duration, 0) || 0
    const avgDuration = analytics?.length ? totalDuration / analytics.length : 0

    // Calculate view velocity (views per hour)
    const viewVelocity = ageInHours > 0 ? totalViews / ageInHours : 0

    // Calculate engagement rate
    const engagementRate = totalViews > 0 ? (uniqueViews / totalViews) * 100 : 0

    // Get social metrics
    const { data: socialMetrics } = await supabase
      .schema('autopropelidos.com.br')
      .from('social_metrics')
      .select('*')
      .eq('content_id', content.id)
      .single()

    // Calculate recency score (decays over time)
    const recencyScore = Math.exp(-ageInHours / 24) * 100

    // Calculate relevance score based on keywords and tags
    const relevanceScore = this.calculateRelevanceScore(content)

    // Calculate seasonality score
    const seasonalityScore = this.calculateSeasonalityScore(content, now)

    // Get category popularity
    const categoryPopularity = await this.getCategoryPopularity(content.category)

    // Calculate author credibility (for news)
    const authorCredibility = type === 'news' ? 
      await this.calculateAuthorCredibility(content.source) : 50

    // Calculate keyword trending score
    const keywordTrending = await this.calculateKeywordTrendingScore(content)

    return {
      viewCount: totalViews,
      viewVelocity,
      engagementRate,
      timeOnPage: avgDuration,
      shareCount: socialMetrics?.shares || 0,
      commentCount: socialMetrics?.comments || 0,
      recencyScore,
      relevanceScore,
      seasonalityScore,
      categoryPopularity,
      authorCredibility,
      keywordTrending
    }
  }

  private predictTrendingScore(features: MLFeatures): number {
    const featureVector = [
      this.normalizeFeature(features.viewCount, 0, 10000),
      this.normalizeFeature(features.viewVelocity, 0, 1000),
      this.normalizeFeature(features.engagementRate, 0, 100),
      this.normalizeFeature(features.timeOnPage, 0, 600),
      this.normalizeFeature(features.shareCount, 0, 1000),
      this.normalizeFeature(features.commentCount, 0, 500),
      this.normalizeFeature(features.recencyScore, 0, 100),
      this.normalizeFeature(features.relevanceScore, 0, 100),
      this.normalizeFeature(features.seasonalityScore, 0, 100),
      this.normalizeFeature(features.categoryPopularity, 0, 100),
      this.normalizeFeature(features.authorCredibility, 0, 100),
      this.normalizeFeature(features.keywordTrending, 0, 100)
    ]

    // Linear regression prediction
    let score = this.trendingModel.bias
    for (let i = 0; i < featureVector.length; i++) {
      score += featureVector[i] * this.trendingModel.weights[i]
    }

    // Apply sigmoid activation to get score between 0 and 100
    return (1 / (1 + Math.exp(-score))) * 100
  }

  private normalizeFeature(value: number, min: number, max: number): number {
    return Math.min(Math.max((value - min) / (max - min), 0), 1)
  }

  private calculateRelevanceScore(content: any): number {
    let score = 50 // Base score
    const text = `${content.title} ${content.description || content.content || ''}`.toLowerCase()
    
    // High-priority keywords
    const highPriorityKeywords = ['contran', '996', 'regulamentação', 'lei federal', 'segurança']
    const mediumPriorityKeywords = ['patinete', 'bicicleta', 'elétrico', 'mobilidade', 'urbana']
    const lowPriorityKeywords = ['trânsito', 'fiscalização', 'multa', 'norma']
    
    highPriorityKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 15
    })
    
    mediumPriorityKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 10
    })
    
    lowPriorityKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 5
    })
    
    return Math.min(score, 100)
  }

  private calculateSeasonalityScore(content: any, now: Date): number {
    const month = now.getMonth()
    const dayOfWeek = now.getDay()
    const hour = now.getHours()
    
    let score = 50 // Base score
    
    // Seasonal patterns for mobility content
    if (month >= 3 && month <= 9) { // Spring/Summer
      score += 20 // Higher interest in mobility during warmer months
    }
    
    // Weekly patterns
    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Weekdays
      score += 15 // Higher engagement on weekdays
    }
    
    // Daily patterns
    if (hour >= 7 && hour <= 9) { // Morning rush
      score += 10
    } else if (hour >= 17 && hour <= 19) { // Evening rush
      score += 10
    }
    
    return Math.min(score, 100)
  }

  private async getCategoryPopularity(category: string): Promise<number> {
    const supabase = createAdminClient()
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    // Get view count for this category in the last week
    const { data: categoryViews } = await supabase
      .schema('autopropelidos.com.br')
      .from('analytics')
      .select('views')
      .eq('category', category)
      .gte('timestamp', cutoffDate.toISOString())
    
    const totalViews = categoryViews?.reduce((sum, item) => sum + item.views, 0) || 0
    
    // Normalize to 0-100 scale
    return Math.min((totalViews / 1000) * 100, 100)
  }

  private async calculateAuthorCredibility(source: string): Promise<number> {
    const supabase = createAdminClient()
    
    // Get historical performance of this source
    const { data: sourcePerformance } = await supabase
      .schema('autopropelidos.com.br')
      .from('news')
      .select('relevance_score, view_count')
      .eq('source', source)
      .limit(10)
    
    if (!sourcePerformance || sourcePerformance.length === 0) return 50
    
    const avgRelevance = sourcePerformance.reduce((sum, item) => sum + item.relevance_score, 0) / sourcePerformance.length
    const avgViews = sourcePerformance.reduce((sum, item) => sum + (item.view_count || 0), 0) / sourcePerformance.length
    
    // Combine relevance and popularity
    return Math.min((avgRelevance + (avgViews / 100)) / 2, 100)
  }

  private async calculateKeywordTrendingScore(content: any): Promise<number> {
    const supabase = createAdminClient()
    const keywords = content.tags || []
    
    if (keywords.length === 0) return 50
    
    let totalScore = 0
    let keywordCount = 0
    
    for (const keyword of keywords) {
      // Get recent mentions of this keyword
      const { data: keywordMentions } = await supabase
        .schema('autopropelidos.com.br')
        .from('keyword_trends')
        .select('mentions, trend_score')
        .eq('keyword', keyword)
        .order('timestamp', { ascending: false })
        .limit(1)
      
      if (keywordMentions && keywordMentions.length > 0) {
        totalScore += keywordMentions[0].trend_score
        keywordCount++
      }
    }
    
    return keywordCount > 0 ? totalScore / keywordCount : 50
  }

  // Machine learning model training
  private async trainTrendingModel(): Promise<void> {
    console.log('Starting trending model training...')
    
    try {
      const supabase = createAdminClient()
      
      // Get training data from the last 30 days
      const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      // Get content with their actual performance metrics
      const { data: trainingData } = await supabase
        .schema('autopropelidos.com.br')
        .from('trending_history')
        .select('*')
        .gte('timestamp', cutoffDate.toISOString())
        .order('timestamp', { ascending: false })
      
      if (!trainingData || trainingData.length < 100) {
        console.log('Insufficient training data, skipping model training')
        return
      }
      
      // Extract features and labels
      const features: number[][] = []
      const labels: number[] = []
      
      for (const item of trainingData) {
        const featureVector = [
          this.normalizeFeature(item.view_count, 0, 10000),
          this.normalizeFeature(item.view_velocity, 0, 1000),
          this.normalizeFeature(item.engagement_rate, 0, 100),
          this.normalizeFeature(item.time_on_page, 0, 600),
          this.normalizeFeature(item.share_count, 0, 1000),
          this.normalizeFeature(item.comment_count, 0, 500),
          this.normalizeFeature(item.recency_score, 0, 100),
          this.normalizeFeature(item.relevance_score, 0, 100),
          this.normalizeFeature(item.seasonality_score, 0, 100),
          this.normalizeFeature(item.category_popularity, 0, 100),
          this.normalizeFeature(item.author_credibility, 0, 100),
          this.normalizeFeature(item.keyword_trending, 0, 100)
        ]
        
        features.push(featureVector)
        labels.push(item.actual_trending_score)
      }
      
      // Train linear regression model using gradient descent
      const newModel = await this.trainLinearRegression(features, labels)
      
      // Evaluate model performance
      const accuracy = this.evaluateModel(newModel, features, labels)
      
      // Update model if it's better than the current one
      if (accuracy > this.trendingModel.accuracy) {
        this.trendingModel = {
          ...newModel,
          accuracy,
          lastTrained: new Date()
        }
        
        console.log(`Model updated with accuracy: ${accuracy.toFixed(2)}`)
        
        // Save model to database
        await this.saveModel(this.trendingModel)
      }
      
    } catch (error) {
      console.error('Error training trending model:', error)
    }
  }

  private async trainLinearRegression(features: number[][], labels: number[]): Promise<Omit<PredictionModel, 'accuracy' | 'lastTrained'>> {
    const learningRate = 0.01
    const epochs = 1000
    const numFeatures = features[0].length
    
    // Initialize weights and bias
    let weights = new Array(numFeatures).fill(0).map(() => Math.random() * 0.1)
    let bias = 0
    
    // Gradient descent
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalError = 0
      const weightGradients = new Array(numFeatures).fill(0)
      let biasGradient = 0
      
      for (let i = 0; i < features.length; i++) {
        // Forward pass
        let prediction = bias
        for (let j = 0; j < numFeatures; j++) {
          prediction += features[i][j] * weights[j]
        }
        
        // Calculate error
        const error = prediction - labels[i]
        totalError += error * error
        
        // Calculate gradients
        for (let j = 0; j < numFeatures; j++) {
          weightGradients[j] += error * features[i][j]
        }
        biasGradient += error
      }
      
      // Update weights and bias
      for (let j = 0; j < numFeatures; j++) {
        weights[j] -= learningRate * weightGradients[j] / features.length
      }
      bias -= learningRate * biasGradient / features.length
      
      // Early stopping if error is small enough
      if (totalError / features.length < 0.01) {
        break
      }
    }
    
    return {
      features: [],
      weights,
      bias
    }
  }

  private evaluateModel(model: Omit<PredictionModel, 'accuracy' | 'lastTrained'>, features: number[][], labels: number[]): number {
    let totalError = 0
    let totalAbsoluteError = 0
    
    for (let i = 0; i < features.length; i++) {
      let prediction = model.bias
      for (let j = 0; j < features[i].length; j++) {
        prediction += features[i][j] * model.weights[j]
      }
      
      const error = prediction - labels[i]
      totalError += error * error
      totalAbsoluteError += Math.abs(error)
    }
    
    const mse = totalError / features.length
    const mae = totalAbsoluteError / features.length
    
    // Return accuracy as 1 - normalized MAE
    return Math.max(0, 1 - (mae / 100))
  }

  private async saveModel(model: PredictionModel): Promise<void> {
    const supabase = createAdminClient()
    
    await supabase
      .schema('autopropelidos.com.br')
      .from('ml_models')
      .upsert({
        model_name: 'trending_predictor',
        model_data: JSON.stringify(model),
        accuracy: model.accuracy,
        created_at: new Date().toISOString()
      })
  }

  // Viral content detection
  async detectViralContent(): Promise<Array<{
    contentId: string
    contentType: 'news' | 'video'
    viralScore: number
    factors: string[]
  }>> {
    const trendingScores = await this.calculateTrendingScores()
    const viralContent = []
    
    for (const score of trendingScores) {
      const viralFactors = []
      let viralScore = 0
      
      // High view velocity
      if (score.factors.velocity > 100) {
        viralFactors.push('high_velocity')
        viralScore += 30
      }
      
      // High engagement rate
      if (score.factors.engagement > 80) {
        viralFactors.push('high_engagement')
        viralScore += 25
      }
      
      // High social sharing
      if (score.factors.social > 50) {
        viralFactors.push('high_social')
        viralScore += 20
      }
      
      // Exponential growth pattern
      if (score.factors.velocity > score.factors.views * 0.1) {
        viralFactors.push('exponential_growth')
        viralScore += 25
      }
      
      if (viralScore > 70) {
        viralContent.push({
          contentId: score.contentId,
          contentType: score.contentType,
          viralScore,
          factors: viralFactors
        })
      }
    }
    
    return viralContent.sort((a, b) => b.viralScore - a.viralScore)
  }

  // Trend prediction system
  async predictTrends(days: number = 7): Promise<Array<{
    keyword: string
    currentScore: number
    predictedScore: number
    confidence: number
    trend: 'rising' | 'falling' | 'stable'
  }>> {
    const supabase = createAdminClient()
    
    // Get historical keyword trends
    const { data: keywordHistory } = await supabase
      .schema('autopropelidos.com.br')
      .from('keyword_trends')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: true })
    
    const predictions = []
    const keywordGroups = this.groupBy(keywordHistory || [], 'keyword')
    
    for (const [keyword, history] of Object.entries(keywordGroups)) {
      if (history.length < 5) continue // Need at least 5 data points
      
      const currentScore = history[history.length - 1].trend_score
      const predictedScore = this.predictKeywordTrend(history, days)
      const confidence = this.calculatePredictionConfidence(history)
      
      const trend = predictedScore > currentScore * 1.1 ? 'rising' :
                   predictedScore < currentScore * 0.9 ? 'falling' : 'stable'
      
      predictions.push({
        keyword,
        currentScore,
        predictedScore,
        confidence,
        trend
      })
    }
    
    return predictions.sort((a, b) => b.predictedScore - a.predictedScore)
  }

  private predictKeywordTrend(history: any[], days: number): number {
    // Simple linear regression for trend prediction
    const x = history.map((_, index) => index)
    const y = history.map(item => item.trend_score)
    
    const n = x.length
    const sumX = x.reduce((sum, val) => sum + val, 0)
    const sumY = y.reduce((sum, val) => sum + val, 0)
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0)
    const sumXX = x.reduce((sum, val) => sum + val * val, 0)
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n
    
    // Predict for future days
    const futureX = n + days
    return Math.max(0, Math.min(100, slope * futureX + intercept))
  }

  private calculatePredictionConfidence(history: any[]): number {
    // Calculate R-squared for confidence
    const y = history.map(item => item.trend_score)
    const mean = y.reduce((sum, val) => sum + val, 0) / y.length
    
    const totalSumSquares = y.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0)
    const residualSumSquares = y.reduce((sum, val, i) => {
      const predicted = this.predictKeywordTrend(history.slice(0, i + 1), 0)
      return sum + Math.pow(val - predicted, 2)
    }, 0)
    
    const rSquared = 1 - (residualSumSquares / totalSumSquares)
    return Math.max(0, Math.min(1, rSquared)) * 100
  }

  private groupBy(array: any[], key: string): Record<string, any[]> {
    return array.reduce((groups, item) => {
      const value = item[key]
      if (!groups[value]) {
        groups[value] = []
      }
      groups[value].push(item)
      return groups
    }, {} as Record<string, any[]>)
  }

  // Analytics helper methods
  async getDailyViews(days: number = 30): Promise<Array<{date: string, views: number}>> {
    const supabase = createAdminClient()
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    const { data: dailyViews } = await supabase
      .schema('autopropelidos.com.br')
      .from('analytics')
      .select('timestamp, views')
      .gte('timestamp', cutoffDate.toISOString())
      .order('timestamp', { ascending: true })
    
    // Group by date
    const viewsByDate = dailyViews?.reduce((acc, item) => {
      const date = new Date(item.timestamp).toISOString().split('T')[0]
      if (!acc[date]) acc[date] = 0
      acc[date] += item.views
      return acc
    }, {} as Record<string, number>) || {}
    
    return Object.entries(viewsByDate).map(([date, views]) => ({ date, views }))
  }

  async getTopContent(limit: number = 10): Promise<Array<{
    contentId: string
    contentType: 'news' | 'video'
    title: string
    views: number
    score: number
  }>> {
    const trendingScores = await this.calculateTrendingScores()
    return trendingScores.slice(0, limit).map(score => ({
      contentId: score.contentId,
      contentType: score.contentType,
      title: 'Content Title', // This would need to be fetched from the content table
      views: score.factors.views,
      score: score.score
    }))
  }

  async getUserEngagement(): Promise<{
    avgTimeOnPage: number
    bounceRate: number
    pageViews: number
    uniqueUsers: number
  }> {
    const supabase = createAdminClient()
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const { data: engagement } = await supabase
      .schema('autopropelidos.com.br')
      .from('analytics')
      .select('duration, bounce_rate, views, unique_views')
      .gte('timestamp', cutoffDate.toISOString())
    
    if (!engagement || engagement.length === 0) {
      return { avgTimeOnPage: 0, bounceRate: 0, pageViews: 0, uniqueUsers: 0 }
    }
    
    const avgTimeOnPage = engagement.reduce((sum, item) => sum + item.duration, 0) / engagement.length
    const avgBounceRate = engagement.reduce((sum, item) => sum + (item.bounce_rate || 0), 0) / engagement.length
    const totalPageViews = engagement.reduce((sum, item) => sum + item.views, 0)
    const totalUniqueUsers = engagement.reduce((sum, item) => sum + item.unique_views, 0)
    
    return {
      avgTimeOnPage,
      bounceRate: avgBounceRate,
      pageViews: totalPageViews,
      uniqueUsers: totalUniqueUsers
    }
  }

  async getTrafficSources(): Promise<Array<{source: string, percentage: number}>> {
    const supabase = createAdminClient()
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const { data: traffic } = await supabase
      .schema('autopropelidos.com.br')
      .from('analytics')
      .select('source, views')
      .gte('timestamp', cutoffDate.toISOString())
    
    const sourceViews = traffic?.reduce((acc, item) => {
      if (!acc[item.source]) acc[item.source] = 0
      acc[item.source] += item.views
      return acc
    }, {} as Record<string, number>) || {}
    
    const totalViews = Object.values(sourceViews).reduce((sum, views) => sum + views, 0)
    
    return Object.entries(sourceViews).map(([source, views]) => ({
      source,
      percentage: (views / totalViews) * 100
    }))
  }

  async getDeviceStats(): Promise<Array<{device: string, percentage: number}>> {
    const supabase = createAdminClient()
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const { data: devices } = await supabase
      .schema('autopropelidos.com.br')
      .from('analytics')
      .select('device, views')
      .gte('timestamp', cutoffDate.toISOString())
    
    const deviceViews = devices?.reduce((acc, item) => {
      if (!acc[item.device]) acc[item.device] = 0
      acc[item.device] += item.views
      return acc
    }, {} as Record<string, number>) || {}
    
    const totalViews = Object.values(deviceViews).reduce((sum, views) => sum + views, 0)
    
    return Object.entries(deviceViews).map(([device, views]) => ({
      device,
      percentage: (views / totalViews) * 100
    }))
  }

  async processRecentContent(): Promise<number> {
    // This would process recent content for analytics
    // Return the number of processed items
    return 100 // Placeholder
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService()

// Cleanup on process exit
process.on('SIGINT', async () => {
  console.log('Analytics service shutting down...')
})

process.on('SIGTERM', async () => {
  console.log('Analytics service shutting down...')
})