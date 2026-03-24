"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  HeartHandshake,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
// 1. Import Store
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  // 2. ดึงฟังก์ชัน login จาก Store
  const { login } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- Validation ---
    if (!formData.username.trim() || !formData.password) {
      setError("กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน");
      return;
    }

    if (formData.password.length < 8) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    // --- ส่วนต่อ API ---
    console.log("Login with:", formData);

    try {
      const res = await authService.login(formData);
      if (res.token) {
        login(res.user, res.token, res.refresh_token);
        setSuccess("เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้าถัดไป...");
        setTimeout(() => {
          if (res.user.role === "admin") {
            router.push("/admin/dashboard");
          } else if (res.user.role === "doctor") {
            router.push("/doctor/dashboard");
          } else {
            router.push("/assessment");
          }
        }, 1500);
      }
    } catch (err: unknown) {
      const error = err as Error & { response?: { data?: { error?: string } } };
      setError(
        error.response?.data?.error || "เข้าสู่ระบบไม่สำเร็จ โปรดลองอีกครั้ง"
      );
    }
  };

  const inputBorderClass = error
    ? "border-red-500 focus:ring-red-200"
    : "border-gray-300 focus:ring-primary/50";

  return (
    // ... (ส่วน JSX เหมือนเดิมเป๊ะ ไม่ต้องแก้ครับ)
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-linear-to-b from-teal-50 to-teal-100 p-4">
      {/* Success Popup */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-6 left-0 right-0 z-100 flex justify-center pointer-events-none"
          >
            <div className="bg-teal-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 pointer-events-auto border-2 border-white/20 backdrop-blur-md">
              <CheckCircle size={28} className="text-white" strokeWidth={2.5} />
              <span className="font-bold text-lg">{success}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ... ส่วน Form ที่เหลือเหมือนเดิม ... */}
      {/* (ผมละส่วน JSX Form ไว้เพื่อความสั้น ก๊อปปี้ Logic handleLogin ไปทับของเดิมได้เลยครับ) */}

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-md border border-white/60 relative"
      >
        <div className="flex flex-col items-center mb-8">
          {/* ... Logo & Header ... */}
          <div className="flex items-center gap-2 mb-4">
            <HeartHandshake
              className="text-primary-dark w-10 h-10"
              strokeWidth={2.5}
            />
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[#0D3B66]">Fear</span>
              <span className="text-primary-dark">Free</span>
              <span className="text-[#0D3B66]"> Animals</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#0D3B66]">เข้าสู่ระบบ</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-[#0D3B66] font-bold text-sm">
              ชื่อผู้ใช้งาน<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="ชื่อผู้ใช้งาน"
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-gray-700 bg-white transition-all ${inputBorderClass}`}
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                setError("");
              }}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[#0D3B66] font-bold text-sm">
              รหัสผ่าน<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="รหัสผ่าน"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-gray-700 bg-white pr-12 transition-all ${inputBorderClass}`}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setError("");
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0D3B66]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-red-500 text-sm font-bold bg-red-50 p-2 rounded-lg border border-red-100"
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Links */}
          <div className="flex justify-between items-center text-[13px] font-bold mt-2">
            <Link
              href="/register"
              className="text-[#0D3B66] hover:underline opacity-80 hover:opacity-100"
            >
              สมัครสมาชิก ?
            </Link>
            <Link
              href="/forgot-password"
              className="text-[#0D3B66] hover:underline opacity-60 hover:opacity-100"
            >
              ลืมรหัสผ่าน ?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!!success}
            className="w-full bg-[#D9886A] hover:bg-[#c5765a] text-white text-lg font-bold py-3 rounded-full shadow-lg transition-transform active:scale-95 mt-4 disabled:opacity-70 disabled:cursor-wait"
          >
            {success ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </motion.div>

      <Link
        href="/login-select"
        className="absolute bottom-8 left-8 p-3 bg-white/50 backdrop-blur-md rounded-full border border-teal-200 text-[#0D3B66] hover:bg-white hover:shadow-lg transition-all group"
      >
        <ArrowLeft
          size={32}
          className="group-hover:-translate-x-1 transition-transform"
        />
      </Link>
    </div>
  );
}
