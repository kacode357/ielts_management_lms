'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline'
  isLoading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', isLoading = false, size = 'md', className = '', ...props }, ref) => {
    const baseClass = 'btn'
    const variantClass = `btn-${variant}`
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    }

    return (
      <button
        ref={ref}
        className={`${baseClass} ${variantClass} ${sizeClasses[size]} ${className} transition-all hover:scale-[1.02] active:scale-[0.98]`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {children}
          </div>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
