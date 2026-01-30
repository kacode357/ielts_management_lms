"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { teacherService } from "@/services/teacher.service";
import { cookieUtils } from "@/utils/cookie";
import { toast } from "react-hot-toast";
import { GraduationCap, BookOpen } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"teacher" | "student">("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setIsLoading(true);
      const service = role === "teacher" ? teacherService : require("@/services/student.service").studentService;
      const response = await service.login({ email, password });

      if (response.token) {
        cookieUtils.set("token", response.token, 7);
      }
      if (response.user) {
        cookieUtils.setJSON("user", response.user, 7);
      }

      toast.success("Đăng nhập thành công!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md p-8">
        {/* Role Toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setRole("teacher")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              role === "teacher"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <GraduationCap className="w-5 h-5 inline mr-2" />
            Teacher
          </button>
          <button
            onClick={() => setRole("student")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              role === "student"
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Student
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              role === "teacher" ? "bg-blue-600" : "bg-green-600"
            }`}
          >
            {role === "teacher" ? (
              <GraduationCap className="w-10 h-10 text-white" />
            ) : (
              <BookOpen className="w-10 h-10 text-white" />
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          {role === "teacher" ? "Teacher Portal" : "Student Portal"}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {role === "teacher"
            ? "Đăng nhập để quản lý lớp học"
            : "Đăng nhập để xem khóa học"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email"
            placeholder={
              role === "teacher"
                ? "teacher@ieltslms.com"
                : "student@ieltslms.com"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700">
            Quên mật khẩu?
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Demo:{" "}
            {role === "teacher"
              ? "teacher1@ieltslms.com / Teacher@123"
              : "student1@ieltslms.com / Student@123"}
          </p>
        </div>
      </Card>
    </div>
  );
}
