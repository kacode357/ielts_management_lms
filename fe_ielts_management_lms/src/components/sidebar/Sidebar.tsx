'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/cn'
import { navigationItems } from './navigation.config'
import { Badge } from '@/components/ui/Badge'
import { useLogout } from '@/hooks/auth'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { logout } = useLogout()

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobile}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'sidebar',
          isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded',
          isMobileOpen ? 'sidebar-mobile-visible' : 'sidebar-mobile-hidden',
          className
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                IELTS LMS
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-lg">I</span>
            </div>
          )}

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:block p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'nav-item',
                    isActive && 'nav-item-active'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 font-medium text-sm whitespace-nowrap">
                        {item.title}
                      </span>
                      {item.badge && (
                        <Badge variant={isActive ? 'secondary' : 'default'} className="ml-auto flex-shrink-0">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}

                  {isCollapsed && item.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-3 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
              'hover:bg-red-50 text-red-600'
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="flex-1 font-medium text-sm text-left whitespace-nowrap">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
