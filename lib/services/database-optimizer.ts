import { createAdminClient } from '@/lib/supabase/admin'

interface DatabaseHealth {
  status: 'healthy' | 'warning' | 'critical'
  checks: Array<{
    name: string
    status: 'OK' | 'WARNING' | 'CRITICAL'
    details: string
    timestamp: Date
  }>
  performance: {
    queryPerformance: Array<{
      queryType: string
      avgTimeMs: number
      totalCalls: number
      cacheHitRatio: number
    }>
    indexUsage: number
    connectionCount: number
    tablesSizes: Record<string, string>
  }
}

interface OptimizationResult {
  success: boolean
  operation: string
  details: {
    before?: any
    after?: any
    changes?: any
  }
  duration: number
  timestamp: Date
}

export class DatabaseOptimizerService {
  private supabase = createAdminClient()

  async runHealthCheck(): Promise<DatabaseHealth> {
    const startTime = Date.now()
    
    try {
      // Run database health check function
      const { data: healthChecks, error } = await this.supabase
        .rpc('check_database_health')

      if (error) throw error

      // Get query performance data
      const { data: queryPerformance } = await this.supabase
        .rpc('analyze_query_performance')

      // Get table sizes
      const tableSizes = await this.getTableSizes()

      // Get connection count
      const connectionCount = await this.getConnectionCount()

      // Determine overall status
      const checksArray = Array.isArray(healthChecks) ? healthChecks : []
      const criticalIssues = checksArray.filter((check: any) => check.status === 'CRITICAL').length || 0
      const warningIssues = checksArray.filter((check: any) => check.status === 'WARNING').length || 0

      const overallStatus = criticalIssues > 0 ? 'critical' : 
                           warningIssues > 0 ? 'warning' : 'healthy'

      // Calculate average index usage
      const avgIndexUsage = checksArray.find((check: any) => 
        check.check_name === 'Index Usage'
      )?.details?.match(/(\d+\.?\d*)%/)?.[1] || '0'

      return {
        status: overallStatus,
        checks: checksArray.map((check: any) => ({
          name: check.check_name,
          status: check.status,
          details: check.details,
          timestamp: new Date()
        })) || [],
        performance: {
          queryPerformance: (queryPerformance as any) || [],
          indexUsage: parseFloat(avgIndexUsage),
          connectionCount,
          tablesSizes: tableSizes
        }
      }

    } catch (error) {
      console.error('Database health check failed:', error)
      return {
        status: 'critical',
        checks: [{
          name: 'Health Check',
          status: 'CRITICAL',
          details: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date()
        }],
        performance: {
          queryPerformance: [],
          indexUsage: 0,
          connectionCount: 0,
          tablesSizes: {}
        }
      }
    }
  }

  async optimizeDatabase(): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = []

    // 1. Remove duplicate entries
    results.push(await this.removeDuplicates())

    // 2. Update trending scores
    results.push(await this.updateTrendingScores())

    // 3. Refresh materialized views
    results.push(await this.refreshMaterializedViews())

    // 4. Clean up old data
    results.push(await this.cleanupOldData())

    // 5. Analyze tables
    results.push(await this.analyzeTables())

    return results
  }

  private async removeDuplicates(): Promise<OptimizationResult> {
    const startTime = Date.now()
    
    try {
      const { data: newsDeleted, error: newsError } = await this.supabase
        .rpc('remove_duplicate_news')

      const { data: videosDeleted, error: videosError } = await this.supabase
        .rpc('remove_duplicate_videos')

      if (newsError || videosError) {
        throw new Error(`News: ${newsError?.message}, Videos: ${videosError?.message}`)
      }

      return {
        success: true,
        operation: 'remove_duplicates',
        details: {
          changes: {
            newsDeleted: newsDeleted || 0,
            videosDeleted: videosDeleted || 0
          }
        },
        duration: Date.now() - startTime,
        timestamp: new Date()
      }

    } catch (error) {
      return {
        success: false,
        operation: 'remove_duplicates',
        details: {
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        } as any,
        duration: Date.now() - startTime,
        timestamp: new Date()
      }
    }
  }

  private async updateTrendingScores(): Promise<OptimizationResult> {
    const startTime = Date.now()
    
    try {
      // Get before stats
      const { data: beforeStats } = await this.supabase
        .schema('public')
        .from('news')
        .select('relevance_score')
        .gte('published_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      const avgBefore = beforeStats ? beforeStats.reduce((sum, item) => sum + item.relevance_score, 0) / (beforeStats.length || 1) : 0

      // Update scores
      const { error } = await this.supabase.rpc('update_trending_scores')

      if (error) throw error

      // Get after stats
      const { data: afterStats } = await this.supabase
        .schema('public')
        .from('news')
        .select('relevance_score')
        .gte('published_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      const avgAfter = afterStats ? afterStats.reduce((sum, item) => sum + item.relevance_score, 0) / (afterStats.length || 1) : 0

      return {
        success: true,
        operation: 'update_trending_scores',
        details: {
          before: { avgRelevanceScore: avgBefore },
          after: { avgRelevanceScore: avgAfter },
          changes: { scoreDelta: avgAfter - avgBefore }
        },
        duration: Date.now() - startTime,
        timestamp: new Date()
      }

    } catch (error) {
      return {
        success: false,
        operation: 'update_trending_scores',
        details: {
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        } as any,
        duration: Date.now() - startTime,
        timestamp: new Date()
      }
    }
  }

  private async refreshMaterializedViews(): Promise<OptimizationResult> {
    const startTime = Date.now()
    
    try {
      const { error } = await this.supabase.rpc('refresh_trending_content')

      if (error) throw error

      // Get view stats
      const { data: viewData, count } = await this.supabase
        .schema('public')
        .from('mv_trending_content')
        .select('*', { count: 'exact', head: true })

      return {
        success: true,
        operation: 'refresh_materialized_views',
        details: {
          after: { trendingContentCount: count || 0 }
        },
        duration: Date.now() - startTime,
        timestamp: new Date()
      }

    } catch (error) {
      return {
        success: false,
        operation: 'refresh_materialized_views',
        details: {
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        } as any,
        duration: Date.now() - startTime,
        timestamp: new Date()
      }
    }
  }

  private async cleanupOldData(daysToKeep: number = 90): Promise<OptimizationResult> {
    const startTime = Date.now()
    
    try {
      const { data: cleanupResults, error } = await this.supabase
        .rpc('cleanup_old_content', { days_to_keep: daysToKeep })

      if (error) throw error

      return {
        success: true,
        operation: 'cleanup_old_data',
        details: {
          changes: {
            newsDeleted: (cleanupResults as any)?.[0]?.news_deleted || 0,
            videosDeleted: (cleanupResults as any)?.[0]?.videos_deleted || 0,
            analyticsDeleted: (cleanupResults as any)?.[0]?.analytics_deleted || 0,
            daysToKeep
          }
        },
        duration: Date.now() - startTime,
        timestamp: new Date()
      }

    } catch (error) {
      return {
        success: false,
        operation: 'cleanup_old_data',
        details: {
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        } as any,
        duration: Date.now() - startTime,
        timestamp: new Date()
      }
    }
  }

  private async analyzeTables(): Promise<OptimizationResult> {
    const startTime = Date.now()
    
    try {
      const { error } = await this.supabase.rpc('optimize_tables')

      if (error) throw error

      return {
        success: true,
        operation: 'analyze_tables',
        details: {
          changes: {
            tablesAnalyzed: [
              'news', 'videos', 'analytics', 'users', 
              'trending_history', 'keyword_trends'
            ]
          }
        },
        duration: Date.now() - startTime,
        timestamp: new Date()
      }

    } catch (error) {
      return {
        success: false,
        operation: 'analyze_tables',
        details: {
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        } as any,
        duration: Date.now() - startTime,
        timestamp: new Date()
      }
    }
  }

  private async getTableSizes(): Promise<Record<string, string>> {
    try {
      const tableSizesResponse = await this.supabase
        .rpc('get_table_sizes') // This would need to be created as a custom function
        .then(result => result, () => ({ data: null })) // Fallback if function doesn't exist
      const { data: tableSizes } = tableSizesResponse

      if (tableSizes) {
        return (tableSizes as any[]).reduce((acc: Record<string, string>, item: any) => {
          acc[item.table_name] = item.size
          return acc
        }, {})
      }

      // Fallback: estimate sizes
      return {
        'news': 'Unknown',
        'videos': 'Unknown',
        'analytics': 'Unknown',
        'users': 'Unknown'
      }

    } catch (error) {
      console.error('Error getting table sizes:', error)
      return {}
    }
  }

  private async getConnectionCount(): Promise<number> {
    try {
      // This would typically require admin privileges
      const connectionsResponse = await this.supabase
        .rpc('get_connection_count') // Custom function needed
        .then(result => result, () => ({ data: 0 }))
      const { data: connections } = connectionsResponse

      return (connections as number) || 0

    } catch (error) {
      console.error('Error getting connection count:', error)
      return 0
    }
  }

  async createIndexes(): Promise<OptimizationResult> {
    const startTime = Date.now()
    
    try {
      // Create additional indexes if they don't exist
      const indexQueries = [
        // Composite indexes for common query patterns
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_category_date 
         ON "public".news (category, published_at DESC)`,
        
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_channel_date 
         ON "public".videos (channel_id, published_at DESC)`,
        
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_content_date 
         ON "public".analytics (content_id, content_type, timestamp DESC)`,
        
        // Partial indexes for active content
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_active_high_score 
         ON "public".news (relevance_score DESC, published_at DESC) 
         WHERE published_at > NOW() - INTERVAL '30 days' AND relevance_score > 70`,
        
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_active_high_score 
         ON "public".videos (relevance_score DESC, view_count DESC) 
         WHERE published_at > NOW() - INTERVAL '30 days' AND relevance_score > 70`
      ]

      const results = []
      for (const query of indexQueries) {
        try {
          await this.supabase.rpc('execute_sql', { sql_query: query })
          results.push(`✓ ${query.split('IF NOT EXISTS ')[1]?.split(' ')[0] || 'Index created'}`)
        } catch (error) {
          results.push(`✗ Failed to create index: ${error}`)
        }
      }

      return {
        success: true,
        operation: 'create_indexes',
        details: {
          changes: { indexesCreated: results }
        },
        duration: Date.now() - startTime,
        timestamp: new Date()
      }

    } catch (error) {
      return {
        success: false,
        operation: 'create_indexes',
        details: {
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        } as any,
        duration: Date.now() - startTime,
        timestamp: new Date()
      }
    }
  }

  async optimizeQueries(): Promise<OptimizationResult> {
    const startTime = Date.now()
    
    try {
      // Identify and optimize slow queries
      const slowQueries = await this.identifySlowQueries()
      const optimizations = []

      for (const query of slowQueries) {
        const optimization = await this.optimizeQuery(query)
        optimizations.push(optimization)
      }

      return {
        success: true,
        operation: 'optimize_queries',
        details: {
          changes: {
            queriesAnalyzed: slowQueries.length,
            optimizationsApplied: optimizations.filter(o => o.success).length
          }
        },
        duration: Date.now() - startTime,
        timestamp: new Date()
      }

    } catch (error) {
      return {
        success: false,
        operation: 'optimize_queries',
        details: {
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        } as any,
        duration: Date.now() - startTime,
        timestamp: new Date()
      }
    }
  }

  private async identifySlowQueries(): Promise<any[]> {
    try {
      // This would typically use pg_stat_statements
      // Returning mock data for now
      return [
        { query: 'SELECT * FROM news WHERE category = ?', avgTime: 1500 },
        { query: 'SELECT * FROM videos ORDER BY view_count', avgTime: 2000 }
      ]
    } catch (error) {
      console.error('Error identifying slow queries:', error)
      return []
    }
  }

  private async optimizeQuery(query: any): Promise<{ success: boolean; details: string }> {
    try {
      // Analyze query and suggest optimizations
      // This is a simplified example
      if (query.query.includes('ORDER BY') && !query.query.includes('LIMIT')) {
        return {
          success: true,
          details: `Suggested adding LIMIT clause to query: ${query.query}`
        }
      }

      return {
        success: true,
        details: `Query analyzed: ${query.query}`
      }
    } catch (error) {
      return {
        success: false,
        details: `Failed to optimize query: ${error}`
      }
    }
  }

  async scheduleOptimizations(): Promise<void> {
    // Schedule regular optimization tasks
    setInterval(async () => {
      console.log('Running scheduled database optimization...')
      await this.refreshMaterializedViews()
      await this.updateTrendingScores()
    }, 60 * 60 * 1000) // Every hour

    setInterval(async () => {
      console.log('Running weekly database cleanup...')
      await this.cleanupOldData()
      await this.removeDuplicates()
      await this.analyzeTables()
    }, 7 * 24 * 60 * 60 * 1000) // Weekly
  }

  async getOptimizationRecommendations(): Promise<Array<{
    type: 'index' | 'query' | 'cleanup' | 'configuration'
    priority: 'high' | 'medium' | 'low'
    description: string
    impact: string
    effort: string
  }>> {
    const health = await this.runHealthCheck()
    const recommendations = []

    // Index recommendations
    if (health.performance.indexUsage < 80) {
      recommendations.push({
        type: 'index' as const,
        priority: 'high' as const,
        description: 'Low index usage detected. Consider adding indexes for frequently queried columns.',
        impact: 'High - Significant query performance improvement',
        effort: 'Medium - Requires analysis of query patterns'
      })
    }

    // Cleanup recommendations
    const newsCheck = health.checks.find(c => c.name === 'Table Sizes')
    if (newsCheck?.status === 'WARNING') {
      recommendations.push({
        type: 'cleanup' as const,
        priority: 'medium' as const,
        description: 'Large table sizes detected. Consider archiving old data.',
        impact: 'Medium - Improved query performance and reduced storage costs',
        effort: 'Low - Automated cleanup scripts available'
      })
    }

    // Query optimization recommendations
    const longQueries = health.checks.find(c => c.name === 'Long Running Queries')
    if (longQueries?.status !== 'OK') {
      recommendations.push({
        type: 'query' as const,
        priority: 'high' as const,
        description: 'Long-running queries detected. Review and optimize query patterns.',
        impact: 'High - Better user experience and reduced server load',
        effort: 'High - Requires query analysis and optimization'
      })
    }

    // Configuration recommendations
    if (health.performance.connectionCount > 150) {
      recommendations.push({
        type: 'configuration' as const,
        priority: 'medium' as const,
        description: 'High connection count. Consider connection pooling optimization.',
        impact: 'Medium - Better resource utilization',
        effort: 'Medium - Database configuration changes required'
      })
    }

    return recommendations
  }
}

// Singleton instance
export const databaseOptimizerService = new DatabaseOptimizerService()

// Start scheduled optimizations
databaseOptimizerService.scheduleOptimizations()