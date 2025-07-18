import React, { useState } from 'react'
import { Search, Filter, X, Calendar, User, Hash } from 'lucide-react'

export interface FilterOptions {
  keyword: string
  username: string
  emotion: string
  dateFrom: string
  dateTo: string
}

interface SearchFilterProps {
  onFilterChange: (filters: FilterOptions) => void
  totalCount: number
  filteredCount: number
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
  onFilterChange, 
  totalCount, 
  filteredCount 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    keyword: '',
    username: '',
    emotion: '',
    dateFrom: '',
    dateTo: ''
  })

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
      keyword: '',
      username: '',
      emotion: '',
      dateFrom: '',
      dateTo: ''
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => value.trim() !== '')

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Search className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">検索・フィルター</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {filteredCount}/{totalCount}件
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>クリア</span>
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isExpanded 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>{isExpanded ? '閉じる' : '詳細検索'}</span>
          </button>
        </div>
      </div>

      {/* Quick Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            placeholder="キーワードで検索..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-200 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username Filter */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>ユーザー名</span>
              </label>
              <input
                type="text"
                value={filters.username}
                onChange={(e) => handleFilterChange('username', e.target.value)}
                placeholder="ユーザー名で絞り込み..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Emotion Filter */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4" />
                <span>感情</span>
              </label>
              <select
                value={filters.emotion}
                onChange={(e) => handleFilterChange('emotion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">すべての感情</option>
                <optgroup label="ネガティブな感情">
                  <option value="fear">恐怖</option>
                  <option value="sadness">悲しみ</option>
                  <option value="anger">怒り</option>
                  <option value="disgust">悔しい</option>
                  <option value="indifference">無価値感</option>
                  <option value="guilt">罪悪感</option>
                  <option value="loneliness">寂しさ</option>
                  <option value="shame">恥ずかしさ</option>
                </optgroup>
                <optgroup label="ポジティブな感情">
                  <option value="joy">嬉しい</option>
                  <option value="gratitude">感謝</option>
                  <option value="achievement">達成感</option>
                  <option value="happiness">幸せ</option>
                </optgroup>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                <span>開始日</span>
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                <span>終了日</span>
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Search Tips */}
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">検索のヒント</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• キーワード検索では日記の内容を検索できます</li>
              <li>• ユーザー名は部分一致で検索されます</li>
              <li>• 日付範囲を指定して期間を絞り込めます</li>
              <li>• 複数の条件を組み合わせて検索できます</li>
            </ul>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {totalCount}件中 <span className="font-semibold text-gray-900">{filteredCount}件</span> を表示
            </span>
            {filteredCount === 0 && (
              <span className="text-orange-600 font-medium">
                条件に一致する日記が見つかりませんでした
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilter