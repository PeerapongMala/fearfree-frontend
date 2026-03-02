"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, CheckCircle, Package } from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { AdminReward, AdminRewardInput } from "@/models/admin.model";

export default function AdminRewardsPage() {
  const { rewards, isLoading, fetchRewards, createReward, updateReward, deleteReward } =
    useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<AdminRewardInput>({
    name: "",
    description: "",
    cost_coins: 0,
    stock: 0,
    image_url: "",
  });

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", cost_coins: 0, stock: 0, image_url: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (reward: AdminReward) => {
    setEditingId(reward.id);
    setFormData({
      name: reward.name,
      description: reward.description,
      cost_coins: reward.cost_coins,
      stock: reward.stock,
      image_url: reward.image_url,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    // Format Numbers
    const payload = {
        ...formData,
        cost_coins: Number(formData.cost_coins),
        stock: Number(formData.stock),
    }

    if (editingId) {
      success = await updateReward(editingId, payload);
    } else {
      success = await createReward(payload);
    }
    
    if (success) {
      closeModal();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("ยืนยันการลบของรางวัลชิ้นนี้? ประวัติการแลกอาจได้รับผลกระทบ")) {
      await deleteReward(id);
    }
  };

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[#0D3B66] font-bold text-3xl">จัดการของรางวัล</h1>
          <p className="text-gray-500 mt-2">เพิ่ม / ลบ / แก้ไข ของรางวัลในระบบ</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#D9886A] hover:bg-[#c5765a] text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Plus size={20} />
          เพิ่มของรางวัล
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-[#0D3B66]">
            กำลังโหลดข้อมูล...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-normal">รูปภาพ</th>
                  <th className="p-4 font-normal">ชื่อรางวัล</th>
                  <th className="p-4 font-normal">รายละเอียด</th>
                  <th className="p-4 font-normal">ราคา (เหรียญ)</th>
                  <th className="p-4 font-normal">คงเหลือ</th>
                  <th className="p-4 font-normal text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="text-[#0D3B66]">
                {rewards.map((reward) => (
                  <tr
                    key={reward.id}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <td className="p-4">
                      {reward.image_url ? (
                        <img
                          src={reward.image_url}
                          alt={reward.name}
                          className="w-12 h-12 object-cover rounded-xl shadow-sm bg-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                          <Package size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{reward.name}</td>
                    <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                      {reward.description}
                    </td>
                    <td className="p-4">
                      <span className="bg-orange-100 text-[#D9886A] px-3 py-1 rounded-full font-bold text-sm">
                        {reward.cost_coins}
                      </span>
                    </td>
                    <td className="p-4">
                      {reward.stock > 0 ? (
                        <span className="flex items-center gap-2 text-green-600 font-medium">
                          <CheckCircle size={16} /> {reward.stock} ชิ้น
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">หมด</span>
                      )}
                    </td>
                    <td className="p-4 text-center space-x-2 w-32">
                      <button
                        onClick={() => openEditModal(reward)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(reward.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

                {rewards.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      ยังไม่มีของรางวัลในระบบ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* React Modal (Custom Simple) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-[#0D3B66] font-bold text-2xl mb-6">
              {editingId ? "แก้ไขของรางวัล" : "เพิ่มของรางวัลใหม่"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อรางวัล</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/30 transition-all"
                  placeholder="เช่น ตุ๊กตาหมีไซส์ M"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/30 transition-all h-24 resize-none"
                  placeholder="คำอธิบายเพิ่มเติม..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนเหรียญที่ใช้</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.cost_coins}
                    onChange={(e) => setFormData({ ...formData, cost_coins: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนในสต็อก (ชิ้น)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ลิงก์รูปภาพ (Image URL)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/30 transition-all"
                  placeholder="https://example.com/image.png"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#0D3B66] hover:bg-[#1a4f82] text-white px-8 py-3 rounded-xl font-bold shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-70"
                >
                  {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
