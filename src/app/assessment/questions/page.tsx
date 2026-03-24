"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AssessmentStepper from "@/components/AssessmentStepper";
import { useAssessmentStore } from "@/stores/assessment.store";
import { useAuthStore } from "@/stores/auth.store"; // ดึง user id
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function AssessmentQuestionsPage() {
  const router = useRouter();

  // เรียก Store
  const { user } = useAuthStore();
  const {
    questions,
    answers,
    isLoading,
    error,
    fetchQuestions,
    setAnswer,
    submitAnswers,
  } = useAssessmentStore();

  // โหลดคำถามทันทีที่เข้าหน้านี้ (ยิง API จริง)
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSubmit = async () => {
    if (!user) {
      alert("ไม่พบข้อมูลผู้ใช้ กรุณา Login ใหม่");
      return;
    }

    const success = await submitAnswers(user.id);
    if (success) {
      // ไม่ต้องส่ง query param แล้ว เพราะผลลัพธ์อยู่ใน store
      router.push("/assessment/result");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-teal-50 to-teal-100">
      <Navbar />

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-10 flex flex-col items-center">
        {/* Stepper: Step 2 */}
        <AssessmentStepper currentStep={2} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mt-4"
        >
          <h1 className="text-3xl font-bold text-[#0D3B66] mb-8 text-center">
            ประเมินระดับความกลัว
          </h1>

          {/* กรณี 1: กำลังโหลด (รอ API) */}
          {isLoading && (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Loader2 className="animate-spin text-[#0D3B66]" size={48} />
              <p className="text-[#0D3B66]">กำลังโหลดคำถามจากระบบ...</p>
            </div>
          )}

          {/* กรณี 2: เกิด Error (เช่น ลืมเปิด Backend) */}
          {error && !isLoading && (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle className="text-red-500" size={48} />
              </div>
              <p className="text-red-500 font-bold text-lg">{error}</p>
              <button
                onClick={() => fetchQuestions()}
                className="px-6 py-2 bg-[#0D3B66] text-white rounded-full hover:bg-[#0D3B66]/80"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {/* กรณี 3: โหลดเสร็จแล้ว มีคำถาม */}
          {!isLoading && !error && questions.length > 0 && (
            <div className="space-y-3">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl px-5 py-4 shadow-sm border border-white/50"
                >
                  {/* คำถาม */}
                  <p className="text-[#0D3B66] font-medium text-sm mb-3 leading-relaxed">
                    {index + 1}. {q.prompt}
                  </p>

                  {/* Slider */}
                  <div className="px-1 pt-8">
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={answers[q.id] ?? 5}
                        onChange={(e) => setAnswer(q.id, Number(e.target.value))}
                        className="assessment-slider w-full"
                      />
                      {/* แต้มคะแนน (ลอยตาม thumb) */}
                      <div
                        className="absolute -top-8 text-[#D9886A] font-bold text-sm pointer-events-none select-none bg-white/80 px-1.5 py-0.5 rounded-md shadow-sm"
                        style={{
                          left: `calc(${((answers[q.id] ?? 5) / 10) * 100}% - 12px)`,
                        }}
                      >
                        {answers[q.id] ?? 5}
                      </div>
                    </div>

                    {/* Labels */}
                    <div className="flex justify-between text-xs font-medium text-[#0D3B66]/60 mt-1.5">
                      <span>น้อย</span>
                      <span>ปานกลาง</span>
                      <span>มาก</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ปุ่มเสร็จสิ้น */}
          {!isLoading && !error && questions.length > 0 && (
            <div className="mt-12 flex justify-center pb-20">
              <button
                onClick={handleSubmit}
                className="bg-[#D9886A] hover:bg-[#c5765a] text-white text-xl font-bold py-3 px-16 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                เสร็จสิ้น
              </button>
            </div>
          )}
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
