"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

export default function DashboardPage() {
  const router = useRouter();
  const { getUser, isAdmin, logout } = useAuth();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin") {
      router.push("/login");
    }
  }, [router, getUser]);

  const user = getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Chào mừng đến Dashboard
        </h2>
        <p className="text-gray-600">
          Đây là trang quản trị IELTS. Bạn có thể bắt đầu xây dựng các tính năng quản trị tại đây.
        </p>
      </div>
    </AdminLayout>
  );
}
