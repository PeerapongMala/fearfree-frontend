"use client";

import { useEffect, useState } from "react";
import { Users, Package, Gamepad2, TrendingUp } from "lucide-react";
import { adminService } from "@/services/admin.service";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRewards: 0,
    activeRewards: 0,
    // Add more stats here later like users, animals etc.
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getRewards();
        const rewards = res.data || [];
        setStats({
          totalRewards: rewards.length,
          activeRewards: rewards.filter((r) => r.stock > 0).length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-50 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 right-20 w-32 h-32 bg-orange-50 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <h1 className="text-[#0D3B66] font-bold text-3xl mb-2">
            ยินดีต้อนรับสู่ระบบจัดการ (Admin Panel)
          </h1>
          <p className="text-gray-500">
            ดูภาพรวม จัดการข้อมูลเกม และของรางวัลสำหรับผู้ป่วย
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">ผู้ป่วยทั้งหมด</p>
            <h3 className="text-2xl font-bold text-[#0D3B66]">-</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">ของรางวัล</p>
            <h3 className="text-2xl font-bold text-[#0D3B66]">
              {stats.totalRewards} รายการ
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-teal-50 text-teal-600 rounded-xl">
            <Gamepad2 size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">เกมทั้งหมด</p>
            <h3 className="text-2xl font-bold text-[#0D3B66]">-</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">การแลกของรางวัล</p>
            <h3 className="text-2xl font-bold text-[#0D3B66]">-</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/rewards"
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex items-start gap-6 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="p-4 bg-orange-100 text-[#D9886A] rounded-2xl shadow-sm">
            <Package size={32} />
          </div>
          <div>
            <h2 className="text-[#0D3B66] font-bold text-xl mb-2 group-hover:text-[#D9886A] transition-colors">
              จัดการของรางวัล
            </h2>
            <p className="text-gray-500 text-sm">
              เพิ่ม ลบ หรือแก้ไขจำนวนสต็อกของรางวัลในระบบ
            </p>
          </div>
        </Link>

        <Link
          href="/admin/games"
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex items-start gap-6 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="p-4 bg-[#E6F4F1] text-teal-600 rounded-2xl shadow-sm">
            <Gamepad2 size={32} />
          </div>
          <div>
            <h2 className="text-[#0D3B66] font-bold text-xl mb-2 group-hover:text-teal-600 transition-colors">
              จัดการด่านรูปภาพ-วิดีโอ
            </h2>
            <p className="text-gray-500 text-sm">
              ตั้งค่าสัตว์ ด่าน และเนื้อหาวิดีโอที่ใช้บำบัด
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
