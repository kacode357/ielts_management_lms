'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export const Card = ({ children, className = '', hover = false }: CardProps) => {
  const cardClass = hover ? 'card-hover' : 'card'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${cardClass} ${className}`}
    >
      {children}
    </motion.div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

export const CardTitle = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <h3 className={`text-2xl font-semibold ${className}`}>
      {children}
    </h3>
  )
}

export const CardContent = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}
