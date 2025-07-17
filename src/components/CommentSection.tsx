import React, { useState, useEffect } from 'react'
import { Send, Heart } from 'lucide-react'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

type Comment = Database['public']['Tables']['comments']['Row']

// ランダムなハートカラーを取得
const getRandomHeartColor = () => {
  const colors = [
    'text-purple-500',
    'text-blue-500', 
    'text-red-500',
    'text-green-500',
    'text-gray-500',
    'text-orange-500',
    'text-indigo-500',
    'text-pink-500'
  ]
  
  const index = Math.floor(Math.random() * colors.length)
  return colors[index]
}

interface CommentSectionProps {
  diaryId: string
}

const CommentSection: React.FC<CommentSectionProps> = ({ diaryId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchComments()
  }, [diaryId])

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('diary_id', diaryId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user || isSubmitting) return

    setIsSubmitting(true)
    try {
      const commentData = {
        diary_id: diaryId,
        user_id: user.id,
        nickname: isAnonymous ? null : (profile?.display_name || '匿名'),
        content: newComment.trim()
      }

      const { error } = await supabase
        .from('comments')
        .insert([commentData])

      if (error) throw error

      setNewComment('')
      setIsAnonymous(false)
      await fetchComments()
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3" data-heart-color={getRandomHeartColor()}>
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Heart className={`w-3 h-3 ${getRandomHeartColor()} fill-current`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 text-xs">
                  {comment.nickname || '匿名'}
                </span>
                <span className="text-gray-500 text-xs">
                  @{comment.nickname?.toLowerCase().replace(/\s+/g, '') || 'anonymous'}
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500 text-xs">
                  {formatDistanceToNow(new Date(comment.created_at), { 
                    addSuffix: true, 
                    locale: ja 
                  })}
                </span>
              </div>
              <p className="text-gray-800 text-xs mt-1 leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="border-t border-gray-100 pt-4 bg-gray-50 rounded-lg p-4 mt-4">
          <div className="flex space-x-3">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Heart className={`w-3 h-3 ${getRandomHeartColor()} fill-current`} />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを書く..."
                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm placeholder-gray-500"
                rows={2}
                maxLength={280}
              />
              
              <div className="flex items-center justify-between mt-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">匿名でコメント</span>
                </label>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    {280 - newComment.length}
                  </span>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3 h-3 mr-1" />
                        返信
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 border-t border-gray-100 bg-gray-50 rounded-lg mt-4">
          <p className="text-gray-500">
            返信するにはログインしてください
          </p>
        </div>
      )}
    </div>
  )
}

export default CommentSection