"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  HeartHandshake,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuthStore, authService } from "@/features/auth";

export default function PatientLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ✅ แก้ตรงนี้: เปลี่ยน let เป็น const
    const value = e.target.value.toUpperCase().trim();

    // อนุญาตเฉพาะ A-Z และ 0-9
    if (value && !/^[A-Z0-9]*$/.test(value)) {
      return;
    }

    setCode(value);
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code) {
      setError("กรุณากรอกรหัสผู้ป่วย");
      return;
    }
    if (code.length < 5) {
      setError("รหัสไม่ถูกต้อง (สั้นเกินไป)");
      return;
    }



    try {
      const res = await authService.patientLogin(code);
      login(res.user, res.token, res.refresh_token);

      setSuccess("เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้าถัดไป...");
      setTimeout(() => {
        router.push("/assessment");
      }, 2000);
    } catch (err: unknown) {
      const error = err as Error & { response?: { data?: { error?: string } } };
      setError(
        error.response?.data?.error || "รหัสไม่ถูกต้อง หรือไม่พบผู้ป่วยในระบบ"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-linear-to-b from-teal-50 to-teal-100 p-4">
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

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-md border border-white/60 relative text-center"
      >
        <div className="flex flex-col items-center mb-8">
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
          <h2 className="text-2xl font-bold text-[#0D3B66]">
            เข้าสู่ระบบผู้ป่วย
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="text-[#0D3B66] font-bold text-sm ml-1">
              โค้ด
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="กรอกโค้ดที่ได้รับจากคุณหมอ"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-gray-700 bg-white transition-all font-bold tracking-widest ${
                  error
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-primary-dark"
                }`}
                value={code}
                onChange={handleInputChange}
                disabled={!!success}
              />
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-1 text-red-500 text-sm font-medium mt-1 pl-1"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={!code || !!success}
              className="w-full bg-[#D9886A] hover:bg-[#c5765a] text-white text-lg font-bold py-3 rounded-full shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {success ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </div>
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
