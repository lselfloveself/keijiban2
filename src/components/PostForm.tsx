import React, { useState } from 'react'
import { Send, Image } from 'lucide-react'
import { Database } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import ElegantHeart from './ElegantHeart'

type DiaryEntry = Database['public']['Tables']['diary']['Row']

interface PostFormProps {
  onPost: (post: Omit<DiaryEntry, 'id' | 'created_at'>) => void
}

const PostForm: React.FC<PostFormProps> = ({ onPost }) => {
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, profile } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const postData = {
        user_id: user?.id || 'anonymous-user',
        nickname: isAnonymous ? null : (nickname.trim() || profile?.display_name || null),
        content: content.trim(),
        emotion: null,
        is_public: true
      }

      onPost(postData)
      
      // フォームをリセット
      setContent('')
      setNickname('')
      setIsAnonymous(false)
    } catch (error) {
      console.error('Error posting:', error)
      alert('投稿に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card-soft mb-8">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200">
          <ElegantHeart className="text-blue-500" size="lg" />
        </div>
        
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* メインの投稿エリア */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="今日はどんな一日でしたか？"
                className="w-full p-4 border-none outline-none resize-none text-xl placeholder-gray-400 bg-transparent min-h-[120px]"
                maxLength={280}
                required
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>{280 - content.length} 文字残り</span>
              </div>
            </div>

            {/* 区切り線 */}
            <div className="border-t border-gray-100 pt-4">
              {/* ニックネーム設定 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    表示名
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">匿名で投稿</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  disabled={isAnonymous}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder={profile?.display_name || "表示名を入力..."}
                />
              </div>

              {/* 投稿ボタン */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-gray-500">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="画像を追加（準備中）"
                    disabled
                  >
                    <Image className="w-5 h-5" />
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      投稿する
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostForm