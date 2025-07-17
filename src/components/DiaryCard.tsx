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
    <article className="tweet-card p-4">
      {/* Header */}
      <div className="flex items-start space-x-3">
        <div className="avatar flex-shrink-0">
          <User className="w-5 h-5 text-gray-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-black">
              {diary.nickname || '匿名'}
            </span>
            <span className="text-gray-500">
              @{diary.nickname?.toLowerCase().replace(/\s+/g, '') || 'anonymous'}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500 text-sm">
              {diary.created_at && formatDistanceToNow(new Date(diary.created_at), { 
                addSuffix: true, 
                locale: ja 
              })}
            </span>
          </div>

          {/* Content */}
          <div className="mt-2">
            <p className="text-black leading-relaxed whitespace-pre-wrap">
              {diary.content}
            </p>
          </div>

          {/* Emotion */}
          {diary.emotion && (
            <div className="mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getEmotionColor(diary.emotion)}`}>
                {diary.emotion}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-full transition-colors group"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">コメント</span>
            </button>
            
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors group ${
                liked 
                  ? 'text-red-500 hover:bg-red-50' 
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm">いいね</span>
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 hover:bg-green-50 px-3 py-2 rounded-full transition-colors group"
            >
              <Share className="w-5 h-5" />
              <span className="text-sm">共有</span>
            </button>

            {canEdit && (
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                    {canEdit && (
                      <button
                        onClick={() => {
                          setShowEditModal(true)
                          setShowMenu(false)
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 text-black"
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
                        className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 text-red-600"
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
            <div className="mt-4 border-t border-gray-100 pt-4">
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