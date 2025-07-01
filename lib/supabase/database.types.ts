export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      news: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          content: string | null
          url: string
          source: string
          source_logo: string | null
          published_at: string
          category: 'regulation' | 'safety' | 'technology' | 'urban_mobility' | 'general'
          tags: string[]
          image_url: string | null
          relevance_score: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          content?: string | null
          url: string
          source: string
          source_logo?: string | null
          published_at: string
          category: 'regulation' | 'safety' | 'technology' | 'urban_mobility' | 'general'
          tags?: string[]
          image_url?: string | null
          relevance_score?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          content?: string | null
          url?: string
          source?: string
          source_logo?: string | null
          published_at?: string
          category?: 'regulation' | 'safety' | 'technology' | 'urban_mobility' | 'general'
          tags?: string[]
          image_url?: string | null
          relevance_score?: number
        }
      }
      videos: {
        Row: {
          id: string
          created_at: string
          youtube_id: string
          title: string
          description: string | null
          channel_name: string
          channel_id: string
          thumbnail_url: string
          published_at: string
          duration: string | null
          view_count: number | null
          category: 'news_report' | 'educational' | 'analysis' | 'review' | 'tutorial'
          tags: string[]
          transcript: string | null
          relevance_score: number
        }
        Insert: {
          id?: string
          created_at?: string
          youtube_id: string
          title: string
          description?: string | null
          channel_name: string
          channel_id: string
          thumbnail_url: string
          published_at: string
          duration?: string | null
          view_count?: number | null
          category: 'news_report' | 'educational' | 'analysis' | 'review' | 'tutorial'
          tags?: string[]
          transcript?: string | null
          relevance_score?: number
        }
        Update: {
          id?: string
          created_at?: string
          youtube_id?: string
          title?: string
          description?: string | null
          channel_name?: string
          channel_id?: string
          thumbnail_url?: string
          published_at?: string
          duration?: string | null
          view_count?: number | null
          category?: 'news_report' | 'educational' | 'analysis' | 'review' | 'tutorial'
          tags?: string[]
          transcript?: string | null
          relevance_score?: number
        }
      }
      regulations: {
        Row: {
          id: string
          created_at: string
          city: string | null
          state: string
          country: string
          regulation_type: 'municipal' | 'state' | 'federal'
          title: string
          description: string
          requirements: Json
          effective_date: string
          source_url: string | null
          last_updated: string
        }
        Insert: {
          id?: string
          created_at?: string
          city?: string | null
          state: string
          country?: string
          regulation_type: 'municipal' | 'state' | 'federal'
          title: string
          description: string
          requirements?: Json
          effective_date: string
          source_url?: string | null
          last_updated?: string
        }
        Update: {
          id?: string
          created_at?: string
          city?: string | null
          state?: string
          country?: string
          regulation_type?: 'municipal' | 'state' | 'federal'
          title?: string
          description?: string
          requirements?: Json
          effective_date?: string
          source_url?: string | null
          last_updated?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          created_at: string
          brand: string
          model: string
          year: number
          category: 'electric_bicycle' | 'moped' | 'self_propelled' | 'other'
          motor_power_watts: number
          max_speed_kmh: number
          has_pedal_assist: boolean
          has_throttle: boolean
          width_cm: number | null
          wheelbase_cm: number | null
          weight_kg: number | null
          battery_capacity_wh: number | null
          price_brl: number | null
          image_url: string | null
          manufacturer_url: string | null
          compliant_996: boolean
          compliance_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          brand: string
          model: string
          year: number
          category: 'electric_bicycle' | 'moped' | 'self_propelled' | 'other'
          motor_power_watts: number
          max_speed_kmh: number
          has_pedal_assist?: boolean
          has_throttle?: boolean
          width_cm?: number | null
          wheelbase_cm?: number | null
          weight_kg?: number | null
          battery_capacity_wh?: number | null
          price_brl?: number | null
          image_url?: string | null
          manufacturer_url?: string | null
          compliant_996?: boolean
          compliance_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          brand?: string
          model?: string
          year?: number
          category?: 'electric_bicycle' | 'moped' | 'self_propelled' | 'other'
          motor_power_watts?: number
          max_speed_kmh?: number
          has_pedal_assist?: boolean
          has_throttle?: boolean
          width_cm?: number | null
          wheelbase_cm?: number | null
          weight_kg?: number | null
          battery_capacity_wh?: number | null
          price_brl?: number | null
          image_url?: string | null
          manufacturer_url?: string | null
          compliant_996?: boolean
          compliance_notes?: string | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          preferences: Json
          newsletter_subscribed: boolean
          notification_settings: Json
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json
          newsletter_subscribed?: boolean
          notification_settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json
          newsletter_subscribed?: boolean
          notification_settings?: Json
        }
      }
      questions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          content: string
          category: string
          tags: string[]
          upvotes: number
          view_count: number
          answered: boolean
          best_answer_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          content: string
          category: string
          tags?: string[]
          upvotes?: number
          view_count?: number
          answered?: boolean
          best_answer_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          content?: string
          category?: string
          tags?: string[]
          upvotes?: number
          view_count?: number
          answered?: boolean
          best_answer_id?: string | null
        }
      }
      answers: {
        Row: {
          id: string
          created_at: string
          question_id: string
          user_id: string
          content: string
          upvotes: number
          is_best_answer: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          question_id: string
          user_id: string
          content: string
          upvotes?: number
          is_best_answer?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          question_id?: string
          user_id?: string
          content?: string
          upvotes?: number
          is_best_answer?: boolean
        }
      }
      analytics: {
        Row: {
          id: string
          created_at: string
          event_type: string
          event_data: Json
          user_id: string | null
          session_id: string
          page_url: string
        }
        Insert: {
          id?: string
          created_at?: string
          event_type: string
          event_data?: Json
          user_id?: string | null
          session_id: string
          page_url: string
        }
        Update: {
          id?: string
          created_at?: string
          event_type?: string
          event_data?: Json
          user_id?: string | null
          session_id?: string
          page_url?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}