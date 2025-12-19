"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useGameStore } from "@/stores/game.store";
import { Animal } from "@/models/game.model"; // ✅ Import จาก model
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function AnimalSelectionPage() {
  const router = useRouter();
  const params = useParams();

  // แปลงและดัก Error
  const categoryId = Number(params.categoryId);

  const {
    categories,
    currentAnimals,
    isLoading,
    error,
    fetchAnimalsByCategory,
    fetchCategories,
  } = useGameStore();

  // หาชื่อหมวดหมู่ปัจจุบันมาโชว์หัวข้อ
  const currentCategoryName =
    categories.find((c) => c.id === categoryId)?.cname || "เลือกสัตว์";

  useEffect(() => {
    if (categoryId && !isNaN(categoryId)) {
      // 1. โหลดรายชื่อสัตว์
      fetchAnimalsByCategory(categoryId);

      // 2. ถ้ายังไม่มี categories ใน store ให้โหลดด้วย (เพื่อเอาชื่อหัวข้อ)
      if (categories.length === 0) {
        fetchCategories();
      }
    }
  }, [categoryId, fetchAnimalsByCategory, fetchCategories, categories.length]);

  const handleSelectAnimal = (animalId: number) => {
    console.log("Selected Animal ID:", animalId);
    router.push(`/game/play/stage/${animalId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-teal-50 to-teal-100">
      <Navbar />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-10 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full text-center"
        >
          {/* หัวข้อหมวดหมู่ */}
          <h1 className="text-4xl font-bold text-[#0D3B66] mb-12">
            {currentCategoryName}
          </h1>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col justify-center items-center h-48">
              <Loader2 className="animate-spin text-[#0D3B66]" size={48} />
              <p className="text-[#0D3B66] mt-4">กำลังโหลดข้อมูลสัตว์...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex flex-col justify-center items-center h-48">
              <AlertCircle className="text-red-500" size={48} />
              <p className="text-red-500 font-bold mt-4">{error}</p>
              <button
                onClick={() => fetchAnimalsByCategory(categoryId)}
                className="mt-4 px-6 py-2 bg-[#0D3B66] text-white rounded-full hover:bg-[#0D3B66]/80"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && currentAnimals.length > 0 && (
            <div className="flex justify-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4 md:px-12">
                {currentAnimals.map((animal) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    onClick={handleSelectAnimal}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && currentAnimals.length === 0 && (
            <p className="text-gray-500 text-lg">
              ไม่พบรายการสัตว์ในหมวดหมู่นี้
            </p>
          )}
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

function AnimalCard({
  animal,
  onClick,
}: {
  animal: Animal;
  onClick: (id: number) => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(animal.id)}
      className="relative aspect-square w-full rounded-[2.5rem] shadow-lg flex items-center justify-center text-center p-6 bg-linear-to-b from-[#d1f0f0] to-[#b3e0e0] border border-white/60 group"
    >
      <span className="text-3xl font-bold text-[#0D3B66] tracking-wide">
        {animal.aname}
      </span>
      {animal.is_recommended && (
        <div className="absolute top-4 right-4 w-10 h-10 bg-[#007bff] rounded-full border-2 border-white flex items-center justify-center shadow-md animate-bounce z-10">
          <span className="text-white font-bold text-lg">B</span>
        </div>
      )}
    </motion.button>
  );
}
