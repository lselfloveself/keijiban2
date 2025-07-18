import { createClient } from '@supabase/supabase-js'

// Supabase設定（認証機能は削除済み）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key'

// 認証なしのダミークライアント
export const supabase = {
  from: (table: string) => ({
    select: () => {
      const chainable = {
        data: [],
        error: null,
        eq: () => chainable,
        order: () => chainable,
        then: (resolve: any) => resolve({ data: [], error: null })
      };
      return chainable;
    },
    insert: () => {
      const chainable = {
        data: null,
        error: null,
        then: (resolve: any) => resolve({ data: null, error: null })
      };
      return chainable;
    },
    update: () => {
      const chainable = {
        data: null,
        error: null,
        eq: () => chainable,
        then: (resolve: any) => resolve({ data: null, error: null })
      };
      return chainable;
    },
    delete: () => {
      const chainable = {
        data: null,
        error: null,
        eq: () => chainable,
        then: (resolve: any) => resolve({ data: null, error: null })
      };
      return chainable;
    }
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