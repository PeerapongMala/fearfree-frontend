"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useUserStore } from "@/stores/user.store";

export default function RedemptionHistoryPage() {
  const router = useRouter();
  const { redemptionHistory, isLoading, fetchRedemptionHistory } =
    useUserStore();

  useEffect(() => {
    fetchRedemptionHistory();
  }, [fetchRedemptionHistory]);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#E6F4F1] to-[#CDE8E5] font-sans pb-10 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl flex flex-col items-center">
        <h1 className="text-[#0D3B66] font-bold text-3xl mb-8">
          ประวัติการแลกรางวัล
        </h1>

        {isLoading ? (
          <div className="flex flex-col items-center mt-10">
            <Loader2 className="animate-spin text-[#0D3B66]" size={48} />
          </div>
        ) : (
          <div className="bg-white rounded-[30px] p-6 md:p-8 shadow-lg w-full min-h-[400px] relative">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 md:gap-4 border-b border-gray-100 pb-4 mb-4 text-[#0D3B66] font-bold text-xs md:text-base">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">วันที่เริ่ม</div>
              <div className="col-span-4">รางวัล</div>
              <div className="col-span-2 text-center">จำนวนเหรียญ</div>
              <div className="col-span-2 text-center">สถานะ</div>
            </div>

            {/* Table Body */}
            <div className="space-y-2">
              {redemptionHistory.length > 0 ? (
                redemptionHistory.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 md:gap-4 items-center text-[#0D3B66] text-xs md:text-base py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-2"
                  >
                    <div className="col-span-1 text-center font-bold">
                      {index + 1}
                    </div>
                    <div className="col-span-3">{item.date}</div>
                    <div className="col-span-4 font-medium truncate">
                      {item.reward_name}
                    </div>
                    <div className="col-span-2 text-center">
                      {item.coins_used}
                    </div>
                    <div className="col-span-2 text-center font-bold text-green-500">
                      {item.status === "success" ? "สำเร็จ" : item.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-10">
                  ยังไม่มีประวัติการแลกรางวัล
                </div>
              )}
            </div>

            {/* Pagination (Mock UI) */}
            <div className="absolute bottom-6 right-8 flex items-center gap-2">
              <button className="p-1 hover:bg-gray-100 rounded text-[#0D3B66]">
                <ChevronLeft size={20} />
              </button>
              <div className="w-8 h-8 bg-[#D9886A] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                1
              </div>
              <button className="p-1 hover:bg-gray-100 rounded text-[#0D3B66]">
                <ChevronRight size={20} />
              </button>
            </div>
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
