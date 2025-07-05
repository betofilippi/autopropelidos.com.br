# API Sync Services Documentation

## Overview

The autopropelidos.com.br platform includes automated services to fetch and sync content from external APIs:
- **NewsAPI**: Fetches news articles about electric vehicles, urban mobility, and regulations
- **YouTube API**: Fetches relevant videos about electric scooters, regulations, and safety

## Environment Variables

Add these to your `.env.local` file:

```env
# External APIs
NEWS_API_KEY=your_newsapi_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here

# Sync API Security (optional)
SYNC_API_KEY=your_secret_sync_key_here
```

## API Endpoints

### Manual Sync Trigger

**POST** `/api/sync`

Triggers a manual sync of news and videos.

Headers:
```
x-api-key: your_secret_sync_key_here (if SYNC_API_KEY is set)
```

Response:
```json
{
  "success": true,
  "result": {
    "news": {
      "fetched": 50,
      "inserted": 10,
      "updated": 5,
      "errors": 0
    },
    "videos": {
      "fetched": 30,
      "inserted": 8,
      "updated": 2,
      "errors": 0
    },
    "timestamp": "2024-01-10T10:30:00Z",
    "duration": 5432
  },
  "quotaStatus": {
    "used": 1500,
    "limit": 10000,
    "resetTime": "2024-01-11T00:00:00Z"
  }
}
```

### Check Sync Status

**GET** `/api/sync`

Returns current sync status and API configuration.

Response:
```json
{
  "sync": {
    "isRunning": false,
    "lastSyncTime": "2024-01-10T10:30:00Z",
    "isScheduled": true
  },
  "youtube": {
    "quota": {
      "used": 1500,
      "limit": 10000,
      "resetTime": "2024-01-11T00:00:00Z"
    }
  },
  "apis": {
    "newsAPI": "Configured",
    "youTube": "Configured"
  }
}
```

### Cleanup Old Content

**DELETE** `/api/sync?days=90`

Deletes content older than specified days.

Headers:
```
x-api-key: your_secret_sync_key_here (if SYNC_API_KEY is set)
```

Query Parameters:
- `days`: Number of days to keep (default: 90)

Response:
```json
{
  "success": true,
  "result": {
    "newsDeleted": 25,
    "videosDeleted": 15
  },
  "message": "Deleted content older than 90 days"
}
```

## Service Classes

### NewsAPIService

Location: `/lib/services/newsapi.ts`

Features:
- Searches for news in Portuguese
- Rate limiting (1 request per second)
- Caching (15 minutes)
- Automatic categorization
- Duplicate detection

Methods:
- `searchNews(query, language)`: Search for news articles
- `searchMultipleQueries(queries, language)`: Search multiple queries
- `getLatestNews()`: Get latest relevant news
- `getPortugueseNews()`: Get news from Portuguese sources

### YouTubeService

Location: `/lib/services/youtube.ts`

Features:
- Quota management (10,000 units daily)
- Duration parsing
- View count tracking
- Caching (30 minutes)
- Duplicate detection

Methods:
- `searchVideosWithDetails(query, maxResults)`: Search videos with full details
- `searchMultipleQueries(queries)`: Search multiple queries
- `getRelevantVideos()`: Get relevant videos for the platform
- `getQuotaStatus()`: Check API quota usage

### SyncService

Location: `/lib/services/api/sync.ts`

Features:
- Parallel syncing of news and videos
- Duplicate detection by URL/ID
- Update tracking
- Error handling
- Scheduled sync support
- Old content cleanup

Methods:
- `performSync()`: Run a complete sync
- `startScheduledSync(intervalHours)`: Start automatic syncing
- `stopScheduledSync()`: Stop automatic syncing
- `getSyncStatus()`: Get current sync status
- `cleanupOldContent(daysToKeep)`: Remove old content

## Scheduled Sync

To enable automatic syncing, you can:

1. Use a cron job service (e.g., Vercel Cron, GitHub Actions)
2. Call the sync endpoint periodically
3. Use the built-in scheduler (requires persistent server)

Example cron job (every 6 hours):
```bash
curl -X POST https://autopropelidos.com.br/api/sync \
  -H "x-api-key: your_secret_sync_key_here"
```

## Rate Limits & Quotas

### NewsAPI
- Free tier: 100 requests/day
- Rate limit: 1 request/second (enforced by service)
- Caching: 15 minutes

### YouTube API
- Daily quota: 10,000 units
- Search cost: 100 units
- Video details: 1 unit per video
- Quota resets: Midnight Pacific Time

## Error Handling

All services handle errors gracefully:
- API rate limits trigger delays or errors
- Failed requests don't stop the sync process
- Errors are logged and counted
- Partial syncs are supported

## Database Schema

The sync services update these tables:

### news
- `url`: Unique identifier (source URL)
- `title`, `description`, `content`: Article content
- `category`: Automatic categorization
- `tags`: Extracted keywords
- `relevance_score`: Calculated importance (0-100)

### videos
- `youtube_id`: Unique identifier
- `title`, `description`: Video metadata
- `view_count`: Updated on sync
- `category`: Automatic categorization
- `tags`: Extracted keywords
- `relevance_score`: Calculated importance (0-100)

## Testing

1. Set up environment variables
2. Test manual sync:
   ```bash
   curl -X POST http://localhost:3000/api/sync
   ```
3. Check status:
   ```bash
   curl http://localhost:3000/api/sync
   ```
4. Test cleanup:
   ```bash
   curl -X DELETE "http://localhost:3000/api/sync?days=30" \
     -H "x-api-key: your_key"
   ```