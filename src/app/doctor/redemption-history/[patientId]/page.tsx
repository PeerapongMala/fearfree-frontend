"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, LogOut, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useDoctorStore } from "@/stores/doctor.store";

export default function DoctorRedemptionHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.patientId ? Number(params.patientId) : 0;

  const { logout } = useAuthStore();
  const {
    selectedPatient,
    currentRedemptions,
    isLoading,
    fetchPatientRedemptions,
  } = useDoctorStore();

  useEffect(() => {
    if (patientId) {
      fetchPatientRedemptions(patientId);
    }
  }, [patientId, fetchPatientRedemptions]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#E6F4F1] to-[#CDE8E5] font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="text-[#0D3B66] font-bold text-2xl flex items-center gap-2">
            <span className="text-3xl">Ψ</span> FearFree Animals
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-[#0D3B66] font-bold text-lg hover:text-[#D9886A] transition-colors flex items-center gap-2"
        >
          ออกจากระบบ <LogOut size={20} />
        </button>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl flex flex-col items-center">
        <h1 className="text-[#0D3B66] font-bold text-3xl mb-8">
          ประวัติการแลกรางวัล
        </h1>

        {isLoading ? (
          <div className="flex flex-col items-center mt-20">
            <Loader2 className="animate-spin text-[#0D3B66]" size={48} />
            <p className="text-[#0D3B66] mt-4">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <div className="w-full">
            {/* Patient Info Header */}
            <div className="text-left mb-6 ml-4">
              <span className="text-black font-bold text-lg">ผู้ป่วย </span>
              <span className="text-black text-lg ml-2">
                {selectedPatient
                  ? `${selectedPatient.code_patient} ${selectedPatient.full_name}`
                  : "ไม่พบข้อมูลผู้ป่วย"}
              </span>
            </div>

            {/* Redemptions Table Card */}
            <div className="bg-white rounded-3xl p-8 shadow-md relative min-h-[400px]">
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-500 text-sm border-b border-gray-100">
                      <th className="p-4 font-normal">#</th>
                      <th className="p-4 font-normal">วันที่เริ่ม</th>
                      <th className="p-4 font-normal">รางวัล</th>
                      <th className="p-4 font-normal">จำนวนเหรียญ</th>
                      <th className="p-4 font-normal">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#0D3B66]">
                    {currentRedemptions.map((r, index) => (
                      <tr
                        key={r.id}
                        className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4 font-medium">{r.date}</td>
                        <td className="p-4">{r.reward_name}</td>
                        <td className="p-4">{r.coins_used}</td>
                        <td className={`p-4 font-bold ${r.status === 'success' ? 'text-green-500' : r.status === 'pending' ? 'text-yellow-500' : 'text-gray-500'}`}>
                          {r.status === 'success' ? 'สำเร็จ' : r.status === 'pending' ? 'รอดำเนินการ' : r.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {currentRedemptions.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    ไม่พบประวัติการแลกรางวัล
                  </div>
                )}
              </div>

              {/* Pagination (Mock) */}
              <div className="flex justify-end items-center gap-4 mt-8 text-gray-500">
                <button className="p-2 hover:text-[#0D3B66]">
                  <ChevronLeft />
                </button>
                <div className="w-8 h-8 bg-[#D9886A] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <button className="p-2 hover:text-[#0D3B66]">
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-10 left-10">
        <button
          onClick={() => router.back()}
          className="p-3 border-2 border-[#0D3B66] rounded-full text-[#0D3B66] hover:bg-[#0D3B66] hover:text-white transition-all bg-transparent"
        >
          <ArrowLeft size={32} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
