"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  HeartHandshake,
  AlertCircle,
} from "lucide-react";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. เช็คค่าว่าง
    if (
      !formData.username ||
      !formData.password ||
      !formData.email ||
      !formData.confirmPassword
    ) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // 2. เช็ครูปแบบอีเมล
    if (!validateEmail(formData.email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }

    // 3. เช็คความยาว Username (>= 6)
    if (formData.username.length < 6) {
      setError("ชื่อผู้ใช้งานต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    // 4. เช็คความยาว Password (>= 8)
    if (formData.password.length < 8) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    // 5. เช็คว่ารหัสผ่านตรงกันไหม
    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านยืนยันไม่ตรงกับรหัสผ่าน");
      return;
    }

    // --- จุดที่ต้องต่อ API ---
    const { confirmPassword: _confirmPassword, fullName, ...rest } = formData;
    const payload = { ...rest, full_name: fullName };
    console.log("Register Data to API:", payload);

    try {
      await authService.register(payload);
      alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
      router.push("/login");
    } catch (err: unknown) {
      const error = err as Error & { response?: { data?: { error?: string } } };
      setError(
        error.response?.data?.error || "ไม่สามารถสมัครสมาชิกได้ โปรดลองอีกครั้ง"
      );
    }
  };

  const inputClass = (isError: boolean) =>
    `w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-gray-700 bg-white transition-all ${
      isError
        ? "border-red-500 focus:ring-red-200"
        : "border-gray-300 focus:ring-primary/50"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-linear-to-b from-teal-50 to-teal-100 p-4">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-lg border border-white/60 relative"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <HeartHandshake
              className="text-primary-dark w-8 h-8"
              strokeWidth={2.5}
            />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#0D3B66]">Fear</span>
              <span className="text-primary-dark">Free</span>
              <span className="text-[#0D3B66]"> Animals</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#0D3B66]">สมัครสมาชิก</h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[#0D3B66] font-bold text-sm">
              ชื่อ-สกุล
            </label>
            <input
              type="text"
              placeholder="ชื่อ-สกุล"
              className={inputClass(false)}
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#0D3B66] font-bold text-sm">
              อีเมล<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className={inputClass(!!error && !validateEmail(formData.email))}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setError("");
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#0D3B66] font-bold text-sm">
              ชื่อผู้ใช้งาน<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="ชื่อผู้ใช้งาน (ขั้นต่ำ 6 ตัวอักษร)"
              className={inputClass(
                !!error &&
                  formData.username.length > 0 &&
                  formData.username.length < 6
              )}
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                setError("");
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#0D3B66] font-bold text-sm">
              รหัสผ่าน<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="รหัสผ่าน (ขั้นต่ำ 8 ตัวอักษร)"
                className={`${inputClass(
                  !!error && formData.password.length < 8
                )} pr-12`}
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

          <div className="space-y-1">
            <label className="text-[#0D3B66] font-bold text-sm">
              ยืนยันรหัสผ่าน<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                className={`${inputClass(
                  !!error && formData.confirmPassword !== formData.password
                )} pr-12`}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  setError("");
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0D3B66]"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-start gap-2 text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100 mt-2"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full bg-[#D9886A] hover:bg-[#c5765a] text-white text-lg font-bold py-3 rounded-full shadow-lg transition-transform active:scale-95 mt-6"
          >
            สมัครสมาชิก
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
