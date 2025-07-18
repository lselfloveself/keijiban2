import React, { useState, useEffect } from 'react'
import { Camera, Save, X, User, Mail, Calendar, Shield, Settings, Upload, Trash2, Edit, Send } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatDate } from '../utils/dateUtils'
import ElegantHeart from './ElegantHeart'
import { Database } from '../lib/supabase'

type DiaryEntry = Database['public']['Tables']['diary']['Row']

interface ProfilePageProps {
  onClose: () => void
  onNewPost?: (post: Omit<DiaryEntry, 'id' | 'created_at'>) => void
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose, onNewPost }) => {
  const { user, profile } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [location, setLocation] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'diary' | 'profile' | 'privacy' | 'notifications'>('diary')
  
  // 日記投稿用の状態
  const [diaryContent, setDiaryContent] = useState('')
  const [insights, setInsights] = useState('')
  const [selectedEmotion, setSelectedEmotion] = useState('')
  const [diaryNickname, setDiaryNickname] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setAvatarUrl(profile.avatar_url || '')
      setDiaryNickname(profile.display_name || '')
      // 追加のプロフィール情報があれば設定
    }
  }, [profile])

  const handleDiarySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!diaryContent.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const postData = {
        user_id: user?.id || 'anonymous-user',
        nickname: isAnonymous ? null : (diaryNickname.trim() || profile?.display_name || null),
        content: diaryContent.trim() + (insights.trim() ? '\n\n【今日の小さな気づき】\n' + insights.trim() : ''),
        emotion: selectedEmotion || null,
        is_public: true
      }

      if (onNewPost) {
        onNewPost(postData)
      }
      
      // フォームをリセット
      setDiaryContent('')
      setInsights('')
      setSelectedEmotion('')
      setIsAnonymous(false)
      
      alert('日記を投稿しました！')
    } catch (error) {
      console.error('Error posting diary:', error)
      alert('投稿に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const updates = {
        display_name: displayName.trim() || null,
        avatar_url: avatarUrl || null,
        // 他のフィールドも保存（実際のSupabase実装時に追加）
      }

      // テスト環境では実際の保存は行わない
      console.log('Profile updates:', updates)
      
      // 成功メッセージ
      alert('プロフィールを更新しました！')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('プロフィールの更新に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 実際の実装では画像をSupabase Storageにアップロード
      // テスト環境では仮のURLを設定
      const fakeUrl = `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${displayName.charAt(0) || 'U'}`
      setAvatarUrl(fakeUrl)
    }
  }

  const handleDeleteAvatar = () => {
    setAvatarUrl('')
  }

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-black">プロフィール設定</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('diary')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'diary'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <Edit className="w-4 h-4" />
            <span>日記投稿</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <User className="w-4 h-4" />
            <span>基本情報</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>プライバシー</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>通知設定</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Diary Tab */}
          {activeTab === 'diary' && (
            <div className="space-y-6">
              {/* 今日の出来事セクション */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">今日の出来事</h3>
                  <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-600">
                    {new Date().toLocaleDateString('ja-JP', { 
                      month: 'long', 
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">今日の出来事を書いてみましょう</p>
                
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 rounded-full"></div>
                  <textarea
                    value={diaryContent}
                    onChange={(e) => setDiaryContent(e.target.value)}
                    className="w-full pl-6 pr-4 py-4 border-none outline-none resize-none text-base placeholder-gray-400 bg-transparent min-h-[200px]"
                    placeholder=""
                    maxLength={280}
                  />
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">💡</span>
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">思い出すのがつらい場合は、無理をしないでください。</p>
                      <p>書ける範囲で、あなたのペースで大丈夫です。</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 今日の気持ちセクション */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">今日の気持ち</h3>
                <p className="text-sm text-gray-600 mb-6">どの気持ちに近いですか？</p>
                
                {/* ネガティブな感情 */}
                <div className="mb-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">ネガティブな感情</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'fear', label: '恐怖', color: 'bg-purple-100 border-purple-200 text-purple-800' },
                      { id: 'sadness', label: '悲しみ', color: 'bg-blue-100 border-blue-200 text-blue-800' },
                      { id: 'anger', label: '怒り', color: 'bg-red-100 border-red-200 text-red-800' },
                      { id: 'disgust', label: '悔しい', color: 'bg-green-100 border-green-200 text-green-800' },
                      { id: 'indifference', label: '無価値感', color: 'bg-gray-100 border-gray-200 text-gray-800' },
                      { id: 'guilt', label: '罪悪感', color: 'bg-orange-100 border-orange-200 text-orange-800' },
                      { id: 'loneliness', label: '寂しさ', color: 'bg-indigo-100 border-indigo-200 text-indigo-800' },
                      { id: 'shame', label: '恥ずかしさ', color: 'bg-pink-100 border-pink-200 text-pink-800' }
                    ].map((emotion) => (
                      <label
                        key={emotion.id}
                        className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                          selectedEmotion === emotion.id 
                            ? `${emotion.color} ring-2 ring-offset-2 ring-blue-500` 
                            : `${emotion.color} hover:shadow-md`
                        }`}
                      >
                        <input
                          type="radio"
                          name="emotion"
                          value={emotion.id}
                          checked={selectedEmotion === emotion.id}
                          onChange={(e) => setSelectedEmotion(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedEmotion === emotion.id 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {selectedEmotion === emotion.id && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="font-medium">{emotion.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ポジティブな感情 */}
                <div className="mb-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">ポジティブな感情</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'joy', label: '嬉しい', color: 'bg-yellow-100 border-yellow-200 text-yellow-800' },
                      { id: 'gratitude', label: '感謝', color: 'bg-teal-100 border-teal-200 text-teal-800' },
                      { id: 'achievement', label: '達成感', color: 'bg-lime-100 border-lime-200 text-lime-800' },
                      { id: 'happiness', label: '幸せ', color: 'bg-amber-100 border-amber-200 text-amber-800' }
                    ].map((emotion) => (
                      <label
                        key={emotion.id}
                        className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                          selectedEmotion === emotion.id 
                            ? `${emotion.color} ring-2 ring-offset-2 ring-blue-500` 
                            : `${emotion.color} hover:shadow-md`
                        }`}
                      >
                        <input
                          type="radio"
                          name="emotion"
                          value={emotion.id}
                          checked={selectedEmotion === emotion.id}
                          onChange={(e) => setSelectedEmotion(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedEmotion === emotion.id 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {selectedEmotion === emotion.id && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="font-medium">{emotion.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 今日の小さな気づきセクション */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">今日の小さな気づき</h3>
                
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 rounded-full"></div>
                  <textarea
                    value={insights}
                    onChange={(e) => setInsights(e.target.value)}
                    className="w-full pl-6 pr-4 py-4 border-none outline-none resize-none text-base placeholder-gray-400 bg-transparent min-h-[120px]"
                    placeholder=""
                    maxLength={280}
                  />
                </div>
              </div>

              {/* 表示名設定と投稿ボタン */}
              <form onSubmit={handleDiarySubmit} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-900">
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
                      value={diaryNickname}
                      onChange={(e) => setDiaryNickname(e.target.value)}
                      disabled={isAnonymous}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder={profile?.display_name || "表示名を入力..."}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      投稿後、掲示板に表示されます
                    </div>
                    <button
                      type="submit"
                      disabled={!diaryContent.trim() || isSubmitting}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      日記を投稿
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="プロフィール画像"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-4 border-gray-200">
                      <ElegantHeart className="text-white" size="lg" />
                    </div>
                  )}
                  
                  {avatarUrl && (
                    <button
                      onClick={handleDeleteAvatar}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-2">プロフィール画像</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    JPEGまたはPNG形式、最大5MBまで
                  </p>
                  <label className="btn-secondary cursor-pointer inline-flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    画像をアップロード
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    表示名 *
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="form-input"
                    placeholder="表示名を入力してください"
                    maxLength={50}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {50 - displayName.length} 文字残り
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    自己紹介
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="form-textarea"
                    placeholder="自己紹介を書いてください..."
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {160 - bio.length} 文字残り
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    ウェブサイト
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="form-input"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    場所
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-input"
                    placeholder="東京, 日本"
                    maxLength={30}
                  />
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-black mb-3">アカウント情報</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">メール:</span>
                    <span className="text-black">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">登録日:</span>
                    <span className="text-black">
                      {profile?.created_at && formatDate(new Date(profile.created_at))}
                    </span>
                  </div>
                  {profile?.is_admin && (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600 font-medium">管理者アカウント</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <h3 className="font-medium text-black">プロフィールを公開</h3>
                    <p className="text-sm text-gray-600">
                      他のユーザーがあなたのプロフィールを見ることができます
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl">
                  <h3 className="font-medium text-black mb-2">データのダウンロード</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    あなたの投稿データをダウンロードできます
                  </p>
                  <button className="btn-secondary">
                    データをダウンロード
                  </button>
                </div>

                <div className="p-4 border border-red-200 rounded-xl bg-red-50">
                  <h3 className="font-medium text-red-800 mb-2">アカウントの削除</h3>
                  <p className="text-sm text-red-600 mb-4">
                    アカウントを削除すると、すべてのデータが永久に失われます
                  </p>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                    アカウントを削除
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <h3 className="font-medium text-black">メール通知</h3>
                    <p className="text-sm text-gray-600">
                      新しいコメントや返信をメールで受け取る
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl">
                  <h3 className="font-medium text-black mb-4">通知の頻度</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="frequency"
                        value="immediate"
                        className="text-blue-600"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-700">即座に通知</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="frequency"
                        value="daily"
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">1日1回まとめて</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="frequency"
                        value="weekly"
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">週1回まとめて</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            キャンセル
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={isSaving || !displayName.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            保存する
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage