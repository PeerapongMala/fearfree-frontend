"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/shared/components/Navbar";
import { AssessmentStepper } from "@/features/assessment";
import { userService } from "@/features/user";
import { useAuthStore } from "@/features/auth";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button, Input } from "@/shared/components/ui";

export default function AssessmentPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    age: "",
    fearedAnimal: "",
  });

  // --- 1. ดัก Input อายุ (ตัวเลขเท่านั้น) ---
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // ลบทุกอย่างที่ไม่ใช่ตัวเลข 0-9 ออก (กัน - . e)
    value = value.replace(/\D/g, "");

    // กันไม่ให้พิมพ์เกิน 3 หลัก
    if (value.length > 3) return;

    setFormData({ ...formData, age: value });
    setError("");
  };

  // --- 2. ดัก Input สัตว์ (ห้ามตัวเลข) ---
  const handleAnimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Regex: ยอมรับแค่ ก-๙ (ไทย), a-z, A-Z (อังกฤษ) และ \s (เว้นวรรค)
    // ถ้ามีตัวเลข (0-9) หรือสัญลักษณ์แปลกๆ เข้ามา จะไม่ผ่านเงื่อนไขนี้ -> พิมพ์ไม่ติด
    if (/^[ก-๙a-zA-Z\s]*$/.test(value)) {
      setFormData({ ...formData, fearedAnimal: value });
      setError("");
    }
  };

  const handleNext = async () => {
    setError("");
    const ageNum = parseInt(formData.age.trim(), 10);

    // เช็คค่าว่าง
    if (!formData.age.trim() || !formData.fearedAnimal.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // --- ดัก Logic อายุ ---
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
      setError("กรุณาระบุอายุที่ถูกต้อง (ระหว่าง 5 - 120 ปี)");
      return;
    }

    // --- ดัก Logic สัตว์ ---
    if (formData.fearedAnimal.trim().length < 2) {
      setError("ชื่อสัตว์ต้องมีความยาวอย่างน้อย 2 ตัวอักษร");
      return;
    }

    // ผ่านหมด ไปหน้าถัดไป พร้อมอัปเดตข้อมูล
    try {
      await userService.updateProfile({
        full_name: user?.full_name || "",
        age: ageNum,
        most_fear_animal: formData.fearedAnimal,
      });
      router.push("/assessment/questions");
    } catch (err: unknown) {
      setError("ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง");
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-teal-50 to-teal-100">
      <Navbar />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10 flex flex-col items-center">
        <AssessmentStepper currentStep={1} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mt-4 text-center"
        >
          <h1 className="text-3xl font-bold text-[#0D3B66] mb-8">กรอกข้อมูล</h1>

          <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-6 text-left items-end">
            {/* --- ช่องอายุ --- */}
            <div className="space-y-2 w-full">
              <label className="text-[#0D3B66] font-bold text-lg pl-1 block">
                อายุ
              </label>
              <Input
                type="text"
                inputMode="numeric"
                error={
                  !!error &&
                  (formData.age === "" ||
                    parseInt(formData.age) < 5 ||
                    parseInt(formData.age) > 120)
                }
                className="text-lg shadow-sm"
                value={formData.age}
                onChange={handleAgeChange}
              />
            </div>
            <div className="pb-3">
              <span className="text-[#0D3B66] font-bold text-lg whitespace-nowrap">
                ปี
              </span>
            </div>

            {/* --- ช่องสัตว์ที่กลัว --- */}
            <div className="space-y-2 w-full">
              <label className="text-[#0D3B66] font-bold text-lg pl-1 block">
                กลัวสัตว์อะไรมากที่สุด
              </label>
              <Input
                type="text"
                placeholder="ระบุชื่อสัตว์ (ภาษาไทยหรืออังกฤษ)"
                error={!!error && !formData.fearedAnimal}
                className="text-lg shadow-sm"
                value={formData.fearedAnimal}
                onChange={handleAnimalChange}
              />
            </div>
            <div></div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-red-500 font-bold mt-6 bg-red-50 p-3 rounded-lg border border-red-100"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="mt-8 flex justify-center">
            <Button size="lg" pill onClick={handleNext}>
              เสร็จสิ้น
            </Button>
          </div>
        </motion.div>
      </main>

      <button
        onClick={() => router.back()}
        className="fixed bottom-10 left-10 p-3 border-2 border-[#0D3B66] rounded-full text-[#0D3B66] hover:bg-[#0D3B66] hover:text-white transition-all bg-transparent"
      >
        <ArrowLeft size={32} strokeWidth={2} />
      </button>
    </div>
  );
}
