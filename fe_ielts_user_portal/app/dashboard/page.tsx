"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cookieUtils } from "@/utils/cookie";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LogOut, BookOpen, Users, Calendar, FileText } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = cookieUtils.getJSON("user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }
    setUser(userData);
  }, [router]);

  const handleLogout = () => {
    cookieUtils.remove("token");
    cookieUtils.remove("user");
    router.push("/auth/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isTeacher = user.role === "teacher";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isTeacher ? "Teacher Dashboard" : "Student Dashboard"}
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user.fullName || user.email}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* My Courses */}
          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isTeacher ? "Khóa học của tôi" : "Khóa học đã đăng ký"}
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </Card>

          {/* Classes */}
          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isTeacher ? "Học sinh" : "Lớp học"}
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </Card>

          {/* Schedule */}
          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lịch học</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </Card>

          {/* Assignments */}
          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isTeacher ? "Bài tập" : "Bài tập chưa nộp"}
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Hoạt động gần đây
            </h2>
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có hoạt động nào</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
