"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/shared/components/Navbar";
import { AssessmentStepper, useAssessmentStore } from "@/features/assessment";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function AssessmentResultPage() {
  const router = useRouter();

  // ดึงผลลัพธ์จาก Store (ที่ Backend คำนวณส่งมาให้)
  const { result } = useAssessmentStore();

  // ถ้าไม่มีผลลัพธ์ (เช่น refresh หน้า) แสดงข้อความแทนการ redirect ที่อาจวนลูป
  if (!result) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-b from-teal-50 to-teal-100">
        <Navbar />
        <main className="flex-1 container max-w-5xl mx-auto px-4 py-10 flex flex-col items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-8 md:p-12 border border-[#0D3B66]/20 text-center">
            <h2 className="text-2xl font-bold text-[#0D3B66] mb-4">
              ไม่พบผลการประเมิน
            </h2>
            <p className="text-gray-600 mb-6">กรุณาทำแบบประเมินใหม่อีกครั้ง</p>
            <button
              onClick={() => router.push("/assessment")}
              className="bg-[#D9886A] hover:bg-[#c5765a] text-white text-lg font-bold py-3 px-10 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              กลับไปทำแบบประเมิน
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-teal-50 to-teal-100">
      <Navbar />

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-10 flex flex-col items-center">
        {/* Step 3: ผลสรุป */}
        <AssessmentStepper currentStep={3} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl mt-4 text-center"
        >
          <h1 className="text-3xl font-bold text-[#0D3B66] mb-8">
            ผลการประเมิน
          </h1>

          {/* Card ผลลัพธ์ */}
          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-8 md:p-12 border border-[#0D3B66]/20 relative overflow-hidden">
            {/* Decoration พื้นหลังในการ์ด */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#0D3B66]" />

            <div className="space-y-6 text-[#0D3B66]">
              {/* ระดับความกลัว */}
              <div className="text-xl md:text-2xl">
                <span className="font-bold">ระดับความกลัว: </span>
                <span className="text-[#D9886A] font-extrabold">
                  {result.fear_level}
                </span>
              </div>

              {/* เปอร์เซ็นต์ */}
              <div className="text-xl md:text-2xl">
                <span className="font-bold">เปอร์เซ็นความกลัว: </span>
                <span className="font-medium">{result.percent}%</span>
              </div>

              {/* เส้นคั่น */}
              <hr className="border-gray-200 my-4" />

              {/* คำอธิบาย */}
              <p className="text-lg leading-relaxed text-gray-700">
                {result.description}
              </p>
            </div>

            {/* ปุ่มเริ่มทดสอบ (ไปหน้า Game) */}
            <div className="mt-10">
              <button
                onClick={() => router.push("/game/categories")} // ไปหน้าเริ่มเกม (แก้ path ตามจริง)
                className="bg-[#D9886A] hover:bg-[#c5765a] text-white text-xl font-bold py-3 px-16 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                เริ่มทดสอบ
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => router.back()}
        className="fixed bottom-10 left-10 p-3 border-2 border-[#0D3B66] rounded-full text-[#0D3B66] hover:bg-[#0D3B66] hover:text-white transition-all bg-white/80 backdrop-blur-sm shadow-md"
      >
        <ArrowLeft size={32} strokeWidth={2} />
      </button>
    </div>
  );
}
