"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useUserStore } from "@/stores/user.store";

export default function MyPlayHistoryPage() {
  const router = useRouter();
  const { myPlayHistory, isLoading, fetchMyPlayHistory } = useUserStore();

  useEffect(() => {
    fetchMyPlayHistory();
  }, [fetchMyPlayHistory]);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#E6F4F1] to-[#CDE8E5] font-sans pb-10 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl flex flex-col items-center">
        <h1 className="text-[#0D3B66] font-bold text-3xl mb-8">
          ประวัติการเล่น
        </h1>

        {isLoading ? (
          <div className="flex flex-col items-center mt-10">
            <Loader2 className="animate-spin text-[#0D3B66]" size={48} />
          </div>
        ) : (
          <div className="w-full space-y-4">
            {myPlayHistory.length > 0 ? (
              myPlayHistory.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center h-24 hover:shadow-md transition-shadow"
                >
                  <span className="text-[#0D3B66] font-bold text-xl ml-4">
                    {item.animal_name}
                  </span>
                  <div className="bg-[#D9886A] text-white font-bold text-lg px-8 py-2 rounded-full min-w-[120px] text-center shadow-inner">
                    {item.progress_percent}%
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-10 bg-white/50 rounded-2xl">
                ยังไม่มีประวัติการเล่น
              </div>
            )}
          </div>
        )}
      </main>

      {/* Back Button */}
      <div className="fixed bottom-10 left-10 z-10">
        <button
          onClick={() => router.back()}
          className="p-3 border-2 border-[#0D3B66] rounded-full text-[#0D3B66] hover:bg-[#0D3B66] hover:text-white transition-all bg-transparent backdrop-blur-sm"
        >
          <ArrowLeft size={32} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
