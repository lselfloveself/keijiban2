import React, { useState } from 'react'
import { LogIn, LogOut, Heart, Shield, Settings, Menu, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

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

interface HeaderProps {
  onAdminClick?: () => void
}

const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
  const { user, profile, signInWithGoogle, signOut } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">📝</span>
            </div>
            <h1 className="text-xl font-bold text-black hidden sm:block">
              かんじょうにっき掲示板
            </h1>
            <h1 className="text-lg font-bold text-black sm:hidden">
              掲示板
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <Heart className={`w-4 h-4 ${getRandomHeartColor()} fill-current`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-900">
                        {profile?.display_name || '匿名'}
                      </span>
                      {profile?.is_admin && (
                        <Shield className="w-4 h-4 text-yellow-500" title="管理者" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      @{profile?.display_name?.toLowerCase().replace(/\s+/g, '') || 'anonymous'}
                    </span>
                  </div>
                </div>
                
                {profile?.is_admin && (
                  <button
                    onClick={onAdminClick}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">管理</span>
                  </button>
                )}
                
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">ログアウト</span>
                </button>
              </>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="btn-primary"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Googleでログイン
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="action-btn"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 py-4">
            {user ? (
              <div className="space-y-4 px-4">
                <div className="flex items-center space-x-3 px-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <Heart className={`w-4 h-4 ${getRandomHeartColor()} fill-current`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-900">
                        {profile?.display_name || '匿名'}
                      </span>
                      {profile?.is_admin && (
                        <Shield className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      @{profile?.display_name?.toLowerCase().replace(/\s+/g, '') || 'anonymous'}
                    </span>
                  </div>
                </div>
                
                {profile?.is_admin && (
                  <button
                    onClick={() => {
                      onAdminClick?.()
                      setShowMobileMenu(false)
                    }}
                    className="nav-item w-full text-left"
                  >
                    <Settings className="w-5 h-5" />
                    <span>管理画面</span>
                  </button>
                )}
                
                <button
                  onClick={() => {
                    signOut()
                    setShowMobileMenu(false)
                  }}
                  className="nav-item w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>ログアウト</span>
                </button>
              </div>
            ) : (
              <div className="px-4">
                <button
                  onClick={() => {
                    signInWithGoogle()
                    setShowMobileMenu(false)
                  }}
                  className="btn-primary w-full"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Googleでログイン
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header