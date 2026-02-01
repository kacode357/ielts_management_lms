import { useCallback, useState } from 'react';
import { courseLevelsService } from '@/services/course-levels';
import { CourseLevelDropdown } from '@/types/course-levels';

export const useCourseLevels = () => {
  const [courseLevels, setCourseLevels] = useState<CourseLevelDropdown[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourseLevels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await courseLevelsService.getDropdown();
      setCourseLevels(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch course levels'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { courseLevels, isLoading, error, fetchCourseLevels };
};
