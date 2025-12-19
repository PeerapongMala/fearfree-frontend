"use client";

import { FileEdit, SlidersHorizontal, ClipboardList } from "lucide-react";
import { cn } from "@/utils/cn";

interface AssessmentStepperProps {
  currentStep: 1 | 2 | 3;
}

export default function AssessmentStepper({
  currentStep,
}: AssessmentStepperProps) {
  const steps = [
    { id: 1, label: "กรอกข้อมูล", icon: FileEdit },
    { id: 2, label: "ประเมินระดับความกลัว", icon: SlidersHorizontal },
    { id: 3, label: "ผลสรุป", icon: ClipboardList },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-12 px-4">
      {/* ใช้ relative เพื่อให้เส้น absolute อิงกับกล่องนี้ */}
      <div className="relative flex items-center justify-between">
        {/* --- 1. เส้นพื้นหลัง (สีเทา) --- */}
        {/* แก้: เอา -z-10 ออก เปลี่ยนเป็น z-0 เพื่อไม่ให้จมหายไปหลัง Background Page */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2 z-0" />

        {/* --- 2. เส้นสีเข้ม (Active Line) --- */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-[#0D3B66] -translate-y-1/2 z-0 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* --- 3. จุด Steps --- */}
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            // แก้: ใส่ relative z-10 เพื่อให้ Icon ลอยทับเส้น
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center bg-transparent"
            >
              {/* กล่อง Icon (สี่เหลี่ยมมน) */}
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300",
                  // สำคัญ: ต้องมี bg-white (หรือสีพื้น) เพื่อบังเส้นที่พาดผ่านข้างหลัง
                  isActive
                    ? "bg-[#0D3B66] border-[#0D3B66] text-white shadow-lg"
                    : isCompleted
                    ? "bg-white border-[#0D3B66] text-[#0D3B66]"
                    : "bg-white border-gray-300 text-gray-400"
                )}
              >
                <step.icon size={28} strokeWidth={2} />
              </div>

              {/* Label */}
              <span
                className={cn(
                  "mt-3 text-base font-medium transition-colors duration-300 absolute -bottom-8 w-40 text-center",
                  isActive || isCompleted ? "text-[#0D3B66]" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Spacer กันทับเนื้อหาด้านล่าง */}
      <div className="h-8" />
    </div>
  );
}
