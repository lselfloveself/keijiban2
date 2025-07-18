import React, { useState, useEffect } from 'react'
import { Camera, Save, X, User, Mail, Calendar, Shield, Settings, Upload, Trash2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatDate } from '../utils/dateUtils'
import ElegantHeart from './ElegantHeart'

interface ProfilePageProps {
  onClose: () => void
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
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
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'notifications'>('profile')

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setAvatarUrl(profile.avatar_url || '')
      // 追加のプロフィール情報があれば設定
    }
  }, [profile])

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