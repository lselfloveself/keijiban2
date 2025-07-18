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
    // 管理者ログイン状態をチェック
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
    const adminEmail = localStorage.getItem('adminEmail')

    if (adminLoggedIn && adminEmail) {
      // 管理者としてログイン
      const adminUser = {
        id: 'admin-user',
        email: adminEmail
      }
      
      const adminProfile = {
        id: 'admin-user',
        email: adminEmail,
        display_name: '管理者',
        avatar_url: null,
        is_admin: true,
        created_at: new Date().toISOString()
      }

      setUser(adminUser)
      setProfile(adminProfile)
      setSession({ user: adminUser })
    } else {
      // 通常ユーザー（匿名）
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
    }
    setLoading(false)
  }, [])

  const updateProfile = (updates: Partial<Profile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates })
    }
  }

  const loginAsAdmin = () => {
    const adminUser = {
      id: 'admin-user',
      email: 'jin@namisapo.com'
    }
    
    const adminProfile = {
      id: 'admin-user',
      email: 'jin@namisapo.com',
      display_name: '管理者',
      avatar_url: null,
      is_admin: true,
      created_at: new Date().toISOString()
    }

    setUser(adminUser)
    setProfile(adminProfile)
    setSession({ user: adminUser })
  }

  const logout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminEmail')
    
    // 通常ユーザーに戻す
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
  }
  const signInWithGoogle = async () => {
    // 何もしない（削除済み）
  }

  const signOut = async () => {
    logout()
  }

  return {
    user,
    profile,
    session,
    loading,
    updateProfile,
    loginAsAdmin,
    logout,
    signInWithGoogle,
    signOut
  }
}