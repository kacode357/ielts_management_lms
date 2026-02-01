"use client";

import { useState, useCallback } from 'react';
import { courseLevelsService } from '@/services/course-levels';
import { CreateCourseLevelPayload, CourseLevel, CreateCourseLevelResponse, ErrorResponse } from '@/types/course-levels';
import { toast } from 'react-hot-toast';

interface UseCreateCourseLevelReturn {
  createCourseLevel: (data: CreateCourseLevelPayload) => Promise<{ success: boolean; data?: CourseLevel; error?: Error }>;
  isLoading: boolean;
  error: Error | null;
}

export const useCreateCourseLevel = (): UseCreateCourseLevelReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCourseLevel = useCallback(async (data: CreateCourseLevelPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await courseLevelsService.create(data) as CreateCourseLevelResponse | ErrorResponse;
      
      if (response.success) {
        toast.success('Course level created successfully!');
        return { success: true, data: (response as CreateCourseLevelResponse).data };
      } else {
        const errorResponse = response as ErrorResponse;
        const errorMsg = errorResponse.message || 'Failed to create course level';
        toast.error(errorMsg);
        setError(new Error(errorMsg));
        return { success: false, error: new Error(errorMsg) };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create course level';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      return { success: false, error: err instanceof Error ? err : new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createCourseLevel,
    isLoading,
    error,
  };
};
