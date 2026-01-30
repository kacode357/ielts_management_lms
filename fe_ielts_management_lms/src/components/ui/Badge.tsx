'use client'

import { cn } from '@/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'error'
  className?: string
}

export const Badge = ({ children, variant = 'primary', className = '' }: BadgeProps) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
    primary: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100',
    secondary: 'bg-white/20 text-white',
    accent: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  }
  
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
