"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // ใส่ Animation ให้ดูสมูทแบบโปร

export default function StartPage() {
  const router = useRouter();

  useEffect(() => {
    // ตั้งเวลา 3 วินาที (3000 ms)
    const timer = setTimeout(() => {
      // เมื่อครบเวลา ให้เด้งไปหน้า "เลือกประเภท Login"
      // (เดี๋ยวเราจะไปสร้างหน้านี้กันต่อครับ)
      router.push("/login-select");
    }, 3000);

    // Cleanup: ถ้า User กดปิดก่อนเวลาหมด ให้ยกเลิก Timer (กัน Error)
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 2. วงกลมแสง Background */}
      {/* ใช้ teal-300 ตามที่พี่เขียนมา หรือถ้าอยากได้ตาม Design เป๊ะๆ ลองใช้ teal-200/50 ครับ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-200/15 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10"
      >
        <h2 className="text-2xl md:text-3xl text-[#0D3B66] font-medium mb-3">
          ยินดีต้อนรับเข้าสู่
        </h2>

        {/* ใช้สี Dark Teal เข้มๆ ตาม Design */}
        <h1 className="text-4xl md:text-6xl font-bold text-[#0D3B66] tracking-wide">
          <span>Fear</span>
          <span className="text-primary-dark">Free </span>
          <span>Animals</span>
        </h1>
      </motion.div>
    </div>
  );
}
