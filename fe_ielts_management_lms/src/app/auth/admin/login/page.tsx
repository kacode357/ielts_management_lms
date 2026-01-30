"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { adminService } from "@/services/admin.service";
import { cookieUtils } from "@/utils/cookie";
import { toast } from "react-hot-toast";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
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
      const response = await adminService.login({ email, password });

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-violet-100 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Admin Portal
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in to access admin dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="admin@ieltslms.com"
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
            {isLoading ? "Signing in..." : "Sign In as Admin"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Not an admin?</p>
          <div className="mt-2 space-x-4">
            <button
              onClick={() => router.push("/auth/teacher/login")}
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              Teacher Login
            </button>
            <span>•</span>
            <button
              onClick={() => router.push("/auth/student/login")}
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              Student Login
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
