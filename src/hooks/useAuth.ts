import { useState, useEffect } from 'react'

export interface Profile {
  id: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
  is_admin: boolean | null
  created_at: string
}

export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 認証なしでダミーユーザーを設定
    const dummyUser = {
      id: 'anonymous-user',
      email: 'anonymous@example.com'
    }
    
    const dummyProfile = {
      id: 'anonymous-user',
      email: 'anonymous@example.com',
      display_name: 'テストユーザー',
      avatar_url: null,
      is_admin: false,
      created_at: new Date().toISOString()
    }

    setUser(dummyUser)
    setProfile(dummyProfile)
    setSession({ user: dummyUser })
    setLoading(false)
  }, [])

  const updateProfile = (updates: Partial<Profile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates })
    }
  }
  const signInWithGoogle = async () => {
    // 何もしない（削除済み）
  }

  const signOut = async () => {
    // 何もしない（削除済み）
  }

  return {
    user,
    profile,
    session,
    loading,
    updateProfile,
    signInWithGoogle,
    signOut
  }
}