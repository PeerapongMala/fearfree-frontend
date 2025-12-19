"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Mail,
  PawPrint,
  Coins,
  Building,
  Edit,
  ChevronRight,
  LogOut,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar"; // Navbar ของ User ทั่วไป
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, logout } = useAuthStore();
  const { profile, isLoading, fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E6F4F1]">
        <Loader2 className="animate-spin text-[#0D3B66]" size={48} />
      </div>
    );
  }

  // ถ้าโหลดเสร็จแล้วแต่ไม่มีข้อมูล (Error Case)
  if (!profile) return null;

  const isPatient = profile.role === "patient";

  return (
    <div className="min-h-screen bg-linear-to-b from-[#E6F4F1] to-[#CDE8E5] font-sans pb-10">
      {/* 1. Navbar: เลือกใช้ตาม Role ได้ หรือจะใช้ Component เดียวก็ได้ */}
      {/* ถ้าเป็นหมออาจจะอยากได้ Navbar แบบหมอที่มีปุ่ม Dashboard */}
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Title */}
        <h1 className="text-[#0D3B66] font-bold text-3xl text-center mb-8">
          โปรไฟล์
        </h1>

        {/* 2. Profile Card Container */}
        <div className="bg-white rounded-[40px] shadow-lg overflow-hidden">
          {/* --- Top Section: Header Info --- */}
          <div className="p-8 md:p-12 border-b border-gray-100 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#D9886A]/30 p-1">
              <div className="w-full h-full bg-[#D9886A] rounded-full flex items-center justify-center text-white">
                <User size={64} strokeWidth={1.5} />
                {/* หรือใช้ <Image src={profile.avatar_url} ... /> */}
              </div>
            </div>

            {/* Name & Actions */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-[#0D3B66] font-bold text-3xl mb-2">
                {profile.full_name}
              </h2>
              <p className="text-[#0D3B66] text-lg mb-6">{profile.email}</p>

              <button className="bg-[#D9886A] hover:bg-[#c5765a] text-white px-6 py-2 rounded-full font-bold shadow-md transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-2">
                <Edit size={18} /> แก้ไขโปรไฟล์
              </button>
            </div>
          </div>

          {/* --- Bottom Section: Details Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column: Basic Info */}
            <div className="p-8 md:p-12 border-r border-gray-100 space-y-8">
              <h3 className="text-[#0D3B66] font-bold text-xl mb-4">
                ข้อมูลพื้นฐาน
              </h3>

              {/* Name */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0D3B66]">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[#0D3B66] font-bold">
                    {profile.full_name}
                  </p>
                </div>
              </div>

              {/* Age (Patient Only) */}
              {isPatient && profile.age && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0D3B66]">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[#0D3B66] text-sm text-gray-500">
                      {profile.age} ปี
                    </p>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0D3B66]">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[#0D3B66] text-sm text-gray-500">
                    {profile.email}
                  </p>
                </div>
              </div>

              {/* Fear Animal (Patient Only) */}
              {isPatient && profile.most_fear_animal && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0D3B66]">
                    <PawPrint size={20} />
                  </div>
                  <div>
                    <p className="text-[#0D3B66] text-sm text-gray-500">
                      {profile.most_fear_animal}
                    </p>
                  </div>
                </div>
              )}

              {/* Coins (Patient Only) */}
              {isPatient && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <Coins size={20} />
                  </div>
                  <div>
                    <p className="text-[#0D3B66] text-sm text-gray-500">
                      {profile.coins || 0} เหรียญ
                    </p>
                  </div>
                </div>
              )}

              {/* Hospital (Both) */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0D3B66]">
                  <Building size={20} />
                </div>
                <div>
                  <p className="text-[#0D3B66] text-sm text-gray-500">
                    {profile.hospital_name || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Assessment & Menu */}
            <div className="p-8 md:p-12 bg-white">
              {/* Assessment Result (Patient Only) */}
              {isPatient && (
                <div className="mb-10">
                  <h3 className="text-[#0D3B66] font-bold text-xl mb-6">
                    ผลการประเมิน
                  </h3>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-[#0D3B66] font-bold text-sm mb-1">
                        % ความกลัว
                      </p>
                      <p className="text-3xl font-bold text-[#007bff]">
                        {profile.fear_percentage || 0}
                      </p>
                    </div>
                    <div className="h-10 w-[1px] bg-gray-200"></div>
                    <div>
                      <p className="text-[#0D3B66] font-bold text-sm mb-1">
                        ระดับความกลัว
                      </p>
                      <p className="text-[#007bff] bg-blue-50 px-3 py-1 rounded-lg text-sm inline-block">
                        {profile.fear_level_text || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menus */}
              <div className="space-y-4 mt-4">
                {/* Patient Menus */}
                {isPatient && (
                  <>
                    <button className="w-full flex justify-between items-center text-[#0D3B66] hover:text-[#D9886A] transition-colors p-2 hover:bg-gray-50 rounded-lg group">
                      <span className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-[#D9886A]"></div>
                        ประวัติการแลกรางวัล
                      </span>
                      <ChevronRight
                        size={18}
                        className="text-gray-400 group-hover:text-[#D9886A]"
                      />
                    </button>

                    <button className="w-full flex justify-between items-center text-[#0D3B66] hover:text-[#D9886A] transition-colors p-2 hover:bg-gray-50 rounded-lg group">
                      <span className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-[#D9886A]"></div>
                        ประวัติการเล่น
                      </span>
                      <ChevronRight
                        size={18}
                        className="text-gray-400 group-hover:text-[#D9886A]"
                      />
                    </button>
                  </>
                )}

                {/* Common Settings */}
                <button className="w-full flex justify-between items-center text-[#0D3B66] hover:text-[#D9886A] transition-colors p-2 hover:bg-gray-50 rounded-lg group">
                  <span className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-[#D9886A]"></div>
                    การตั้งค่า
                  </span>
                  <ChevronRight
                    size={18}
                    className="text-gray-400 group-hover:text-[#D9886A]"
                  />
                </button>

                {/* Logout (Red) */}
                <button
                  onClick={handleLogout}
                  className="w-full flex justify-between items-center text-red-500 hover:text-red-600 transition-colors p-2 mt-6 hover:bg-red-50 rounded-lg group"
                >
                  <span className="flex items-center gap-3 font-bold">
                    <LogOut size={18} />
                    ออกจากระบบ
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
