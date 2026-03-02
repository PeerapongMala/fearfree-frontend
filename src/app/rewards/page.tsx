"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Star, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useUserStore } from "@/stores/user.store";
import { useRewardStore } from "@/stores/reward.store";

export default function RewardsPage() {
  const router = useRouter();

  // ใช้ profile เพื่อดูเหรียญของฉัน
  const { profile, fetchProfile } = useUserStore();

  // ใช้ reward store เพื่อดึงของรางวัลและแลก
  const { rewards, isLoading, fetchRewards, redeemReward } = useRewardStore();

  useEffect(() => {
    fetchProfile(); // โหลดเหรียญล่าสุด
    fetchRewards(); // โหลดรายการของรางวัล
  }, [fetchProfile, fetchRewards]);

  const handleRedeem = async (rewardId: number, cost: number) => {
    if (!profile) return;

    // เช็คเหรียญก่อนแลก
    if ((profile.coins || 0) < cost) {
      alert("เหรียญของคุณไม่เพียงพอ!");
      return;
    }

    if (confirm("ยืนยันการแลกรางวัลนี้?")) {
      const success = await redeemReward(rewardId);
      if (success) {
        alert("แลกรางวัลสำเร็จ!");
        // เหรียญจะถูกอัปเดตอัตโนมัติเพราะใน Store เราสั่ง fetchProfile() ไว้แล้ว
      } else {
        alert("เกิดข้อผิดพลาดในการแลกรางวัล");
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#E6F4F1] to-[#CDE8E5] font-sans pb-10 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl flex flex-col items-center">
        <h1 className="text-[#0D3B66] font-bold text-3xl mb-8">แลกของรางวัล</h1>

        {isLoading ? (
          <Loader2 className="animate-spin text-[#0D3B66] mt-10" size={48} />
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* --- LEFT SIDE: Coin Balance Card --- */}
            {/* สีส้มตามรูป #D9886A */}
            <div className="md:col-span-4 bg-[#D9886A] rounded-[30px] p-8 text-white flex flex-col items-center justify-center text-center shadow-lg relative min-h-[300px] md:min-h-[400px]">
              <h2 className="text-2xl font-bold mb-6">คอยน์ของฉัน</h2>

              {/* Coin Icon Circle */}
              <div className="w-32 h-32 bg-[#FCD34D] rounded-full flex items-center justify-center shadow-inner border-4 border-[#FBBF24] mb-6">
                <Star size={64} className="text-white fill-current" />
              </div>

              <p className="text-3xl font-bold mb-10">
                {profile?.coins || 0} คอยน์
              </p>

              {/* Back Button (In Card) */}
              <button
                onClick={() => router.back()}
                className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[#D9886A] transition-colors"
              >
                <ArrowLeft size={24} strokeWidth={3} />
              </button>
            </div>

            {/* --- RIGHT SIDE: Rewards List --- */}
            <div className="md:col-span-8 flex flex-col gap-4">
              {rewards.length > 0 ? (
                rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="bg-[#0D3B66] rounded-2xl p-4 flex items-center justify-between shadow-md text-white"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 shrink-0 bg-white rounded-xl overflow-hidden border-2 border-white/20">
                      <Image
                        src={reward.image_url}
                        alt={reward.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Description */}
                    <div className="flex-1 px-6">
                      <h3 className="text-lg md:text-xl font-bold">
                        {reward.name}
                      </h3>
                    </div>

                    {/* Price & Button */}
                    <div className="flex flex-col md:flex-row items-center gap-4 text-right">
                      <span className="text-sm md:text-base font-medium whitespace-nowrap">
                        {reward.cost_coins} คอยน์
                      </span>
                      <button
                        onClick={() => handleRedeem(reward.id, reward.cost_coins)}
                        className="bg-[#D9886A] hover:bg-[#c5765a] text-white px-6 py-2 rounded-full font-bold shadow-md transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
                      >
                        แลก
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-10">
                  ไม่พบของรางวัล
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
