-- Database Optimization for AutoPropelidos Portal
-- This file contains optimizations for performance, security, and scalability

-- ==================================================
-- 1. ROW LEVEL SECURITY POLICIES
-- ==================================================

-- Enable RLS on all tables
ALTER TABLE "autopropelidos.com.br".news ENABLE ROW LEVEL SECURITY;
ALTER TABLE "autopropelidos.com.br".videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE "autopropelidos.com.br".analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE "autopropelidos.com.br".users ENABLE ROW LEVEL SECURITY;
ALTER TABLE "autopropelidos.com.br".admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE "autopropelidos.com.br".content_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE "autopropelidos.com.br".admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE "autopropelidos.com.br".health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE "autopropelidos.com.br".social_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE "autopropelidos.com.br".keyword_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE "autopropelidos.com.br".trending_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE "autopropelidos.com.br".ml_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE "autopropelidos.com.br".system_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read published news" ON "autopropelidos.com.br".news
    FOR SELECT USING (true);

CREATE POLICY "Public can read published videos" ON "autopropelidos.com.br".videos
    FOR SELECT USING (true);

-- Analytics policies - public can insert, only authenticated can read
CREATE POLICY "Public can insert analytics" ON "autopropelidos.com.br".analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can read analytics" ON "autopropelidos.com.br".analytics
    FOR SELECT USING (auth.role() = 'authenticated');

-- User policies
CREATE POLICY "Users can read own data" ON "autopropelidos.com.br".users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON "autopropelidos.com.br".users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can register" ON "autopropelidos.com.br".users
    FOR INSERT WITH CHECK (true);

-- Admin policies
CREATE POLICY "Only admins can access admin_users" ON "autopropelidos.com.br".admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "autopropelidos.com.br".admin_users 
            WHERE id = auth.uid() AND active = true
        )
    );

CREATE POLICY "Only admins can access content_queue" ON "autopropelidos.com.br".content_queue
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "autopropelidos.com.br".admin_users 
            WHERE id = auth.uid() AND active = true
        )
    );

CREATE POLICY "Only admins can access admin_logs" ON "autopropelidos.com.br".admin_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "autopropelidos.com.br".admin_users 
            WHERE id = auth.uid() AND active = true
        )
    );

CREATE POLICY "Only admins can access health_alerts" ON "autopropelidos.com.br".health_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "autopropelidos.com.br".admin_users 
            WHERE id = auth.uid() AND active = true
        )
    );

CREATE POLICY "Only admins can access system_settings" ON "autopropelidos.com.br".system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "autopropelidos.com.br".admin_users 
            WHERE id = auth.uid() AND active = true
        )
    );

-- Content management policies
CREATE POLICY "Authenticated can read social_metrics" ON "autopropelidos.com.br".social_metrics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read keyword_trends" ON "autopropelidos.com.br".keyword_trends
    FOR SELECT USING (true);

CREATE POLICY "Authenticated can read trending_history" ON "autopropelidos.com.br".trending_history
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can access ml_models" ON "autopropelidos.com.br".ml_models
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "autopropelidos.com.br".admin_users 
            WHERE id = auth.uid() AND active = true
        )
    );

-- ==================================================
-- 2. DATABASE INDEXING STRATEGY
-- ==================================================

-- News table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_published_at 
    ON "autopropelidos.com.br".news (published_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_category 
    ON "autopropelidos.com.br".news (category);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_relevance_score 
    ON "autopropelidos.com.br".news (relevance_score DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_tags 
    ON "autopropelidos.com.br".news USING GIN (tags);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_url 
    ON "autopropelidos.com.br".news (url);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_source 
    ON "autopropelidos.com.br".news (source);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_full_text 
    ON "autopropelidos.com.br".news USING GIN (
        to_tsvector('portuguese', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, ''))
    );

-- Videos table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_published_at 
    ON "autopropelidos.com.br".videos (published_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_view_count 
    ON "autopropelidos.com.br".videos (view_count DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_relevance_score 
    ON "autopropelidos.com.br".videos (relevance_score DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_youtube_id 
    ON "autopropelidos.com.br".videos (youtube_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_channel 
    ON "autopropelidos.com.br".videos (channel_id, channel_name);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_category 
    ON "autopropelidos.com.br".videos (category);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_tags 
    ON "autopropelidos.com.br".videos USING GIN (tags);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_full_text 
    ON "autopropelidos.com.br".videos USING GIN (
        to_tsvector('portuguese', title || ' ' || COALESCE(description, ''))
    );

-- Analytics table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_timestamp 
    ON "autopropelidos.com.br".analytics (timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_content 
    ON "autopropelidos.com.br".analytics (content_id, content_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_user 
    ON "autopropelidos.com.br".analytics (user_id) WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_source 
    ON "autopropelidos.com.br".analytics (source);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_device 
    ON "autopropelidos.com.br".analytics (device);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_location 
    ON "autopropelidos.com.br".analytics (location) WHERE location IS NOT NULL;

-- Trending and ML indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trending_history_timestamp 
    ON "autopropelidos.com.br".trending_history (timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trending_history_content 
    ON "autopropelidos.com.br".trending_history (content_id, content_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_keyword_trends_keyword 
    ON "autopropelidos.com.br".keyword_trends (keyword);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_keyword_trends_timestamp 
    ON "autopropelidos.com.br".keyword_trends (timestamp DESC);

-- User and admin indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email 
    ON "autopropelidos.com.br".users (email);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at 
    ON "autopropelidos.com.br".users (created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_subscription 
    ON "autopropelidos.com.br".users (subscription_status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_logs_timestamp 
    ON "autopropelidos.com.br".admin_logs (timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_logs_type 
    ON "autopropelidos.com.br".admin_logs (type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_logs_severity 
    ON "autopropelidos.com.br".admin_logs (severity);

-- Content queue indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_queue_status 
    ON "autopropelidos.com.br".content_queue (status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_queue_type 
    ON "autopropelidos.com.br".content_queue (type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_queue_created_at 
    ON "autopropelidos.com.br".content_queue (created_at DESC);

-- ==================================================
-- 3. QUERY OPTIMIZATION FUNCTIONS
-- ==================================================

-- Function to get trending content efficiently
CREATE OR REPLACE FUNCTION "autopropelidos.com.br".get_trending_content(
    content_type_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    title TEXT,
    content_type TEXT,
    relevance_score INTEGER,
    view_count INTEGER,
    published_at TIMESTAMPTZ,
    category TEXT,
    tags TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN content_type_filter = 'news' OR content_type_filter IS NULL THEN n.id
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'news' OR content_type_filter IS NULL THEN n.title
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'news' OR content_type_filter IS NULL THEN 'news'::TEXT
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'news' OR content_type_filter IS NULL THEN n.relevance_score
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'news' OR content_type_filter IS NULL THEN COALESCE(n.view_count, 0)
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'news' OR content_type_filter IS NULL THEN n.published_at
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'news' OR content_type_filter IS NULL THEN n.category::TEXT
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'news' OR content_type_filter IS NULL THEN n.tags
            ELSE NULL
        END
    FROM "autopropelidos.com.br".news n
    WHERE (content_type_filter IS NULL OR content_type_filter = 'news')
        AND n.published_at > NOW() - INTERVAL '7 days'
    
    UNION ALL
    
    SELECT 
        CASE 
            WHEN content_type_filter = 'video' OR content_type_filter IS NULL THEN v.id
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'video' OR content_type_filter IS NULL THEN v.title
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'video' OR content_type_filter IS NULL THEN 'video'::TEXT
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'video' OR content_type_filter IS NULL THEN v.relevance_score
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'video' OR content_type_filter IS NULL THEN COALESCE(v.view_count, 0)
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'video' OR content_type_filter IS NULL THEN v.published_at
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'video' OR content_type_filter IS NULL THEN v.category::TEXT
            ELSE NULL
        END,
        CASE 
            WHEN content_type_filter = 'video' OR content_type_filter IS NULL THEN v.tags
            ELSE NULL
        END
    FROM "autopropelidos.com.br".videos v
    WHERE (content_type_filter IS NULL OR content_type_filter = 'video')
        AND v.published_at > NOW() - INTERVAL '7 days'
    
    ORDER BY relevance_score DESC, view_count DESC, published_at DESC
    LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old content
CREATE OR REPLACE FUNCTION "autopropelidos.com.br".cleanup_old_content(
    days_to_keep INTEGER DEFAULT 90
)
RETURNS TABLE(
    news_deleted INTEGER,
    videos_deleted INTEGER,
    analytics_deleted INTEGER
) AS $$
DECLARE
    cutoff_date TIMESTAMPTZ;
    news_count INTEGER;
    videos_count INTEGER;
    analytics_count INTEGER;
BEGIN
    cutoff_date := NOW() - (days_to_keep || ' days')::INTERVAL;
    
    -- Delete old news
    WITH deleted_news AS (
        DELETE FROM "autopropelidos.com.br".news 
        WHERE published_at < cutoff_date 
        RETURNING 1
    )
    SELECT COUNT(*) INTO news_count FROM deleted_news;
    
    -- Delete old videos
    WITH deleted_videos AS (
        DELETE FROM "autopropelidos.com.br".videos 
        WHERE published_at < cutoff_date 
        RETURNING 1
    )
    SELECT COUNT(*) INTO videos_count FROM deleted_videos;
    
    -- Delete old analytics (keep more recent data)
    WITH deleted_analytics AS (
        DELETE FROM "autopropelidos.com.br".analytics 
        WHERE timestamp < NOW() - INTERVAL '180 days'
        RETURNING 1
    )
    SELECT COUNT(*) INTO analytics_count FROM deleted_analytics;
    
    RETURN QUERY SELECT news_count, videos_count, analytics_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove duplicate entries
CREATE OR REPLACE FUNCTION "autopropelidos.com.br".remove_duplicate_news()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH duplicates AS (
        SELECT id, 
               ROW_NUMBER() OVER (PARTITION BY url ORDER BY created_at DESC) as rn
        FROM "autopropelidos.com.br".news
    ),
    deleted_rows AS (
        DELETE FROM "autopropelidos.com.br".news 
        WHERE id IN (SELECT id FROM duplicates WHERE rn > 1)
        RETURNING 1
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted_rows;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION "autopropelidos.com.br".remove_duplicate_videos()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH duplicates AS (
        SELECT id, 
               ROW_NUMBER() OVER (PARTITION BY youtube_id ORDER BY created_at DESC) as rn
        FROM "autopropelidos.com.br".videos
    ),
    deleted_rows AS (
        DELETE FROM "autopropelidos.com.br".videos 
        WHERE id IN (SELECT id FROM duplicates WHERE rn > 1)
        RETURNING 1
    )
    SELECT COUNT(*) INTO deleted_rows FROM deleted_rows;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update trending scores
CREATE OR REPLACE FUNCTION "autopropelidos.com.br".update_trending_scores()
RETURNS VOID AS $$
BEGIN
    -- Update news relevance scores based on recent analytics
    UPDATE "autopropelidos.com.br".news 
    SET relevance_score = LEAST(100, GREATEST(0, 
        relevance_score + 
        CASE 
            WHEN published_at > NOW() - INTERVAL '24 hours' THEN 10
            WHEN published_at > NOW() - INTERVAL '7 days' THEN 5
            ELSE 0
        END +
        COALESCE((
            SELECT LEAST(20, view_count / 100) 
            FROM "autopropelidos.com.br".analytics a 
            WHERE a.content_id = news.id 
                AND a.content_type = 'news'
                AND a.timestamp > NOW() - INTERVAL '7 days'
            ORDER BY timestamp DESC LIMIT 1
        ), 0)
    ))
    WHERE published_at > NOW() - INTERVAL '30 days';
    
    -- Update video relevance scores
    UPDATE "autopropelidos.com.br".videos 
    SET relevance_score = LEAST(100, GREATEST(0, 
        relevance_score + 
        CASE 
            WHEN published_at > NOW() - INTERVAL '24 hours' THEN 10
            WHEN published_at > NOW() - INTERVAL '7 days' THEN 5
            ELSE 0
        END +
        COALESCE((
            SELECT LEAST(20, view_count / 1000) 
            FROM "autopropelidos.com.br".analytics a 
            WHERE a.content_id = videos.id 
                AND a.content_type = 'video'
                AND a.timestamp > NOW() - INTERVAL '7 days'
            ORDER BY timestamp DESC LIMIT 1
        ), 0)
    ))
    WHERE published_at > NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to optimize tables
CREATE OR REPLACE FUNCTION "autopropelidos.com.br".optimize_tables()
RETURNS VOID AS $$
BEGIN
    -- Analyze all tables for better query planning
    ANALYZE "autopropelidos.com.br".news;
    ANALYZE "autopropelidos.com.br".videos;
    ANALYZE "autopropelidos.com.br".analytics;
    ANALYZE "autopropelidos.com.br".users;
    ANALYZE "autopropelidos.com.br".trending_history;
    ANALYZE "autopropelidos.com.br".keyword_trends;
    
    -- Note: VACUUM is not available in functions, would need to be run separately
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- 4. CONNECTION POOLING AND PERFORMANCE SETTINGS
-- ==================================================

-- These settings would typically be set at the database level
-- Included here for documentation purposes

-- Connection settings (to be applied by DBA)
-- ALTER SYSTEM SET max_connections = 200;
-- ALTER SYSTEM SET shared_buffers = '256MB';
-- ALTER SYSTEM SET effective_cache_size = '1GB';
-- ALTER SYSTEM SET maintenance_work_mem = '64MB';
-- ALTER SYSTEM SET checkpoint_completion_target = 0.9;
-- ALTER SYSTEM SET wal_buffers = '16MB';
-- ALTER SYSTEM SET default_statistics_target = 100;
-- ALTER SYSTEM SET random_page_cost = 1.1;
-- ALTER SYSTEM SET effective_io_concurrency = 200;

-- ==================================================
-- 5. BACKUP AUTOMATION TRIGGERS
-- ==================================================

-- Function to log important data changes
CREATE OR REPLACE FUNCTION "autopropelidos.com.br".log_data_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "autopropelidos.com.br".admin_logs (type, message, severity, timestamp)
    VALUES (
        TG_OP || '_' || TG_TABLE_NAME,
        'Data change in ' || TG_TABLE_NAME || ' - ' || TG_OP,
        'info',
        NOW()
    );
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for important tables
CREATE TRIGGER tr_news_changes
    AFTER INSERT OR UPDATE OR DELETE ON "autopropelidos.com.br".news
    FOR EACH ROW EXECUTE FUNCTION "autopropelidos.com.br".log_data_changes();

CREATE TRIGGER tr_videos_changes
    AFTER INSERT OR UPDATE OR DELETE ON "autopropelidos.com.br".videos
    FOR EACH ROW EXECUTE FUNCTION "autopropelidos.com.br".log_data_changes();

CREATE TRIGGER tr_admin_users_changes
    AFTER INSERT OR UPDATE OR DELETE ON "autopropelidos.com.br".admin_users
    FOR EACH ROW EXECUTE FUNCTION "autopropelidos.com.br".log_data_changes();

-- ==================================================
-- 6. SECURITY HARDENING
-- ==================================================

-- Revoke unnecessary permissions
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

-- Create read-only role for analytics
CREATE ROLE autopropelidos_analytics_reader;
GRANT USAGE ON SCHEMA "autopropelidos.com.br" TO autopropelidos_analytics_reader;
GRANT SELECT ON "autopropelidos.com.br".analytics TO autopropelidos_analytics_reader;
GRANT SELECT ON "autopropelidos.com.br".trending_history TO autopropelidos_analytics_reader;
GRANT SELECT ON "autopropelidos.com.br".keyword_trends TO autopropelidos_analytics_reader;

-- Create content manager role
CREATE ROLE autopropelidos_content_manager;
GRANT USAGE ON SCHEMA "autopropelidos.com.br" TO autopropelidos_content_manager;
GRANT SELECT, INSERT, UPDATE ON "autopropelidos.com.br".news TO autopropelidos_content_manager;
GRANT SELECT, INSERT, UPDATE ON "autopropelidos.com.br".videos TO autopropelidos_content_manager;
GRANT SELECT, INSERT, UPDATE, DELETE ON "autopropelidos.com.br".content_queue TO autopropelidos_content_manager;

-- ==================================================
-- 7. MONITORING AND ALERTING
-- ==================================================

-- Function to check database health
CREATE OR REPLACE FUNCTION "autopropelidos.com.br".check_database_health()
RETURNS TABLE(
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Check table sizes
    RETURN QUERY
    SELECT 
        'Table Sizes' as check_name,
        CASE 
            WHEN pg_total_relation_size('"autopropelidos.com.br".news') > 1073741824 THEN 'WARNING'
            ELSE 'OK'
        END as status,
        'News table: ' || pg_size_pretty(pg_total_relation_size('"autopropelidos.com.br".news')) as details;
    
    -- Check for long-running queries
    RETURN QUERY
    SELECT 
        'Long Running Queries' as check_name,
        CASE 
            WHEN COUNT(*) > 5 THEN 'WARNING'
            WHEN COUNT(*) > 0 THEN 'INFO'
            ELSE 'OK'
        END as status,
        COUNT(*)::TEXT || ' queries running > 30 seconds' as details
    FROM pg_stat_activity 
    WHERE state = 'active' 
        AND now() - query_start > interval '30 seconds'
        AND query NOT LIKE '%pg_stat_activity%';
    
    -- Check index usage
    RETURN QUERY
    SELECT 
        'Index Usage' as check_name,
        CASE 
            WHEN MIN(idx_usage.ratio) < 0.8 THEN 'WARNING'
            ELSE 'OK'
        END as status,
        'Minimum index usage: ' || ROUND(MIN(idx_usage.ratio) * 100, 2)::TEXT || '%' as details
    FROM (
        SELECT 
            schemaname,
            tablename,
            CASE 
                WHEN idx_scan + seq_scan = 0 THEN 1.0
                ELSE idx_scan::FLOAT / (idx_scan + seq_scan)
            END as ratio
        FROM pg_stat_user_tables 
        WHERE schemaname = 'autopropelidos.com.br'
    ) idx_usage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to analyze query performance
CREATE OR REPLACE FUNCTION "autopropelidos.com.br".analyze_query_performance()
RETURNS TABLE(
    query_type TEXT,
    avg_time_ms NUMERIC,
    total_calls BIGINT,
    cache_hit_ratio NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Database Queries' as query_type,
        ROUND(
            (blk_read_time + blk_write_time) / 
            GREATEST(calls, 1), 2
        ) as avg_time_ms,
        calls as total_calls,
        ROUND(
            shared_blks_hit::NUMERIC / 
            GREATEST(shared_blks_hit + shared_blks_read, 1) * 100, 2
        ) as cache_hit_ratio
    FROM pg_stat_statements 
    WHERE query LIKE '%autopropelidos.com.br%'
    ORDER BY calls DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- 8. FINAL OPTIMIZATIONS
-- ==================================================

-- Create materialized view for trending content (refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS "autopropelidos.com.br".mv_trending_content AS
SELECT 
    'news' as content_type,
    id,
    title,
    relevance_score,
    view_count,
    published_at,
    category,
    tags
FROM "autopropelidos.com.br".news
WHERE published_at > NOW() - INTERVAL '7 days'
    AND relevance_score > 50

UNION ALL

SELECT 
    'video' as content_type,
    id,
    title,
    relevance_score,
    view_count,
    published_at,
    category,
    tags
FROM "autopropelidos.com.br".videos
WHERE published_at > NOW() - INTERVAL '7 days'
    AND relevance_score > 50

ORDER BY relevance_score DESC, view_count DESC, published_at DESC;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_mv_trending_content_score 
    ON "autopropelidos.com.br".mv_trending_content (relevance_score DESC);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION "autopropelidos.com.br".refresh_trending_content()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY "autopropelidos.com.br".mv_trending_content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant appropriate permissions
GRANT USAGE ON SCHEMA "autopropelidos.com.br" TO authenticated;
GRANT SELECT ON "autopropelidos.com.br".mv_trending_content TO authenticated;
GRANT EXECUTE ON FUNCTION "autopropelidos.com.br".get_trending_content TO authenticated;
GRANT EXECUTE ON FUNCTION "autopropelidos.com.br".check_database_health TO authenticated;

-- Admin-only functions
GRANT EXECUTE ON FUNCTION "autopropelidos.com.br".cleanup_old_content TO autopropelidos_content_manager;
GRANT EXECUTE ON FUNCTION "autopropelidos.com.br".remove_duplicate_news TO autopropelidos_content_manager;
GRANT EXECUTE ON FUNCTION "autopropelidos.com.br".remove_duplicate_videos TO autopropelidos_content_manager;
GRANT EXECUTE ON FUNCTION "autopropelidos.com.br".update_trending_scores TO autopropelidos_content_manager;
GRANT EXECUTE ON FUNCTION "autopropelidos.com.br".optimize_tables TO autopropelidos_content_manager;
GRANT EXECUTE ON FUNCTION "autopropelidos.com.br".refresh_trending_content TO autopropelidos_content_manager;