"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    await login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4 safe-area-inset">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-slate-800">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
          IELTS Admin Portal
        </h1>
        <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
          Admin System Login
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <Input
            type="email"
            label="Email"
            placeholder="admin@ieltslms.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter password"
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
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700">
            Forgot password?
          </button>
        </div>
      </Card>
    </div>
  );
}
