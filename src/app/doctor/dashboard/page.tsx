"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LogOut,
  Eye,
  FileText,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Gift,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useDoctorStore } from "@/stores/doctor.store";

export default function DoctorDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const {
    patients,
    recentCreated,
    fetchPatients,
    createPatient,
    deletePatient,
  } = useDoctorStore();

  // Form State สำหรับสร้างผู้ป่วย
  const [newName, setNewName] = useState("");
  const [newFear, setNewFear] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // เช็คสิทธิ์: ถ้าไม่ใช่หมอ ให้เด้งออก
    if (!user || user.role !== "doctor") {
      // router.push('/login'); // เปิดบรรทัดนี้เมื่อระบบ Login พร้อม
    }
    fetchPatients();
  }, [user, fetchPatients, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleCreate = async () => {
    if (!newName || !newFear) return alert("กรุณากรอกข้อมูลให้ครบ");

    setIsCreating(true);
    const success = await createPatient({
      full_name: newName,
      most_fear_animal: newFear,
    });

    if (success) {
      setNewName("");
      setNewFear("");
      alert("สร้างผู้ป่วยสำเร็จ!");
    } else {
      alert("สร้างผู้ป่วยล้มเหลว (ลองใหม่อีกครั้ง หรือเช็ค Backend)");
    }
    setIsCreating(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("ยืนยันการลบผู้ป่วยรายนี้?")) {
      await deletePatient(id);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#E6F4F1] to-[#CDE8E5] font-sans">
      {/* 1. Header (Navbar เฉพาะของหมอ ตามรูป) */}
      <header className="bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* โลโก้แบบ Text หรือ Image */}
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

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 2. Top Section: Profile Card & Recent Codes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Card: Create Patient */}
          <div className="bg-white rounded-3xl p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
            {/* Badge ตัว B (Decoration) */}
            <div className="absolute top-0 right-0 p-4">
              <div className="w-10 h-10 bg-[#007bff] rounded-full border-2 border-white flex items-center justify-center shadow-md text-white font-bold">
                B
              </div>
            </div>

            <div>
              <h2 className="text-[#0D3B66] font-bold text-2xl mb-1">
                {user?.full_name || "ดร. พีระพงษ์ มาลา"}
              </h2>
              <p className="text-[#0D3B66] mb-6">โรงพยาบาลมหาราชนครเชียงใหม่</p>

              <div className="flex flex-col gap-4 max-w-md">
                <input
                  type="text"
                  placeholder="ชื่อ-สกุล"
                  className="bg-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="สัตว์ที่กลัว (เช่น งู)"
                  className="bg-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20"
                  value={newFear}
                  onChange={(e) => setNewFear(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="bg-[#D9886A] hover:bg-[#c5765a] text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                {isCreating ? "กำลังสร้าง..." : "สร้างผู้ป่วยใหม่"}{" "}
                <UserPlus size={20} />
              </button>
            </div>
          </div>

          {/* Right Card: Recent Codes */}
          <div className="bg-white rounded-3xl p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="w-10 h-10 bg-[#007bff] rounded-full border-2 border-white flex items-center justify-center shadow-md text-white font-bold">
                B
              </div>
            </div>

            <h3 className="text-[#0D3B66] font-bold text-lg mb-4">
              โค้ดที่เพิ่งสร้างใหม่ล่าสุด
            </h3>

            <div className="space-y-3">
              {recentCreated.length > 0 ? (
                recentCreated.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-600 font-medium">
                      {p.code_patient}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {p.created_at}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">ยังไม่มีรายการล่าสุด</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Bottom Section: Patient Table */}
        <div className="bg-white rounded-3xl p-8 shadow-md relative min-h-[500px]">
          <div className="absolute -top-4 left-8">
            <div className="w-12 h-12 bg-[#007bff] rounded-full border-4 border-[#E6F4F1] flex items-center justify-center shadow-md text-white font-bold text-xl z-10">
              B
            </div>
          </div>

          <h3 className="text-[#0D3B66] font-bold text-xl mb-6 pl-6 pt-2">
            รายชื่อผู้ป่วย
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-normal">#</th>
                  <th className="p-4 font-normal">ชื่อ</th>
                  <th className="p-4 font-normal">ระดับความกลัว</th>
                  <th className="p-4 font-normal">สัตว์ที่กลัว</th>
                  <th className="p-4 font-normal">โค้ด</th>
                  <th className="p-4 font-normal">วันที่เริ่ม</th>
                  <th className="p-4 font-normal text-center">
                    ประวัติการเล่น
                  </th>
                  <th className="p-4 font-normal text-center">
                    บันทึกการทดสอบ
                  </th>
                  <th className="p-4 font-normal text-center">แลกรางวัล</th>
                  <th className="p-4 font-normal text-center">ลบ</th>
                </tr>
              </thead>
              <tbody className="text-[#0D3B66]">
                {patients.map((patient, index) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium">{patient.full_name}</td>
                    <td className="p-4">{patient.fear_level}</td>
                    <td className="p-4">{patient.most_fear_animal}</td>
                    <td className="p-4 font-mono text-gray-600">
                      {patient.code_patient}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {patient.created_at}
                    </td>

                    {/* Actions Icons */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => router.push(`/doctor/play-history/${patient.id}`)}
                        className="p-2 hover:bg-gray-200 rounded-full text-gray-600"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => router.push(`/doctor/test-history/${patient.id}`)}
                        className="p-2 hover:bg-gray-200 rounded-full text-gray-600"
                      >
                        <FileText size={20} />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => router.push(`/doctor/redemption-history/${patient.id}`)}
                        className="p-2 hover:bg-gray-200 rounded-full text-gray-600"
                      >
                        <Gift size={20} />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(patient.id)}
                        className="p-2 hover:bg-red-100 rounded-full text-red-500"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {patients.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                ไม่พบรายชื่อผู้ป่วย
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
      </main>
    </div>
  );
}
