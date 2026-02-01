import { useState, useEffect, useCallback } from 'react';
import { courseLevelsService } from '@/services/course-levels';
import { CourseLevelDropdown } from '@/types/course-levels';

interface UseCourseLevelsDropdownReturn {
  courseLevels: CourseLevelDropdown[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCourseLevelsDropdown = (): UseCourseLevelsDropdownReturn => {
  const [courseLevels, setCourseLevels] = useState<CourseLevelDropdown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseLevels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseLevelsService.getDropdown();
      setCourseLevels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course levels');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourseLevels();
  }, [fetchCourseLevels]);

  return {
    courseLevels,
    loading,
    error,
    refetch: fetchCourseLevels,
  };
};
