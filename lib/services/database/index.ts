// Export all database services
export { newsService } from './news.service'
export { videoService } from './videos.service'
export { regulationService } from './regulations.service'
export { vehicleService } from './vehicles.service'
export { userService } from './users.service'
export { analyticsService } from './analytics.service'

// Export types
export type { NewsFilters, NewsResponse } from './news.service'
export type { VideoFilters, VideoResponse } from './videos.service'
export type { RegulationFilters, RegulationResponse, RegulationLocation } from './regulations.service'
export type { VehicleFilters, VehicleResponse, VehicleStatistics } from './vehicles.service'
export type { UserPreferences, NotificationSettings, UserFilters, UserResponse } from './users.service'
export type { 
  EventType, 
  AnalyticsEvent, 
  AnalyticsFilters, 
  AnalyticsResponse, 
  AnalyticsSummary,
  PageAnalytics 
} from './analytics.service'