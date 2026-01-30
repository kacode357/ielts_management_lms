"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Plus, Users, BookOpen, Calendar } from "lucide-react";
import { useGetCourses } from "@/hooks/course/useCourse";

export default function CoursesPage() {
  const router = useRouter();
  const { fetchCourses, courses, isLoading } = useGetCourses();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course: any) =>
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-700",
      intermediate: "bg-blue-100 text-blue-700",
      advanced: "bg-purple-100 text-purple-700",
    };
    return colors[level] || "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming: "bg-yellow-100 text-yellow-700",
      ongoing: "bg-green-100 text-green-700",
      completed: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 mt-1">Manage your IELTS courses</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push("/dashboard/courses/create")}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <Input
          placeholder="Search courses by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by creating your first course"}
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => router.push("/dashboard/courses/create")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Course
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: any) => (
            <div
              key={course._id}
              className="cursor-pointer"
              onClick={() => router.push(`/dashboard/courses/${course._id}`)}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-500">{course.code}</p>
                  </div>
                  {course.isActive !== undefined && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {course.isActive ? "Active" : "Inactive"}
                    </span>
                  )}
                </div>

                {course.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(
                        course.level
                      )}`}
                    >
                      {course.level}
                    </span>
                  </div>
                  
                  {course.duration && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{course.duration} weeks</span>
                      {course.totalHours && (
                        <span className="ml-2 text-gray-400">
                          • {course.totalHours} hours
                        </span>
                      )}
                    </div>
                  )}
                  
                  {course.maxStudents && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Max {course.maxStudents} students</span>
                    </div>
                  )}
                </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/courses/${course._id}`);
                }}
              >
                View Details
              </Button>
            </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
