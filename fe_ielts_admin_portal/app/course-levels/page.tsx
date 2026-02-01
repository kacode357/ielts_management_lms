"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  CourseLevelsHeader,
  CourseLevelsTable,
  CourseLevelModal,
} from './components';
import { courseLevelsService } from '@/services/course-levels';
import { CourseLevel } from '@/types/course-levels';

interface FormData {
  name: string;
  code: string;
  description: string;
  order: number;
}

const initialFormData: FormData = {
  name: '',
  code: '',
  description: '',
  order: 0,
};

export default function CourseLevelsPage() {
  const [courseLevels, setCourseLevels] = useState<CourseLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<CourseLevel | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchCourseLevels = async () => {
    try {
      setIsLoading(true);
      const response = await courseLevelsService.getAll();
      if (response.success) {
        setCourseLevels(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch course levels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseLevels();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (level?: CourseLevel) => {
    if (level) {
      setEditingLevel(level);
      setFormData({
        name: level.name,
        code: level.code,
        description: level.description,
        order: level.order,
      });
    } else {
      setEditingLevel(null);
      setFormData({
        ...initialFormData,
        order: courseLevels.length + 1,
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLevel(null);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      let result;

      if (editingLevel) {
        result = await courseLevelsService.update(editingLevel._id, formData);
      } else {
        result = await courseLevelsService.create(formData);
      }

      if (result.success) {
        handleCloseModal();
        fetchCourseLevels();
      }
    } catch (error) {
      console.error('Failed to save course level:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course level?')) {
      try {
        await courseLevelsService.delete(id);
        fetchCourseLevels();
      } catch (error) {
        console.error('Failed to delete course level:', error);
      }
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= courseLevels.length) return;

    const newLevels = [...courseLevels];
    [newLevels[index], newLevels[newIndex]] = [newLevels[newIndex], newLevels[index]];

    const payload = {
      levels: newLevels.map((level, idx) => ({
        id: level._id,
        order: idx + 1,
      })),
    };

    try {
      setIsReordering(true);
      await courseLevelsService.reorder(payload);
      fetchCourseLevels();
    } catch (error) {
      console.error('Failed to reorder course levels:', error);
    } finally {
      setIsReordering(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <CourseLevelsHeader onAdd={() => handleOpenModal()} />

        <CourseLevelsTable
          courseLevels={courseLevels}
          isLoading={isLoading}
          isReordering={isReordering}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          onMove={handleMove}
        />
      </div>

      <CourseLevelModal
        isOpen={isModalOpen}
        editingLevel={editingLevel}
        formData={formData}
        errors={errors}
        isLoading={isSubmitting}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
      />
    </AdminLayout>
  );
}
