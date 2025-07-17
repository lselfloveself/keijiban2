import { createClient } from '@supabase/supabase-js'

// Supabase設定（認証機能は削除済み）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key'

// 認証なしのダミークライアント
export const supabase = {
  from: (table: string) => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
    eq: () => ({ data: [], error: null }),
    order: () => ({ data: [], error: null })
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    getUser: () => Promise.resolve({ data: { user: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithOAuth: () => Promise.resolve({ error: null }),
    signOut: () => Promise.resolve({ error: null })
  }
}

export type Database = {
  public: {
    Tables: {
      diary: {
        Row: {
          id: string
          user_id: string | null
          nickname: string | null
          content: string | null
          emotion: string | null
          created_at: string | null
          is_public: boolean | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          nickname?: string | null
          content?: string | null
          emotion?: string | null
          created_at?: string | null
          is_public?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string | null
          nickname?: string | null
          content?: string | null
          emotion?: string | null
          created_at?: string | null
          is_public?: boolean | null
        }
      }
      comments: {
        Row: {
          id: string
          diary_id: string
          user_id: string | null
          nickname: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          diary_id: string
          user_id?: string | null
          nickname?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          diary_id?: string
          user_id?: string | null
          nickname?: string | null
          content?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          avatar_url: string | null
          is_admin: boolean | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean | null
          created_at?: string
        }
      }
    }
  }
}