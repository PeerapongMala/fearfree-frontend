"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Clock, Loader2, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useGameStore } from "@/stores/game.store";
import { useAuthStore } from "@/stores/auth.store";
// ✅ Import Interface
import { StageSubmissionResponse } from "@/models/game.model";

// --- [PART 1] Page Wrapper ---
export default function GameplayPage() {
  const params = useParams();
  const animalId = params?.animalId ? Number(params.animalId) : 0;
  const stageNo = params?.stageNo ? Number(params.stageNo) : 0;

  return <GameRunner key={stageNo} animalId={animalId} stageNo={stageNo} />;
}

// --- [PART 2] Game Logic ---
function GameRunner({
  animalId,
  stageNo,
}: {
  animalId: number;
  stageNo: number;
}) {
  const router = useRouter();

  const { user } = useAuthStore();
  const {
    currentStageDetail,
    isLoading,
    fetchGameRules,
    fetchStageDetail,
    submitStage,
    stages,
  } = useGameStore();

  const [gameState, setGameState] = useState<"warning" | "playing">("warning");
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [symptomNote, setSymptomNote] = useState("");
  const [noteError, setNoteError] = useState(false);

  // ✅ [ใหม่] State สำหรับเก็บผลลัพธ์จาก Backend (เหรียญ, ด่านถัดไป)
  const [rewardData, setRewardData] = useState<StageSubmissionResponse | null>(
    null
  );

  const currentStageObj = stages.find((s) => s.stage_no === stageNo);
  const stageId = currentStageObj ? currentStageObj.id : 0;

  const handleExit = () => router.back();

  const handleStartGame = async () => {
    setGameState("playing");
    if (stageId) {
      await Promise.all([fetchGameRules(), fetchStageDetail(stageId)]);
      const rules = useGameStore.getState().gameRules;
      if (rules?.stage_duration_seconds)
        setTimeLeft(rules.stage_duration_seconds);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0 && !isLoading && !showSuccess) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, timeLeft, isLoading, showSuccess]);

  // Submit Result Logic
  const handleSubmit = async () => {
    if (!stageId) {
      alert("ไม่พบข้อมูลด่าน ไม่สามารถบันทึกได้");
      return;
    }

    const isPatient = user?.role === "patient";
    if (isPatient && !symptomNote.trim()) {
      setNoteError(true);
      return;
    }

    // ✅ รับค่า Result ที่เป็น Object กลับมา
    const result = await submitStage(stageId, true, symptomNote);

    if (result && result.success) {
      setRewardData(result); // ✅ บันทึกผลลัพธ์จาก Backend ลง State
      setShowSuccess(true);
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึกผล");
    }
  };

  // ปุ่ม "เสร็จสิ้น" -> เช็คจาก Backend ว่ามีด่านต่อไหม
  const handleFinish = () => {
    // ✅ เช็ค Logic ด่านถัดไปจาก Backend Response
    if (rewardData?.next_stage && rewardData.next_stage.has_next) {
      // ถ้า Backend บอกว่ามีด่านต่อ และส่งเลขด่านมา -> ไปด่านนั้นเลย
      router.push(
        `/game/play/run/${animalId}/${rewardData.next_stage.stage_no}`
      );
    } else {
      // ถ้าไม่มี (จบเกม หรือ Backend ไม่ได้ส่งมา) -> กลับหน้าเลือกด่าน
      router.push(`/game/play/stage/${animalId}`);
    }
  };

  // --- VIEW 1: WARNING ---
  if (gameState === "warning") {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6F4F1] font-sans relative overflow-hidden">
        <Navbar />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-24 right-10 md:right-32 text-[#88C0D0]/40 pointer-events-none">
          <Plus size={100} strokeWidth={5} />
          <Plus
            size={50}
            strokeWidth={5}
            className="absolute top-20 -right-8 opacity-60"
          />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl w-full text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[#E09176] mb-6">
              คำเตือนทางการแพทย์
            </h1>
            <div className="text-[#0D3B66] text-lg md:text-xl font-medium leading-relaxed mb-10 space-y-1">
              <p>
                เนื้อหานี้อาจมีภาพ เสียง
                หรือสถานการณ์ที่อาจกระตุ้นให้เกิดความวิตกกังวล
              </p>
              <p className="font-bold text-xl">
                โปรดหยุดกิจกรรมทันที หากมีอาการผิดปกติ
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#E09176] mb-6">
              คำแนะนำ
            </h2>
            <div className="text-[#0D3B66] text-lg md:text-xl font-bold leading-relaxed mb-12">
              <p>
                1. หายใจเข้าลึก ๆ ... 2. หายใจออกช้า ๆ ... 3. ทำซ้ำจนผ่อนคลาย
              </p>
            </div>
            <div className="flex justify-center gap-6 md:gap-8">
              <button
                onClick={handleExit}
                className="bg-[#D9886A] text-white text-xl font-bold py-3 px-16 rounded-full shadow-lg hover:scale-105"
              >
                ออก
              </button>
              <button
                onClick={handleStartGame}
                className="bg-[#0D3B66] text-white text-xl font-bold py-3 px-16 rounded-full shadow-lg hover:scale-105"
              >
                ต่อไป
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // --- VIEW 2: PLAYING ---
  return (
    <div className="min-h-screen flex flex-col bg-[#E6F4F1] font-sans relative">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="w-full max-w-5xl border-2 border-dashed border-[#88C0D0] rounded-3xl p-6 md:p-10 relative bg-white/30 backdrop-blur-sm transition-all">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-[#0D3B66]">
              Level {stageNo}
            </h1>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Clock className="text-[#0D3B66]" />
              <span className="text-2xl font-bold text-[#0D3B66]">
                {timeLeft}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-md flex items-center justify-center min-h-[300px] md:min-h-[360px] relative mb-6">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-[#0D3B66]" size={48} />
                <p className="text-[#0D3B66]">กำลังโหลดรูปภาพ...</p>
              </div>
            ) : currentStageDetail ? (
              <div className="relative w-full h-[250px] md:h-[350px]">
                <Image
                  src={
                    currentStageDetail.media_url ||
                    "https://placehold.co/600x400?text=Snake"
                  }
                  alt="Stage Media"
                  fill
                  className="object-contain rounded-xl blur-sm transition-all duration-1000 hover:blur-none"
                  unoptimized
                />
              </div>
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <p>ไม่พบข้อมูลรูปภาพ (Mock Mode)</p>
                {stageId === 0 && (
                  <p className="text-xs mt-2 text-red-400">
                    *ไม่พบข้อมูล Stage ID
                  </p>
                )}
              </div>
            )}
            <div className="absolute top-6 right-6 w-10 h-10 bg-[#007bff] rounded-full border-2 border-white flex items-center justify-center shadow-md z-10">
              <span className="text-white font-bold text-lg">B</span>
            </div>
          </div>

          {user?.role === "patient" && (
            <div className="mb-6">
              <label className="block text-[#0D3B66] font-bold text-lg mb-2 pl-2">
                บันทึกอาการขณะทดสอบ <span className="text-red-500">*</span>
              </label>
              <textarea
                value={symptomNote}
                onChange={(e) => {
                  setSymptomNote(e.target.value);
                  setNoteError(false);
                }}
                placeholder="พิมพ์ได้ที่นี่..."
                className={`w-full p-4 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all resize-none h-24 text-gray-700
                        ${
                          noteError
                            ? "border-red-400 focus:ring-red-200 bg-red-50"
                            : "border-[#88C0D0]/50 focus:border-[#0D3B66] focus:ring-[#0D3B66]/20 bg-white/80"
                        }
                    `}
              />
              {noteError && (
                <p className="text-red-500 text-sm mt-1 pl-2 font-bold">
                  * จำเป็นต้องระบุข้อมูลก่อนทำรายการต่อ
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between mt-4 px-4">
            <button
              onClick={handleExit}
              className="bg-[#D9886A] hover:bg-[#c5765a] text-white text-xl font-bold py-3 px-12 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              ออก
            </button>

            <button
              onClick={handleSubmit}
              className={`text-white text-xl font-bold py-3 px-12 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95
                ${
                  user?.role === "patient" && !symptomNote.trim()
                    ? "bg-gray-400 cursor-not-allowed opacity-80"
                    : "bg-[#0D3B66] hover:bg-[#0a2e4f]"
                }
              `}
            >
              ต่อไป
            </button>
          </div>
        </div>

        {/* SUCCESS MODAL */}
        <AnimatePresence>
          {showSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#E6F4F1]/90 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center relative z-10 border border-white/50"
              >
                <h2 className="text-3xl font-bold text-[#0D3B66] mb-8">
                  ยินดีด้วย
                </h2>

                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 bg-[#FCD34D] rounded-full flex items-center justify-center shadow-inner border-4 border-[#FBBF24]">
                    <Star size={64} className="text-white fill-current" />
                  </div>
                </div>

                <p className="text-[#0D3B66] text-xl font-bold mb-8">
                  {/* ✅ ใช้ข้อมูลจริงจาก Backend */}
                  คุณได้รับ {rewardData?.earned_coins || 0} คอยน์
                  <br />
                  เพื่อนำไปแลกรางวัล
                </p>

                <button
                  onClick={handleFinish}
                  className="bg-[#0D3B66] hover:bg-[#0a2e4f] text-white text-xl font-bold py-3 px-12 rounded-full shadow-lg w-full transition-transform hover:scale-105 active:scale-95"
                >
                  เสร็จสิ้น
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
