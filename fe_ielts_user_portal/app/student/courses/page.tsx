"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/api";
import { BookOpen, Users, Calendar } from "lucide-react";
import { Course } from "@/types/course";
import Header from "@/components/Header";

export default function StudentCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        // Use shared /courses API - backend filters by role
        const response = await axiosInstance.get("/courses");
        if (response.data.success) {
          setCourses(response.data.data.courses);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-6 sm:py-8 px-4">
        <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-sm sm:text-base text-gray-600">View your enrolled courses and attendance</p>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <BookOpen className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Courses Yet</h3>
            <p className="text-sm sm:text-base text-gray-500">You haven&apos;t enrolled in any courses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => router.push(`/student/courses/${course._id}`)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                <div className="h-2 bg-linear-to-r from-blue-500 to-purple-600"></div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base sm:text-lg group-hover:scale-110 transition-transform">
                      {course.code.substring(0, 2)}
                    </div>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2">{course.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                  <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Level: {course.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{course.totalHours} hours</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </>
  );
}
