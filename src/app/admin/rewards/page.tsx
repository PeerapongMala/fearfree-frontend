"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, CheckCircle, Package } from "lucide-react";
import { useAdminStore } from "@/features/admin";
import type { AdminReward, AdminRewardInput } from "@/features/admin";
import { Button, Input, Textarea, Card, ConfirmDialog, useConfirmDialog } from "@/shared/components/ui";

export default function AdminRewardsPage() {
  const { rewards, isFetching, isSubmitting, fetchRewards, createReward, updateReward, deleteReward } =
    useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { dialog, showConfirm, closeDialog } = useConfirmDialog();

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

  const handleDelete = (id: number) => {
    showConfirm({
      title: "ยืนยันการลบ",
      message: "ยืนยันการลบของรางวัลชิ้นนี้? ประวัติการแลกอาจได้รับผลกระทบ",
      onConfirm: () => deleteReward(id),
    });
  };

  return (
    <>
      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onClose={closeDialog}
      />
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[#0D3B66] font-bold text-3xl">จัดการของรางวัล</h1>
          <p className="text-gray-500 mt-2">เพิ่ม / ลบ / แก้ไข ของรางวัลในระบบ</p>
        </div>
        <Button onClick={openAddModal} icon={<Plus size={20} />}>
          เพิ่มของรางวัล
        </Button>
      </div>

      <Card className="min-h-[500px]">
        {isFetching ? (
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
                      {reward.image_url && /^https:\/\//i.test(reward.image_url) ? (
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
      </Card>

      {/* React Modal (Custom Simple) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-[#0D3B66] font-bold text-2xl mb-6">
              {editingId ? "แก้ไขของรางวัล" : "เพิ่มของรางวัลใหม่"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                variant="filled"
                label="ชื่อรางวัล"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="เช่น ตุ๊กตาหมีไซส์ M"
              />

              <Textarea
                variant="filled"
                label="รายละเอียด"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="คำอธิบายเพิ่มเติม..."
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  variant="filled"
                  label="จำนวนเหรียญที่ใช้"
                  type="number"
                  min="0"
                  required
                  value={formData.cost_coins}
                  onChange={(e) => setFormData({ ...formData, cost_coins: Number(e.target.value) })}
                />
                <Input
                  variant="filled"
                  label="จำนวนในสต็อก (ชิ้น)"
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                />
              </div>

              <Input
                variant="filled"
                label="ลิงก์รูปภาพ (Image URL)"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.png"
              />

              <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                <Button variant="ghost" onClick={closeModal} type="button">
                  ยกเลิก
                </Button>
                <Button variant="secondary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
