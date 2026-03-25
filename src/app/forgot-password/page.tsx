"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, HeartHandshake } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  // TODO: ต้องรอ Backend endpoint สำหรับ forgot-password ก่อนจึงจะเชื่อมต่อ API ได้
  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    // ฟีเจอร์นี้ยังไม่พร้อมใช้งาน - รอ Backend endpoint
    toast.error("ฟีเจอร์นี้ยังไม่พร้อมใช้งาน");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-linear-to-b from-teal-50 to-teal-100 p-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-teal-200/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-3xl translate-y-1/3 translate-x-1/4 -z-10" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-md border border-white/60 relative text-center"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-4">
            <HeartHandshake
              className="text-primary-dark w-10 h-10"
              strokeWidth={2.5}
            />
            <span className="text-2xl font-bold text-[#0D3B66] tracking-tight">
              Fear<span className="text-primary-dark">Free</span> Animals
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#0D3B66]">ลืมรหัสผ่าน ?</h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            กรอกอีเมลที่คุณใช้สมัครสมาชิก <br />
            ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="text-[#0D3B66] font-bold text-sm ml-1">
              อีเมล
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="ระบุอีเมลของคุณ"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#D9886A] hover:bg-[#c5765a] text-white text-lg font-bold py-3 rounded-full shadow-lg transition-transform active:scale-95"
          >
            ยืนยัน
          </button>
        </form>
      </motion.div>

      <Link
        href="/login"
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
