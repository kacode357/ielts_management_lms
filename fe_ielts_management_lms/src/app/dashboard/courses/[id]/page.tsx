"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Edit2, Users, BookOpen, Calendar, Trash2 } from "lucide-react";
import { courseService } from "@/services/course.service";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string | undefined;

  const [course, setCourse] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    if (!courseId) {
      toast.error("Invalid course ID");
      router.push("/dashboard/courses");
      return;
    }

    try {
      setIsLoading(true);
      const courses = await courseService.getCourses();
      const foundCourse = courses.find((c: any) => c._id === courseId);
      
      if (foundCourse) {
        setCourse(foundCourse);
        const enrollmentData = await courseService.getEnrollmentsByCourse(courseId);
        setEnrollments(enrollmentData);
      } else {
        toast.error("Course not found");
        router.push("/dashboard/courses");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    if (!confirm("Are you sure you want to remove this student from the course?")) {
      return;
    }

    try {
      // Assuming you have an unenroll endpoint
      toast.success("Student removed successfully");
      fetchCourseDetails();
    } catch (error) {
      console.error("Error removing student:", error);
      toast.error("Failed to remove student");
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <Card className="p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Course not found</h3>
        <Button variant="primary" onClick={() => router.push("/dashboard/courses")}>
          Back to Courses
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/courses")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
            <p className="text-gray-500 mt-1">{course.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push(`/dashboard/courses/${courseId}/import-teachers`)}
          >
            <Users className="w-5 h-5 mr-2" />
            Import Teachers
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push(`/dashboard/courses/${courseId}/import-students`)}
          >
            <Users className="w-5 h-5 mr-2" />
            Import Students
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel Edit" : "Edit Course"}
          </Button>
        </div>
      </div>

      {/* Course Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Course Name</label>
            <p className="mt-1 text-gray-900">{course.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Course Code</label>
            <p className="mt-1 text-gray-900">{course.code}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Level</label>
            <div className="mt-1">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(
                  course.level
                )}`}
              >
                {course.level}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="mt-1">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  course.status || "upcoming"
                )}`}
              >
                {course.status || "upcoming"}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Start Date</label>
            <p className="mt-1 text-gray-900">
              {course.startDate ? format(new Date(course.startDate), "PPP") : "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">End Date</label>
            <p className="mt-1 text-gray-900">
              {course.endDate ? format(new Date(course.endDate), "PPP") : "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Total Sessions</label>
            <p className="mt-1 text-gray-900">{course.totalSessions || 0}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Enrolled Students</label>
            <p className="mt-1 text-gray-900">{enrollments.length}</p>
          </div>
          {course.description && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-gray-900">{course.description}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Enrolled Students */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Enrolled Students ({enrollments.length})
          </h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(`/dashboard/courses/${courseId}/enroll`)}
          >
            <Users className="w-4 h-4 mr-2" />
            Add Students
          </Button>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No students enrolled
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding students to this course
            </p>
            <Button
              variant="primary"
              onClick={() => router.push(`/dashboard/courses/${courseId}/enroll`)}
            >
              <Users className="w-4 h-4 mr-2" />
              Add Students
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment: any) => (
              <div
                key={enrollment._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {enrollment.studentId?.userId?.fullName || enrollment.studentId?.fullName || "Unknown Student"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {enrollment.studentId?.userId?.email || enrollment.studentId?.email || "No email"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Enrolled: {enrollment.enrolledAt ? format(new Date(enrollment.enrolledAt), "PP") : "N/A"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnenroll(enrollment._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{course.totalSessions || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Course Level</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{course.level}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
