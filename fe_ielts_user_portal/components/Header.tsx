"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cookieUtils } from "@/utils/cookie";
import { User } from "@/types/auth";
import { LogOut, User as UserIcon, Home, BookOpen, Menu, X } from "lucide-react";
import { useMounted } from "@/hooks";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useMemo(() => {
    if (!mounted) return null;
    return cookieUtils.getJSON<User>("__usr_x");
  }, [mounted]);

  const handleLogout = () => {
    cookieUtils.remove("__tkn_x");
    cookieUtils.remove("__usr_x");
    router.push("/login");
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  if (!user) return null;

  const coursesPath = user?.role === 'teacher' ? '/teacher/courses' : '/student/courses';

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center gap-4 lg:gap-8">
            <h1 
              onClick={() => navigateTo("/home")}
              className="text-xl sm:text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors duration-200"
            >
              IELTS LMS
            </h1>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => navigateTo("/home")}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group ${
                  pathname === "/home"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <Home className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span>Home</span>
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-600 transition-all duration-300 ${
                  pathname === "/home" ? "w-8" : "w-0 group-hover:w-8"
                }`} />
              </button>
              
              <button
                onClick={() => navigateTo(coursesPath)}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group ${
                  pathname.includes("/courses")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <BookOpen className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span>My Courses</span>
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-600 transition-all duration-300 ${
                  pathname.includes("/courses") ? "w-8" : "w-0 group-hover:w-8"
                }`} />
              </button>
            </nav>
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 cursor-pointer group"
            >
              <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {/* Mobile User Info */}
            <div className="flex items-center gap-3 px-2 py-3 mb-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-1">
              <button
                onClick={() => navigateTo("/home")}
                className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  pathname === "/home"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => navigateTo(coursesPath)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  pathname.includes("/courses")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>My Courses</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
