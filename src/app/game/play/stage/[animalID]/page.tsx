"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useGameStore } from "@/stores/game.store";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Lock } from "lucide-react";

export default function StageSelectionPage() {
  const router = useRouter();
  const params = useParams();

  // แปลงและดัก Error
  const animalId = Number(params.animalID);

  const { selectedAnimal, stages, isLoading, error, fetchAnimalAndStages } =
    useGameStore();

  useEffect(() => {
    if (animalId && !isNaN(animalId)) {
      fetchAnimalAndStages(animalId);
    }
  }, [animalId, fetchAnimalAndStages]);

  const handleSelectStage = (stageNo: number, isLocked: boolean) => {
    if (isLocked) return;

    // ไปหน้า Gameplay (Run)
    router.push(`/game/play/run/${animalId}/${stageNo}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-teal-50 to-teal-100">
      <Navbar />

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-10 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-[#0D3B66]" size={48} />
            <p className="mt-4 text-[#0D3B66]">กำลังโหลดข้อมูลด่าน...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 font-bold">{error}</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full text-center"
          >
            {/* 1. ชื่อสัตว์ */}
            <div className="relative inline-block mb-12">
              <div className="bg-[#D1E8E8] text-[#0D3B66] text-3xl md:text-4xl font-bold px-16 py-4 rounded-3xl shadow-sm border border-white/50">
                {selectedAnimal?.aname || "กำลังโหลด..."}
              </div>

              {selectedAnimal?.is_recommended && (
                <div className="absolute -top-2 -right-6 w-10 h-10 bg-[#007bff] rounded-full border-2 border-white flex items-center justify-center shadow-md animate-bounce">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
              )}
            </div>

            {/* 2. Grid ด่าน 1-10 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto px-4">
              {stages.map((stage) => (
                <motion.button
                  key={stage.stage_no}
                  whileHover={!stage.is_locked ? { scale: 1.05 } : {}}
                  whileTap={!stage.is_locked ? { scale: 0.95 } : {}}
                  onClick={() =>
                    handleSelectStage(stage.stage_no, stage.is_locked)
                  }
                  disabled={stage.is_locked}
                  className={`
                    aspect-square rounded-3xl shadow-md flex items-center justify-center text-4xl font-bold transition-all
                    ${
                      stage.is_locked
                        ? "bg-[#3A7580] text-white/50 cursor-not-allowed border border-[#2C5D66]"
                        : "bg-[#4A919E] text-white hover:bg-[#3d7a85] border border-white/30 cursor-pointer"
                    }
                    `}
                >
                  {stage.is_locked ? (
                    <Lock size={40} strokeWidth={2.5} className="opacity-60" />
                  ) : (
                    stage.stage_no
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
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
