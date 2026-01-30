"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cookieUtils } from "@/utils/cookie";
import { User } from "@/types/auth";
import { Card } from "@/components/ui/Card";
import Header from "@/components/Header";
import { BookOpen, Users, GraduationCap, Calendar } from "lucide-react";
import { useMounted } from "@/hooks";

export default function HomePage() {
  const router = useRouter();
  const mounted = useMounted();
  const user = useMemo(() => {
    if (!mounted) return null;
    return cookieUtils.getJSON<User>("__usr_x");
  }, [mounted]);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
    }
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName}!
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Here&apos;s what&apos;s happening with your courses today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Courses
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">12</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Students</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">248</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Teachers</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">15</p>
                </div>
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Active Classes
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">8</p>
                </div>
                <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Recent Courses
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      IELTS 6.0 Foundation
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                      Room A1 • Mon-Wed-Fri 19:00-21:00
                    </p>
                  </div>
                  <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full shrink-0">
                    Active
                  </span>
                </div>

                <div className="flex items-start justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      IELTS 7.0 Advanced
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                      Room B2 • Tue-Thu-Sat 18:00-20:00
                    </p>
                  </div>
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full shrink-0">
                    Scheduled
                  </span>
                </div>

                <div className="flex items-start justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      IELTS Writing Skills
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                      Room C1 • Mon-Wed 17:00-19:00
                    </p>
                  </div>
                  <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full shrink-0">
                    Active
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <button className="w-full flex items-center gap-3 p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                  <BookOpen className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Create Course</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      Add a new course to the system
                    </p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                  <Users className="w-5 h-5 text-green-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      Manage Students
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      View and manage student records
                    </p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                  <GraduationCap className="w-5 h-5 text-purple-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      Manage Teachers
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      View and manage teacher profiles
                    </p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-3 sm:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
                  <Calendar className="w-5 h-5 text-orange-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">View Schedule</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      Check class schedules and availability
                    </p>
                  </div>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
