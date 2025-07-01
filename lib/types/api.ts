// NewsAPI types
export interface NewsAPIArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

export interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsAPIArticle[]
}

// YouTube API types
export interface YouTubeVideo {
  id: {
    kind: string
    videoId: string
  }
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: { url: string; width: number; height: number }
      medium: { url: string; width: number; height: number }
      high: { url: string; width: number; height: number }
    }
    channelTitle: string
    tags?: string[]
  }
  contentDetails?: {
    duration: string
    dimension: string
    definition: string
  }
  statistics?: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
}

export interface YouTubeSearchResponse {
  kind: string
  etag: string
  nextPageToken?: string
  prevPageToken?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: YouTubeVideo[]
}

// Vehicle classification types
export interface VehicleClassification {
  category: 'electric_bicycle' | 'moped' | 'self_propelled' | 'other'
  compliant: boolean
  reasons: string[]
  recommendations: string[]
}

// Map types
export interface RegulationMarker {
  id: string
  position: {
    lat: number
    lng: number
  }
  city: string
  state: string
  type: 'municipal' | 'state' | 'federal'
  title: string
  description: string
}