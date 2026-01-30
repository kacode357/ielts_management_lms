"use client";

import { useState } from 'react';
import { courseService } from '@/services/course';
import { GetCoursesPayload, Course, Pagination } from '@/types/course';
import { toast } from 'react-hot-toast';

export const useCourses = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const getCourses = async (params?: GetCoursesPayload) => {
    try {
      setIsLoading(true);
      const response = await courseService.getCourses(params);

      if (response.success) {
        setCourses(response.data.courses);
        setPagination(response.data.pagination);
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Get courses error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch courses';
      toast.error(errorMessage);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getCourses,
    isLoading,
    courses,
    pagination,
  };
};
