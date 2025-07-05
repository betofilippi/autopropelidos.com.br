export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  "autopropelidos.com.br": {
    Tables: {
      analytics: {
        Row: {
          id: number
          event_type: string
          page_url: string | null
          user_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          event_type: string
          page_url?: string | null
          user_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          event_type?: string
          page_url?: string | null
          user_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          id: number
          title: string
          description: string | null
          content: string | null
          url: string
          source: string | null
          category: string | null
          tags: string[] | null
          image_url: string | null
          published_at: string | null
          relevance_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          content?: string | null
          url: string
          source?: string | null
          category?: string | null
          tags?: string[] | null
          image_url?: string | null
          published_at?: string | null
          relevance_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          content?: string | null
          url?: string
          source?: string | null
          category?: string | null
          tags?: string[] | null
          image_url?: string | null
          published_at?: string | null
          relevance_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      regulations: {
        Row: {
          id: number
          title: string
          description: string | null
          content: string | null
          category: string | null
          tags: string[] | null
          effective_date: string | null
          status: string | null
          source_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          content?: string | null
          category?: string | null
          tags?: string[] | null
          effective_date?: string | null
          status?: string | null
          source_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          content?: string | null
          category?: string | null
          tags?: string[] | null
          effective_date?: string | null
          status?: string | null
          source_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: number
          email: string
          name: string | null
          avatar_url: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          email: string
          name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          email?: string
          name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          id: number
          brand: string
          model: string
          year: number | null
          type: string | null
          specifications: Json | null
          price_range: string | null
          availability: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          brand: string
          model: string
          year?: number | null
          type?: string | null
          specifications?: Json | null
          price_range?: string | null
          availability?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          brand?: string
          model?: string
          year?: number | null
          type?: string | null
          specifications?: Json | null
          price_range?: string | null
          availability?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          id: number
          title: string
          description: string | null
          youtube_id: string
          thumbnail_url: string | null
          duration: string | null
          view_count: number | null
          category: string | null
          tags: string[] | null
          published_at: string | null
          relevance_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          youtube_id: string
          thumbnail_url?: string | null
          duration?: string | null
          view_count?: number | null
          category?: string | null
          tags?: string[] | null
          published_at?: string | null
          relevance_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          youtube_id?: string
          thumbnail_url?: string | null
          duration?: string | null
          view_count?: number | null
          category?: string | null
          tags?: string[] | null
          published_at?: string | null
          relevance_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[keyof Database]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never