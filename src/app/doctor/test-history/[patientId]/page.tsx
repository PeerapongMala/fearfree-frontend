"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useDoctorStore } from "@/stores/doctor.store";

export default function PatientTestHistoryPage() {
  const router = useRouter();
  const params = useParams();

  // แปลง params ให้ปลอดภัย
  const patientId = params?.patientId ? Number(params.patientId) : 0;

  const { logout } = useAuthStore();
  const {
    selectedPatient,
    currentTestHistory,
    isLoading,
    fetchPatientTestHistory,
  } = useDoctorStore();

  useEffect(() => {
    if (patientId) {
      fetchPatientTestHistory(patientId);
    }
  }, [patientId, fetchPatientTestHistory]);

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

      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl flex flex-col items-center">
        {/* Title */}
        <h1 className="text-[#0D3B66] font-bold text-3xl mb-8">
          บันทึกการทดสอบ
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

            {/* Test History List */}
            <div className="space-y-4">
              {currentTestHistory.length > 0 ? (
                currentTestHistory.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-center h-28 hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    {/* Decoration Badge (Optional) */}
                    <div className="absolute top-0 right-0 p-3">
                      <div className="w-8 h-8 bg-[#007bff] rounded-full border-2 border-white flex items-center justify-center shadow-md text-white font-bold text-sm">
                        B
                      </div>
                    </div>

                    {/* บรรทัดบน: ชื่อสัตว์ + ด่าน (Bold) */}
                    <span className="text-black font-bold text-lg mb-2">
                      {item.animal_name} ด่านที่ {item.stage_no}
                    </span>

                    {/* บรรทัดล่าง: อาการที่บันทึก (Gray) */}
                    <span className="text-gray-500 text-base">
                      {item.symptom_note}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-10 bg-white/50 rounded-2xl">
                  ยังไม่มีบันทึกการทดสอบ
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Back Button (มุมซ้ายล่าง) */}
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
