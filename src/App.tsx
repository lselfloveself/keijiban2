import React, { useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, Plus } from 'lucide-react'
import Header from './components/Header'
import DiaryCard from './components/DiaryCard'
import PostForm from './components/PostForm'
import AdminPanel from './components/AdminPanel'
import ProfilePage from './components/ProfilePage'
import { useAuth } from './hooks/useAuth'
import { supabase, Database } from './lib/supabase'

type DiaryEntry = Database['public']['Tables']['diary']['Row']

// テスト用のモックデータ
const mockDiaries: DiaryEntry[] = [
  {
    id: 'test-1',
    user_id: 'test-user-1',
    nickname: '太郎',
    content: '今日は久しぶりに友達と会えて本当に楽しかった！カフェで3時間も話し込んでしまった。やっぱり直接会って話すのは全然違うなあ。明日からまた頑張ろう！',
    emotion: null,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分前
    is_public: true
  },
  {
    id: 'test-2',
    user_id: 'test-user-2',
    nickname: null, // 匿名
    content: '最近仕事が忙しすぎて疲れが取れない...。でも新しいプロジェクトが始まるから頑張らないと。早く慣れるといいな。',
    emotion: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2時間前
    is_public: true
  },
  {
    id: 'test-3',
    user_id: 'test-user-3',
    nickname: 'みかん',
    content: '映画館で見た新作アニメが最高だった！！！\n\n作画も音楽も声優さんの演技も全部完璧で、途中で泣いちゃった😭\n\n原作ファンとしても大満足です。みんなにもおすすめしたい！',
    emotion: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5時間前
    is_public: true
  },
  {
    id: 'test-4',
    user_id: 'test-user-4',
    nickname: 'ゆうき',
    content: '電車で席を譲ろうとしたら断られてしまった。善意のつもりだったけど、相手の気持ちも考えないといけないなと反省。難しい...',
    emotion: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8時間前
    is_public: true
  },
  {
    id: 'test-5',
    user_id: 'test-user-5',
    nickname: null, // 匿名
    content: '今日は雨だったけど、家でゆっくり読書できて良い一日だった。久しぶりに小説を最後まで読み切れた。次は何を読もうかな？',
    emotion: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12時間前
    is_public: true
  }
]
function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showPostForm, setShowPostForm] = useState(false)
  const [showProfilePage, setShowProfilePage] = useState(false)
  const [useTestData, setUseTestData] = useState(true) // テストデータ使用フラグ
  const { user, profile, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading) {
      if (useTestData) {
        // テストデータを使用
        setDiaries(mockDiaries)
        setLoading(false)
      } else {
        fetchDiaries()
      }
    }
  }, [authLoading, useTestData])

  const fetchDiaries = async () => {
    try {
      setRefreshing(true)
      const { data, error } = await supabase
        .from('diary')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDiaries(data || [])
    } catch (error) {
      console.error('Error fetching diaries:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleDeleteDiary = async (diaryId: string) => {
    if (useTestData) {
      // テストデータの場合はローカルで削除
      setDiaries(prev => prev.filter(diary => diary.id !== diaryId))
      return
    }

    try {
      const { error } = await supabase
        .from('diary')
        .delete()
        .eq('id', diaryId)

      if (error) throw error
      
      setDiaries(prev => prev.filter(diary => diary.id !== diaryId))
    } catch (error) {
      console.error('Error deleting diary:', error)
      alert('削除に失敗しました')
    }
  }

  const handleUpdateDiary = async (diaryId: string, updates: Partial<DiaryEntry>) => {
    if (useTestData) {
      // テストデータの場合はローカルで更新
      setDiaries(prev => 
        prev.map(diary => 
          diary.id === diaryId ? { ...diary, ...updates } : diary
        )
      )
      return
    }

    try {
      const { error } = await supabase
        .from('diary')
        .update(updates)
        .eq('id', diaryId)

      if (error) throw error
      
      setDiaries(prev => 
        prev.map(diary => 
          diary.id === diaryId ? { ...diary, ...updates } : diary
        )
      )
    } catch (error) {
      console.error('Error updating diary:', error)
      alert('更新に失敗しました')
    }
  }

  const handleNewPost = (postData: Omit<DiaryEntry, 'id' | 'created_at'>) => {
    // 新しい投稿を作成
    const newPost: DiaryEntry = {
      id: `post-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...postData
    }

    if (useTestData) {
      // テストデータの場合はローカルで追加
      setDiaries(prev => [newPost, ...prev])
    } else {
      // 本番の場合はSupabaseに保存（実装時）
      // TODO: Supabase実装時にここを更新
      setDiaries(prev => [newPost, ...prev])
    }

    setShowPostForm(false)
  }

  const handleRefresh = () => {
    if (useTestData) {
      // テストデータをリフレッシュ
      setRefreshing(true)
      setTimeout(() => {
        setDiaries([...mockDiaries])
        setRefreshing(false)
      }, 500)
    } else {
      fetchDiaries()
    }
  }
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-layout">
      <Header 
        onAdminClick={() => setShowAdminPanel(true)}
        onProfileClick={() => setShowProfilePage(true)}
      />
      
      <main className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-8">
            {/* 投稿フォーム */}
            {showPostForm ? (
              <PostForm onPost={handleNewPost} />
            ) : (
              <div className="card-soft">
                <button
                  onClick={() => setShowPostForm(true)}
                  className="w-full flex items-center space-x-3 p-4 text-left hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <span className="text-xl text-gray-400">今日はどんな一日でしたか？</span>
                </button>
              </div>
            )}

            {/* 直近の日記 */}
            <div className="card-soft">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-header">直近の日記（最大10件）</h2>
                
                <div className="flex items-center space-x-3">
                  {/* テストデータ切り替えボタン */}
                  <button
                    onClick={() => setUseTestData(!useTestData)}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                      useTestData 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {useTestData ? 'テストモード' : '本番モード'}
                  </button>
                  
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className={`action-btn ${
                      refreshing ? 'animate-spin' : ''
                    }`}
                  >
                    <RefreshCw className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {diaries.length > 0 ? (
                  diaries.map((diary) => (
                    <DiaryCard
                      key={diary.id}
                      diary={diary}
                      currentUserId={user?.id}
                      isAdmin={profile?.is_admin || false}
                      onDelete={handleDeleteDiary}
                      onUpdate={handleUpdateDiary}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      まだ投稿がありません
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      かんじょうにっきアプリで「公開」を選択した日記が、ここに表示されます。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-8">
            {/* サイドバーは空にして、将来的に必要な要素を追加可能 */}
          </div>
        </div>
      </main>

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}

      {/* Profile Page */}
      {showProfilePage && (
        <ProfilePage onClose={() => setShowProfilePage(false)} />
      )}
    </div>
  )
}

export default App