'use client'

import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useLogin } from '@/hooks/auth'
import { LoginPayload } from '@/types/auth'
import { Toaster } from 'react-hot-toast'
import { cookieUtils } from '@/utils/cookie'

export default function LoginPage() {
  const { login, isLoading } = useLogin()
  const { register, handleSubmit, formState: { errors }, setFocus } = useForm<LoginPayload>()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Focus on email input when component mounts
  useEffect(() => {
    setFocus('email')
  }, [setFocus])

  const onSubmit = async (data: LoginPayload) => {
    try {
      if (rememberMe) {
        cookieUtils.set('rememberedEmail', data.email, 30)
      } else {
        cookieUtils.remove('rememberedEmail')
      }
      await login(data)
    } catch (error) {
      // Error handling is done in useLogin hook
      console.error('Login error:', error)
    }
  }

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = cookieUtils.get('rememberedEmail')
    if (rememberedEmail) {
      setRememberMe(true)
    }
  }, [])

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <motion.div 
                className="p-3 bg-gradient-to-br from-violet-100 to-pink-100 rounded-full"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <LogIn className="w-8 h-8 text-primary" />
              </motion.div>
            </div>
            <CardTitle className="text-center bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-text-secondary text-center mt-2">
              Sign in to continue your IELTS learning journey
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3 top-[38px] h-5 w-5 text-zinc-400" />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  autoComplete="email"
                  disabled={isLoading}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  error={errors.email?.message}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-3 top-[38px] h-5 w-5 text-zinc-400" />
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-zinc-400 hover:text-zinc-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-primary focus:ring-primary border-zinc-300 cursor-pointer"
                    disabled={isLoading}
                  />
                  <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                    Remember me
                  </span>
                </label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-primary hover:text-violet-700 font-medium transition-colors"
                  tabIndex={isLoading ? -1 : 0}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-text-secondary">
                    New to IELTS LMS?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link 
                  href="/auth/register" 
                  className="text-primary hover:text-violet-700 font-medium transition-colors inline-flex items-center gap-1"
                  tabIndex={isLoading ? -1 : 0}
                >
                  Create an account
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    →
                  </motion.span>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
