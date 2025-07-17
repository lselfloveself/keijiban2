import React, { useState } from 'react'
import { Heart, MessageCircle, MoreHorizontal, Edit, Trash2, User, Share } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Database } from '../lib/supabase'
import CommentSection from './CommentSection'
import EditDiaryModal from './EditDiaryModal'

type DiaryEntry = Database['public']['Tables']['diary']['Row']

interface DiaryCardProps {
  diary: DiaryEntry
  currentUserId?: string
  isAdmin?: boolean
  onDelete?: (id: string) => void
  onUpdate?: (id: string, updates: Partial<DiaryEntry>) => void
}

// スクリーンショット参考のパステルカラー配列
const pastelColors = [
  'bg-purple-50 border-purple-200',  // 恐怖 - 紫
  'bg-blue-50 border-blue-200',      // 悲しみ - 青
  'bg-red-50 border-red-200',        // 怒り - 赤
  'bg-green-50 border-green-200',    // 嫌悪 - 緑
  'bg-gray-50 border-gray-200',      // 無関心感 - グレー
  'bg-orange-50 border-orange-200',  // 罪悪感 - オレンジ
  'bg-indigo-50 border-indigo-200',  // 寂しさ - インディゴ
  'bg-pink-50 border-pink-200',      // 恥ずかしさ - ピンク
]

// 投稿IDに基づいて一貫した色を選択する関数
const getPostColor = (postId: string): string => {
  // 投稿IDのハッシュ値を計算して色を決定
  let hash = 0
  for (let i = 0; i < postId.length; i++) {
    const char = postId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32bit整数に変換
  }
  const index = Math.abs(hash) % pastelColors.length
  return pastelColors[index]
}

// 投稿IDに基づいて背景色とボーダー色を取得
const getPostColorClasses = (postId: string) => {
  const colors = [
    { bg: 'bg-purple-50', border: 'border-purple-200' },    // 恐怖 - 紫
    { bg: 'bg-blue-50', border: 'border-blue-200' },        // 悲しみ - 青
    { bg: 'bg-red-50', border: 'border-red-200' },          // 怒り - 赤
    { bg: 'bg-green-50', border: 'border-green-200' },      // 嫌悪 - 緑
    { bg: 'bg-gray-50', border: 'border-gray-200' },        // 無関心感 - グレー
    { bg: 'bg-orange-50', border: 'border-orange-200' },    // 罪悪感 - オレンジ
    { bg: 'bg-indigo-50', border: 'border-indigo-200' },    // 寂しさ - インディゴ
    { bg: 'bg-pink-50', border: 'border-pink-200' },        // 恥ずかしさ - ピンク
  ]
  
  let hash = 0
  for (let i = 0; i < postId.length; i++) {
    const char = postId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
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

  const isOwner = currentUserId === diary.user_id
  const canEdit = isOwner || isAdmin
  const canDelete = isOwner || isAdmin
  const postColors = getPostColorClasses(diary.id)

  const getEmotionColor = (emotion: string | null) => {
    const colors: Record<string, string> = {
      '😊': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      '😢': 'bg-blue-50 text-blue-600 border-blue-200',
      '😡': 'bg-red-50 text-red-600 border-red-200',
      '😴': 'bg-purple-50 text-purple-600 border-purple-200',
      '😰': 'bg-gray-50 text-gray-600 border-gray-200',
      '😍': 'bg-pink-50 text-pink-600 border-pink-200',
    }
    return colors[emotion || ''] || 'bg-gray-50 text-gray-600 border-gray-200'
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
    <article className={`rounded-2xl border-2 p-6 mb-4 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] ${postColors.bg} ${postColors.border}`}>
      {/* Header */}
      <div className="flex items-start space-x-3">
        <div className="avatar-sm flex-shrink-0">
          <User className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-bold text-gray-900 text-sm">
              {diary.nickname || '匿名'}
            </span>
            <span className="text-gray-400 text-sm">
              @{diary.nickname?.toLowerCase().replace(/\s+/g, '') || 'anonymous'}
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
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
              {diary.content}
            </p>
          </div>

          {/* Emotion */}
          {diary.emotion && (
            <div className="mt-4">
              <span className={`emotion-badge ${getEmotionColor(diary.emotion)}`}>
                <span className="mr-1">{diary.emotion}</span>
                <span>気づき</span>
              </span>
            </div>
          )}

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
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
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