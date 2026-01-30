"use client";

import { useState } from "react";
import { courseService, CreateCoursePayload } from "@/services/course.service";
import toast from "react-hot-toast";

export const useCreateCourse = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createCourse = async (data: CreateCoursePayload) => {
    setIsLoading(true);
    try {
      const course = await courseService.createCourse(data);
      toast.success("Course created successfully!");
      return course;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCourse, isLoading };
};

export const useGetCourses = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getCourses();
      setCourses(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchCourses, courses, isLoading };
};

export const useGetStudents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getStudents();
      setStudents(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchStudents, students, isLoading };
};

export const useGetTeachers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getTeachers();
      setTeachers(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchTeachers, teachers, isLoading };
};

export const useEnrollStudents = () => {
  const [isLoading, setIsLoading] = useState(false);

  const enrollStudents = async (courseId: string, studentIds: string[]) => {
    setIsLoading(true);
    try {
      await courseService.enrollStudents(courseId, studentIds);
      toast.success(`Enrolled ${studentIds.length} student(s) successfully!`);
    } finally {
      setIsLoading(false);
    }
  };

  return { enrollStudents, isLoading };
};
