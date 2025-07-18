import React, { useState } from 'react'
import { MessageCircle, MoreHorizontal, Edit, Trash2, Share } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Database } from '../lib/supabase'
import CommentSection from './CommentSection'
import EditDiaryModal from './EditDiaryModal'
import ElegantHeart from './ElegantHeart'
import { useAuth } from '../hooks/useAuth'

type DiaryEntry = Database['public']['Tables']['diary']['Row']

interface DiaryCardProps {
  diary: DiaryEntry
  currentUserId?: string
  isAdmin?: boolean
  onDelete?: (id: string) => void
  onUpdate?: (id: string, updates: Partial<DiaryEntry>) => void
}

// 感情に応じた色を取得
const getEmotionColorClasses = (emotion: string | null) => {
  const emotionColors: Record<string, { bg: string; border: string; heart: string }> = {
    // ネガティブな感情
    'fear': { bg: 'bg-purple-50', border: 'border-purple-200', heart: 'text-purple-500' },
    'sadness': { bg: 'bg-blue-50', border: 'border-blue-200', heart: 'text-blue-500' },
    'anger': { bg: 'bg-red-50', border: 'border-red-200', heart: 'text-red-500' },
    'disgust': { bg: 'bg-green-50', border: 'border-green-200', heart: 'text-green-500' },
    'indifference': { bg: 'bg-gray-50', border: 'border-gray-200', heart: 'text-gray-500' },
    'guilt': { bg: 'bg-orange-50', border: 'border-orange-200', heart: 'text-orange-500' },
    'loneliness': { bg: 'bg-indigo-50', border: 'border-indigo-200', heart: 'text-indigo-500' },
    'shame': { bg: 'bg-pink-50', border: 'border-pink-200', heart: 'text-pink-500' },
    // ポジティブな感情
    'joy': { bg: 'bg-yellow-50', border: 'border-yellow-200', heart: 'text-yellow-500' },
    'gratitude': { bg: 'bg-teal-50', border: 'border-teal-200', heart: 'text-teal-500' },
    'achievement': { bg: 'bg-lime-50', border: 'border-lime-200', heart: 'text-lime-500' },
    'happiness': { bg: 'bg-amber-50', border: 'border-amber-200', heart: 'text-amber-500' }
  }
  
  // 感情が指定されていない場合はデフォルトの色
  return emotionColors[emotion || ''] || { 
    bg: 'bg-gray-50', 
    border: 'border-gray-200', 
    heart: 'text-gray-500' 
  }
}

const DiaryCard: React.FC<DiaryCardProps> = ({ 
  diary, 
  currentUserId, 
  isAdmin = false,
  onDelete,
  onUpdate
}) => {
  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [liked, setLiked] = useState(false)
  const { profile } = useAuth()
  const colors = getEmotionColorClasses(diary.emotion) // 感情に応じた色を取得

  const isOwner = currentUserId === diary.user_id
  const canEdit = isOwner || isAdmin
  const canDelete = isOwner || isAdmin

  const getEmotionDisplay = (emotion: string | null) => {
    const emotions: Record<string, { label: string; color: string }> = {
      // ネガティブな感情
      'fear': { label: '恐怖', color: 'bg-purple-100 text-purple-700 border-purple-200' },
      'sadness': { label: '悲しみ', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      'anger': { label: '怒り', color: 'bg-red-100 text-red-700 border-red-200' },
      'disgust': { label: '悔しい', color: 'bg-green-100 text-green-700 border-green-200' },
      'indifference': { label: '無価値感', color: 'bg-gray-100 text-gray-700 border-gray-200' },
      'guilt': { label: '罪悪感', color: 'bg-orange-100 text-orange-700 border-orange-200' },
      'loneliness': { label: '寂しさ', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
      'shame': { label: '恥ずかしさ', color: 'bg-pink-100 text-pink-700 border-pink-200' },
      // ポジティブな感情
      'joy': { label: '嬉しい', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      'gratitude': { label: '感謝', color: 'bg-teal-100 text-teal-700 border-teal-200' },
      'achievement': { label: '達成感', color: 'bg-lime-100 text-lime-700 border-lime-200' },
      'happiness': { label: '幸せ', color: 'bg-amber-100 text-amber-700 border-amber-200' }
    }
    return emotions[emotion || ''] || null
  }

  // 表示名を決定する関数
  const getDisplayName = () => {
    if (diary.nickname) {
      return diary.nickname // 投稿時に設定された表示名
    }
    return '匿名' // 匿名の場合
  }

  const handleDelete = () => {
    if (onDelete && window.confirm('この投稿を削除しますか？')) {
      onDelete(diary.id)
    }
  }

  const handleUpdate = (updates: Partial<DiaryEntry>) => {
    if (onUpdate) {
      onUpdate(diary.id, updates)
    }
    setShowEditModal(false)
  }

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'かんじょうにっき掲示板',
        text: diary.content?.substring(0, 100) + '...',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('URLをコピーしました')
    }
  }

  return (
    <article className={`rounded-2xl border-2 p-6 mb-4 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] ${colors.bg} ${colors.border}`}>
      {/* Header */}
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200">
          <ElegantHeart className={colors.heart} size="md" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-bold text-gray-900 text-sm">
              {getDisplayName()}
            </span>
            <span className="text-gray-400 text-sm">
              @{getDisplayName().toLowerCase().replace(/\s+/g, '') || 'anonymous'}
            </span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-md">
              {diary.created_at && new Date(diary.created_at).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-400 text-xs">
              {diary.created_at && formatDistanceToNow(new Date(diary.created_at), { 
                addSuffix: true, 
                locale: ja 
              })}
            </span>
          </div>

          {/* Content */}
          <div className="mt-3">
            {/* 感情バッジ */}
            {diary.emotion && getEmotionDisplay(diary.emotion) && (
              <div className="mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEmotionDisplay(diary.emotion)?.color}`}>
                  {getEmotionDisplay(diary.emotion)?.label}
                </span>
              </div>
            )}
            
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
              {diary.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 max-w-md">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors group text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>コメント</span>
            </button>
            
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors group text-sm ${
                liked 
                  ? 'text-red-500 hover:bg-red-50' 
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <ElegantHeart 
                className={liked ? 'text-red-500' : 'text-gray-500'} 
                size="sm" 
              />
              <span>いいね</span>
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors group text-sm"
            >
              <Share className="w-4 h-4" />
              <span>共有</span>
            </button>

            {canEdit && (
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="action-btn"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                    {canEdit && (
                      <button
                        onClick={() => {
                          setShowEditModal(true)
                          setShowMenu(false)
                        }}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 text-green-600 text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        <span>編集</span>
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => {
                          handleDelete()
                          setShowMenu(false)
                        }}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 text-red-600 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>削除</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comments */}
          {showComments && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <CommentSection diaryId={diary.id} />
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditDiaryModal
          diary={diary}
          onSave={handleUpdate}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </article>
  )
}

export default DiaryCard