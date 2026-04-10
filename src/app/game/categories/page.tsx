"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useGameStore } from "@/stores/game.store";
import { GameCategory } from "@/models/game.model";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function CategoriesPage() {
  const router = useRouter();
  const { categories, isLoading, error, fetchCategories } = useGameStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSelectCategory = (id: number) => {
    // ส่ง id ไปหน้าเล่นเกม (เช่น /game/play/1)
    // Backend จะได้เอา ID ไป Query ตาราง animal ต่อได้ง่ายๆ
    router.push(`/game/play/${id}`);
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
          <h1 className="text-4xl font-bold text-[#0D3B66] mb-12">เล่นเกม</h1>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col justify-center items-center h-48">
              <Loader2 className="animate-spin text-[#0D3B66]" size={48} />
              <p className="text-[#0D3B66] mt-4">
                กำลังโหลดข้อมูลจากฐานข้อมูล...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex flex-col justify-center items-center h-48">
              <AlertCircle className="text-red-500" size={48} />
              <p className="text-red-500 font-bold mt-4">{error}</p>
              <button
                onClick={() => fetchCategories()}
                className="mt-4 px-6 py-2 bg-[#0D3B66] text-white rounded-full hover:bg-[#0D3B66]/80"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && categories.length > 0 && (
            <div className="flex flex-col items-center gap-8">
              {/* Layout Logic: ถ้ามี 5 ตัว จัด 3-2 ตามดีไซน์ */}
              {categories.length === 5 ? (
                <>
                  {/* แถวบน 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    {categories.slice(0, 3).map((cat) => (
                      <CategoryCard
                        key={cat.id}
                        category={cat}
                        onClick={handleSelectCategory}
                      />
                    ))}
                  </div>
                  {/* แถวล่าง 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                    {categories.slice(3, 5).map((cat) => (
                      <CategoryCard
                        key={cat.id}
                        category={cat}
                        onClick={handleSelectCategory}
                      />
                    ))}
                  </div>
                </>
              ) : (
                // Fallback Layout
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl justify-center">
                  {categories.map((cat) => (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      onClick={handleSelectCategory}
                    />
                  ))}
                </div>
              )}
            </div>
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

// --- Card Component ---
function CategoryCard({
  category,
  onClick,
}: {
  category: GameCategory;
  onClick: (id: number) => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(category.id)}
      className="relative h-40 md:h-48 rounded-4xl shadow-lg flex items-center justify-center text-center p-4 bg-linear-to-b from-[#d1f0f0] to-[#b3e0e0] border border-white/50 group w-full"
    >
      {/* ใช้ field cname จาก DB */}
      <span className="text-2xl md:text-3xl font-bold text-[#0D3B66] whitespace-pre-line leading-relaxed">
        {category.name}
      </span>

      {/* Badge placeholder — add is_recommended to backend model to enable */}
    </motion.button>
  );
}
