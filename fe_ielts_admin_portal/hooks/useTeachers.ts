import { useState, useEffect, useCallback } from 'react';
import { teachersService } from '@/services/teachers';
import { TeacherDropdown } from '@/types/teachers';

interface UseTeachersDropdownReturn {
  teachers: TeacherDropdown[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTeachersDropdown = (): UseTeachersDropdownReturn => {
  const [teachers, setTeachers] = useState<TeacherDropdown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teachersService.getDropdown();
      setTeachers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  return {
    teachers,
    loading,
    error,
    refetch: fetchTeachers,
  };
};
