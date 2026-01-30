"use client";

import { useEffect } from 'react';
import { cookieUtils } from '@/utils/cookie';

export default function CookieCleanup() {
  useEffect(() => {
    // Clean up old cookie names on mount
    cookieUtils.remove('token');
    cookieUtils.remove('user');
  }, []);

  return null;
}
