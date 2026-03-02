"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Folder, LayoutGrid, Layers, ChevronDown, ChevronRight, CheckCircle } from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";

export default function AdminGamesPage() {
  const {
    categories,
    isLoading,
    fetchGamesHierarchy,
    createCategory,
    deleteCategory,
    createAnimal,
    deleteAnimal,
    createStage,
    deleteStage,
  } = useAdminStore();

  const [expandedCat, setExpandedCat] = useState<number[]>([]);
  const [expandedAnim, setExpandedAnim] = useState<number[]>([]);

  useEffect(() => {
    fetchGamesHierarchy();
  }, [fetchGamesHierarchy]);

  const toggleCat = (id: number) => {
    setExpandedCat((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAnim = (id: number) => {
    setExpandedAnim((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddCategory = () => {
    const name = prompt("ชื่อหมวดหมู่ (เช่น Exposure Therapy):");
    if (name) createCategory({ name, description: "" });
  };

  const handleAddAnimal = (catId: number) => {
    const name = prompt("ชื่อสัตว์ (เช่น งู):");
    if (name) {
      createAnimal({
        category_id: catId,
        name,
        description: "",
        thumbnail_url: "https://via.placeholder.com/150",
      });
    }
  };

  const handleAddStage = (animId: number) => {
    const stageNo = prompt("ด่านที่เท่าไหร่ (ตัวเลข):");
    const rewardCoins = prompt("รางวัลเมื่อผ่านด่าน (เหรียญ):");
    const mediaUrl = prompt("URL รูปภาพ/วิดีโอ (youtube):");
    if (stageNo && rewardCoins && mediaUrl) {
      createStage({
        animal_id: animId,
        stage_no: Number(stageNo),
        media_type: mediaUrl.includes("youtube") ? "video" : "image",
        media_url: mediaUrl,
        display_time_sec: 10,
        reward_coins: Number(rewardCoins),
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[#0D3B66] font-bold text-3xl">จัดการเนื้อหาเกม</h1>
          <p className="text-gray-500 mt-2">เพิ่มหมวดหมู่ สัตว์ และด่านบำบัด</p>
        </div>
        <button
          onClick={handleAddCategory}
          className="bg-[#D9886A] hover:bg-[#c5765a] text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Plus size={20} />
          เพิ่มหมวดหมู่หลัก
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-[#0D3B66]">กำลังโหลดข้อมูล...</div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat: any) => (
              <div key={cat.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/50">
                {/* CATEGORY ROW */}
                <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <div
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => toggleCat(cat.id)}
                  >
                    <button className="text-gray-400 hover:text-[#0D3B66]">
                      {expandedCat.includes(cat.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                    <Folder size={24} className="text-blue-500" />
                    <span className="font-bold text-lg text-[#0D3B66]">{cat.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddAnimal(cat.id)}
                      className="px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center gap-1 font-medium transition-colors"
                    >
                      <Plus size={16} /> สัตว์
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`ลบหมวดหมู่ ${cat.name}?`)) deleteCategory(cat.id);
                      }}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* ANIMALS LIST */}
                {expandedCat.includes(cat.id) && (
                  <div className="pl-12 pr-4 pb-4 pt-2 space-y-3 border-t border-gray-100">
                    {cat.animals?.length === 0 && (
                      <div className="text-gray-400 text-sm py-2">ยังไม่มีสัตว์ในหมวดหมู่นี้</div>
                    )}
                    {cat.animals?.map((animal: any) => (
                      <div key={animal.id} className="bg-white border text-black border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        
                        {/* ANIMAL ROW */}
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                          <div
                            className="flex items-center gap-3 cursor-pointer flex-1"
                            onClick={() => toggleAnim(animal.id)}
                          >
                            <button className="text-gray-400 hover:text-[#0D3B66]">
                              {expandedAnim.includes(animal.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                            <LayoutGrid size={20} className="text-teal-500" />
                            <span className="font-bold text-[#0D3B66]">{animal.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddStage(animal.id)}
                              className="px-3 py-1 text-sm bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg flex items-center gap-1 font-medium transition-colors"
                            >
                              <Plus size={16} /> ด่าน
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`ลบสัตว์ ${animal.name}?`)) deleteAnimal(animal.id);
                              }}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* STAGES LIST */}
                        {expandedAnim.includes(animal.id) && (
                          <div className="pl-12 pr-4 py-3 bg-gray-50/50 space-y-2 border-t border-gray-100">
                            {animal.stages?.length === 0 && (
                              <div className="text-gray-400 text-sm">ยังไม่มีด่านสำหรับสัตว์ตัวนี้</div>
                            )}
                            {animal.stages?.sort((a: any, b: any) => a.stage_no - b.stage_no).map((stage: any) => (
                              <div key={stage.id} className="flex text-black font-semibold items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                  <Layers size={18} className="text-[#D9886A]" />
                                  <span>ด่าน {stage.stage_no} ({stage.media_type})</span>
                                  <span className="bg-orange-100 text-[#D9886A] text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle size={10} /> {stage.reward_coins} เหรียญ
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    if (confirm(`ลบด่าน ${stage.stage_no}?`)) deleteStage(stage.id);
                                  }}
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-md transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
                ยังไม่มีหมวดหมู่เนื้อหาในเกม
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
