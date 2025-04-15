export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string | null
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string | null
          wellness_goals: string[] | null
          preferred_journaling_time: string | null
          stress_triggers: string[] | null
          coping_strategies: string[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          wellness_goals?: string[] | null
          preferred_journaling_time?: string | null
          stress_triggers?: string[] | null
          coping_strategies?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          wellness_goals?: string[] | null
          preferred_journaling_time?: string | null
          stress_triggers?: string[] | null
          coping_strategies?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}