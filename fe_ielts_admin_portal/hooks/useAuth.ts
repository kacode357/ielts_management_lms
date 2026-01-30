"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { LoginPayload, User } from '@/types/auth';
import { cookieUtils } from '@/utils/cookie';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (payload: LoginPayload) => {
    try {
      setIsLoading(true);
      const response = await authService.login(payload);

      if (response.success) {
        const { token, user } = response.data;
        
        // Validate admin role
        if (user?.role !== 'admin') {
          toast.error('Access denied. Admin role required.');
          return { success: false, error: 'Access denied' };
        }
        
        // Remove old cookie names if they exist
        cookieUtils.remove('token');
        cookieUtils.remove('user');
        
        // Save to cookies
        if (token) {
          cookieUtils.set('__tkn_x', token, 7);
        }
        if (user) {
          cookieUtils.setJSON('__usr_x', user, 7);
          setUser(user);
        }

        toast.success('Login successful!');
        
        // Redirect to admin dashboard
        router.push('/dashboard');
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    cookieUtils.remove('__tkn_x');
    cookieUtils.remove('__usr_x');
    setUser(null);
    router.push('/login');
    toast.success('Logged out successfully');
  };

  const getUser = (): User | null => {
    if (typeof window !== 'undefined') {
      return cookieUtils.getJSON<User>('__usr_x');
    }
    return null;
  };

  const isAdmin = (): boolean => {
    const currentUser = getUser();
    return currentUser?.role === 'admin';
  };

  return {
    login,
    logout,
    getUser,
    isAdmin,
    isLoading,
    user,
  };
};
