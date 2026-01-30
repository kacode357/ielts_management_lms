"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { teacherService } from "@/services/teacher.service";
import { cookieUtils } from "@/utils/cookie";
import { toast } from "react-hot-toast";
import { GraduationCap } from "lucide-react";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await teacherService.login({ email, password });

      // Store token and user data
      if (response.token) {
        cookieUtils.set("token", response.token, 7);
      }
      if (response.user) {
        cookieUtils.setJSON("user", response.user, 7);
      }

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Teacher Portal
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in to manage your classes
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="teacher@ieltslms.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In as Teacher"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/auth/teacher/forgot-password")}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Switch login type:</p>
          <div className="mt-2 space-x-4">
            <button
              onClick={() => router.push("/auth/admin/login")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Admin Login
            </button>
            <span>•</span>
            <button
              onClick={() => router.push("/auth/student/login")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Student Login
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Demo: teacher1@ieltslms.com / Teacher@123
          </p>
        </div>
      </Card>
    </div>
  );
}
