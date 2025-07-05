import { createClient, createServerSupabaseClient, type User, type UserInsert, type UserUpdate } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system'
  language?: 'pt-BR' | 'en'
  emailFrequency?: 'daily' | 'weekly' | 'monthly' | 'never'
  categories?: string[]
  locations?: {
    state: string
    city?: string
  }[]
}

export interface NotificationSettings {
  email?: boolean
  push?: boolean
  newsAlerts?: boolean
  regulationUpdates?: boolean
  videoNotifications?: boolean
  forumReplies?: boolean
}

export interface UserFilters {
  searchQuery?: string
  newsletterSubscribed?: boolean
  limit?: number
  offset?: number
}

export interface UserResponse {
  data: User[]
  count: number
  error?: string
}

class UserService {
  private getClient(): SupabaseClient {
    if (typeof window === 'undefined') {
      try {
        return createServerSupabaseClient()
      } catch {
        return createClient()
      }
    }
    return createClient()
  }

  async getAll(filters?: UserFilters): Promise<UserResponse> {
    try {
      const supabase = this.getClient()
      let query = supabase.from('users').select('*', { count: 'exact' })

      // Apply filters
      if (filters?.searchQuery) {
        query = query.or(`email.ilike.%${filters.searchQuery}%,full_name.ilike.%${filters.searchQuery}%`)
      }
      if (filters?.newsletterSubscribed !== undefined) {
        query = query.eq('newsletter_subscribed', filters.newsletterSubscribed)
      }

      // Apply ordering
      query = query.order('created_at', { ascending: false })

      // Apply pagination
      const limit = filters?.limit || 50
      const offset = filters?.offset || 0
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data || [],
        count: count || 0,
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      }
    }
  }

  async getById(id: string): Promise<User | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user by id:', error)
      return null
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Error fetching user by email:', error)
      return null
    }
  }

  async create(user: UserInsert): Promise<User | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('users')
        .insert({
          ...user,
          preferences: user.preferences || {},
          notification_settings: user.notification_settings || {
            email: true,
            push: true,
            newsAlerts: true,
            regulationUpdates: true,
            videoNotifications: false,
            forumReplies: true,
          },
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }

  async update(id: string, updates: UserUpdate): Promise<User | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  }

  async updatePreferences(id: string, preferences: UserPreferences): Promise<boolean> {
    try {
      const user = await this.getById(id)
      if (!user) return false

      const currentPreferences = (user.preferences as UserPreferences) || {}
      const mergedPreferences = { ...currentPreferences, ...preferences }

      const { error } = await this.getClient()
        .from('users')
        .update({ preferences: mergedPreferences })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating user preferences:', error)
      return false
    }
  }

  async updateNotificationSettings(id: string, settings: NotificationSettings): Promise<boolean> {
    try {
      const user = await this.getById(id)
      if (!user) return false

      const currentSettings = (user.notification_settings as NotificationSettings) || {}
      const mergedSettings = { ...currentSettings, ...settings }

      const { error } = await this.getClient()
        .from('users')
        .update({ notification_settings: mergedSettings })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating notification settings:', error)
      return false
    }
  }

  async subscribeNewsletter(id: string, subscribe = true): Promise<boolean> {
    try {
      const { error } = await this.getClient()
        .from('users')
        .update({ newsletter_subscribed: subscribe })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating newsletter subscription:', error)
      return false
    }
  }

  async getNewsletterSubscribers(): Promise<User[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('newsletter_subscribed', true)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error)
      return []
    }
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<boolean> {
    try {
      const { error } = await this.getClient()
        .from('users')
        .update({ avatar_url: avatarUrl })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating avatar:', error)
      return false
    }
  }

  async getUserStats(id: string): Promise<{
    questionsCount: number
    answersCount: number
    upvotesReceived: number
  } | null> {
    try {
      const supabase = this.getClient()

      // Get questions count
      const { count: questionsCount, error: questionsError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id)

      if (questionsError) throw questionsError

      // Get answers count
      const { count: answersCount, error: answersError } = await supabase
        .from('answers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id)

      if (answersError) throw answersError

      // Get upvotes received on questions
      const { data: questions, error: upvotesQError } = await supabase
        .from('questions')
        .select('upvotes')
        .eq('user_id', id)

      if (upvotesQError) throw upvotesQError

      // Get upvotes received on answers
      const { data: answers, error: upvotesAError } = await supabase
        .from('answers')
        .select('upvotes')
        .eq('user_id', id)

      if (upvotesAError) throw upvotesAError

      const questionsUpvotes = questions?.reduce((sum, q) => sum + (q.upvotes || 0), 0) || 0
      const answersUpvotes = answers?.reduce((sum, a) => sum + (a.upvotes || 0), 0) || 0

      return {
        questionsCount: questionsCount || 0,
        answersCount: answersCount || 0,
        upvotesReceived: questionsUpvotes + answersUpvotes,
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return null
    }
  }

  async search(query: string, limit = 20): Promise<User[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching users:', error)
      return []
    }
  }

  async getActiveUsers(days = 30): Promise<User[]> {
    try {
      const supabase = this.getClient()
      const dateLimit = new Date()
      dateLimit.setDate(dateLimit.getDate() - days)

      // This would require tracking last activity in the users table
      // For now, we'll return users created in the last N days
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .gte('created_at', dateLimit.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching active users:', error)
      return []
    }
  }
}

export const userService = new UserService()