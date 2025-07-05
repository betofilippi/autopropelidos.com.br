// Database types matching Supabase schema
export interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  image_url: string | null
  source: string
  source_url: string
  published_at: string
  category: string
  created_at: string
}

export interface Video {
  id: string
  youtube_id: string
  title: string
  description: string
  thumbnail_url: string
  channel_name: string
  channel_id: string
  duration: string
  views: number
  published_at: string
  created_at: string
}

export interface Regulation {
  id: string
  city: string | null
  state: string
  country: string
  regulation_type: 'municipal' | 'state' | 'federal'
  title: string
  description: string
  requirements: any
  effective_date: string
  source_url: string | null
  last_updated: string
  created_at: string
}

export interface Vehicle {
  id: string
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
  created_at: string
}