import { useCallback, useState } from 'react';
import { teachersService } from '@/services/teachers';
import { TeacherDropdown } from '@/types/teachers';

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<TeacherDropdown[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeachers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await teachersService.getDropdown();
      setTeachers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch teachers'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { teachers, isLoading, error, fetchTeachers };
};
