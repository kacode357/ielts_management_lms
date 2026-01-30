"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/services/api";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Course } from "@/types/course";
import { Schedule } from "@/types/schedule";
import Link from "next/link";
import StudentScheduleTab from "./components/StudentScheduleTab";
import Header from "@/components/Header";

type TabType = "overview" | "schedule";

export default function StudentCourseDetailPage() {
  const params = useParams();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/courses/${courseId}`);
        if (response.data.success) {
          setCourse(response.data.data.course);
        }
      } catch (error) {
        console.error("Fetch course error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (activeTab !== "schedule" || !courseId) return;

      try {
        setIsScheduleLoading(true);
        // Student uses their own endpoint with courseId filter
        const response = await axiosInstance.get(`/schedules/student/my-schedule`, {
          params: { courseId }
        });
        if (response.data.success) {
          setSchedules(response.data.data.schedules);
        }
      } catch (error) {
        console.error("Fetch schedule error:", error);
      } finally {
        setIsScheduleLoading(false);
      }
    };

    fetchSchedule();
  }, [activeTab, courseId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Course not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-6 sm:py-8 px-4">
        <div className="max-w-6xl mx-auto">
        <Link
          href="/student/courses"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 sm:mb-6 font-medium text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 wrap-break-word">{course.name}</h1>
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium rounded-full">
                  {course.code}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-600 line-clamp-3 sm:line-clamp-none">{course.description}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 sm:gap-8 px-4 sm:px-6 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-3 sm:py-4 font-medium transition-colors relative whitespace-nowrap text-sm sm:text-base ${
                  activeTab === "overview"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Overview
                {activeTab === "overview" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("schedule")}
                className={`py-3 sm:py-4 font-medium transition-colors relative whitespace-nowrap text-sm sm:text-base ${
                  activeTab === "schedule"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Schedule & Attendance
                {activeTab === "schedule" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-blue-600 font-medium mb-1">Level</div>
                    <div className="text-lg sm:text-2xl font-bold text-blue-900">{course.level}</div>
                  </div>
                  <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-purple-600 font-medium mb-1">Total Hours</div>
                    <div className="text-lg sm:text-2xl font-bold text-purple-900">{course.totalHours}h</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <StudentScheduleTab schedules={schedules} isLoading={isScheduleLoading} />
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
