import React from 'react'

interface ElegantHeartProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const ElegantHeart: React.FC<ElegantHeartProps> = ({ 
  className = '', 
  size = 'md',
  color = 'currentColor'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  }

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke="none"
      />
      {/* 内側のハイライト効果 */}
      <path
        d="M12 19.5l-1.2-1.1C6.6 14.2 4 11.5 4 8.5 4 6.5 5.5 5 7.5 5c1.2 0 2.4.6 3.2 1.5.3.4.8.4 1.1 0C12.6 5.6 13.8 5 15 5c2 0 3.5 1.5 3.5 3.5 0 3-2.6 5.7-6.8 9.8L12 19.5z"
        fill="rgba(255,255,255,0.3)"
        stroke="none"
      />
    </svg>
  )
}

export default ElegantHeart