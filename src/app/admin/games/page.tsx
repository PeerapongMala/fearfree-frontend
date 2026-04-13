"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Folder, LayoutGrid, Layers, ChevronDown, ChevronRight, CheckCircle } from "lucide-react";
import { useAdminStore } from "@/features/admin";
import { Button, Card, Input, ConfirmDialog, useConfirmDialog } from "@/shared/components/ui";

export default function AdminGamesPage() {
  const {
    categories,
    isFetching,
    fetchGamesHierarchy,
    createCategory,
    deleteCategory,
    createAnimal,
    deleteAnimal,
    createStage,
    deleteStage,
  } = useAdminStore();

  const { dialog, showConfirm, closeDialog } = useConfirmDialog();

  const [expandedCat, setExpandedCat] = useState<number[]>([]);
  const [expandedAnim, setExpandedAnim] = useState<number[]>([]);

  // Form modal state
  type FormMode =
    | { type: "category" }
    | { type: "animal"; catId: number }
    | { type: "stage"; animId: number }
    | null;
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [formName, setFormName] = useState("");
  const [stageForm, setStageForm] = useState({ stageNo: "", rewardCoins: "", mediaUrl: "" });

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

  const openFormModal = (mode: NonNullable<FormMode>) => {
    setFormName("");
    setStageForm({ stageNo: "", rewardCoins: "", mediaUrl: "" });
    setFormMode(mode);
  };

  const closeFormModal = () => setFormMode(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMode) return;

    if (formMode.type === "category" && formName.trim()) {
      createCategory({ name: formName.trim(), description: "" });
    } else if (formMode.type === "animal" && formName.trim()) {
      createAnimal({
        category_id: formMode.catId,
        name: formName.trim(),
        description: "",
        thumbnail_url: "",
      });
    } else if (formMode.type === "stage") {
      const { stageNo, rewardCoins, mediaUrl } = stageForm;
      if (stageNo && rewardCoins && mediaUrl) {
        createStage({
          animal_id: formMode.animId,
          stage_no: Number(stageNo),
          media_type: mediaUrl.includes("youtube") ? "video" : "image",
          media_url: mediaUrl,
          display_time_sec: 10,
          reward_coins: Number(rewardCoins),
        });
      }
    }
    closeFormModal();
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
          <h1 className="text-[#0D3B66] font-bold text-3xl">จัดการเนื้อหาเกม</h1>
          <p className="text-gray-500 mt-2">เพิ่มหมวดหมู่ สัตว์ และด่านบำบัด</p>
        </div>
        <Button onClick={() => openFormModal({ type: "category" })} icon={<Plus size={20} />}>
          เพิ่มหมวดหมู่หลัก
        </Button>
      </div>

      <Card className="min-h-[500px]">
        {isFetching ? (
          <div className="flex justify-center items-center h-64 text-[#0D3B66]">กำลังโหลดข้อมูล...</div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
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
                      onClick={() => openFormModal({ type: "animal", catId: cat.id })}
                      className="px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center gap-1 font-medium transition-colors"
                    >
                      <Plus size={16} /> สัตว์
                    </button>
                    <button
                      onClick={() =>
                        showConfirm({
                          title: "ยืนยันการลบ",
                          message: `ลบหมวดหมู่ ${cat.name}?`,
                          onConfirm: () => deleteCategory(cat.id),
                        })
                      }
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
                    {cat.animals?.map((animal) => (
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
                              onClick={() => openFormModal({ type: "stage", animId: animal.id })}
                              className="px-3 py-1 text-sm bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg flex items-center gap-1 font-medium transition-colors"
                            >
                              <Plus size={16} /> ด่าน
                            </button>
                            <button
                              onClick={() =>
                                showConfirm({
                                  title: "ยืนยันการลบ",
                                  message: `ลบสัตว์ ${animal.name}?`,
                                  onConfirm: () => deleteAnimal(animal.id),
                                })
                              }
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
                            {animal.stages?.sort((a, b) => a.stage_no - b.stage_no).map((stage) => (
                              <div key={stage.id} className="flex text-black font-semibold items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                  <Layers size={18} className="text-[#D9886A]" />
                                  <span>ด่าน {stage.stage_no} ({stage.media_type})</span>
                                  <span className="bg-orange-100 text-[#D9886A] text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle size={10} /> {stage.reward_coins} เหรียญ
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    showConfirm({
                                      title: "ยืนยันการลบ",
                                      message: `ลบด่าน ${stage.stage_no}?`,
                                      onConfirm: () => deleteStage(stage.id),
                                    })
                                  }
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
      </Card>

      {/* Add Form Modal */}
      {formMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeFormModal} />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-[#0D3B66] font-bold text-2xl mb-6">
              {formMode.type === "category" && "เพิ่มหมวดหมู่"}
              {formMode.type === "animal" && "เพิ่มสัตว์"}
              {formMode.type === "stage" && "เพิ่มด่าน"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {(formMode.type === "category" || formMode.type === "animal") && (
                <Input
                  variant="filled"
                  label={formMode.type === "category" ? "ชื่อหมวดหมู่" : "ชื่อสัตว์"}
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={formMode.type === "category" ? "เช่น Exposure Therapy" : "เช่น งู"}
                />
              )}

              {formMode.type === "stage" && (
                <>
                  <Input
                    variant="filled"
                    label="ด่านที่ (ตัวเลข)"
                    type="number"
                    min="1"
                    required
                    value={stageForm.stageNo}
                    onChange={(e) => setStageForm({ ...stageForm, stageNo: e.target.value })}
                  />
                  <Input
                    variant="filled"
                    label="รางวัลเมื่อผ่านด่าน (เหรียญ)"
                    type="number"
                    min="0"
                    required
                    value={stageForm.rewardCoins}
                    onChange={(e) => setStageForm({ ...stageForm, rewardCoins: e.target.value })}
                  />
                  <Input
                    variant="filled"
                    label="URL รูปภาพ/วิดีโอ"
                    type="url"
                    required
                    value={stageForm.mediaUrl}
                    onChange={(e) => setStageForm({ ...stageForm, mediaUrl: e.target.value })}
                    placeholder="https://youtube.com/..."
                  />
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                <Button variant="ghost" type="button" onClick={closeFormModal}>
                  ยกเลิก
                </Button>
                <Button variant="secondary" type="submit">
                  บันทึก
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
