"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginSelectPage() {
  return (
    // ใช้ Flex-col เพื่อให้ Navbar อยู่บน และเนื้อหาอยู่กลางจอ
    <div className="min-h-screen flex flex-col relative overflow-hidden from-teal-50 to-teal-100">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Main Content (Card) */}
      <div className="flex-1 flex items-center justify-center p-4">
        {/* ใส่ Animation ให้ Card เด้งขึ้นมาสวยๆ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-10 w-full max-w-lg border border-white/60 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#0D3B66] mb-8">
            เข้าสู่ระบบด้วย
          </h2>

          <div className="space-y-4">
            {/* ปุ่ม 1: บุคคลทั่วไป -> ไปหน้า Register */}
            <Link
              href="/login"
              className="block w-full bg-[#D9886A] hover:bg-[#c5765a] text-white text-xl font-bold py-4 rounded-full shadow-md transition-transform hover:scale-105"
            >
              บุคคลทั่วไป
            </Link>

            {/* ตัวคั่น "หรือ" */}
            <div className="text-gray-400 font-medium text-md">หรือ</div>

            {/* ปุ่ม 2: บุคคลได้รับการรักษา -> ไปหน้า Login ผู้ป่วย */}
            <Link
              href="/login/patient"
              className="block w-full bg-[#D9886A] hover:bg-[#c5765a] text-white text-xl font-bold py-4 rounded-full shadow-md transition-transform hover:scale-105"
            >
              บุคคลได้รับการรักษา
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Background Element (Optional): วงกลมจางๆ เพิ่มมิติ */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/4" />
    </div>
  );
}
