// src/features/rewards/reward.model.ts

export interface Reward {
  id: number;
  name: string; // เช่น 'รับส่วนลด 10 บาท'
  description?: string;
  image_url: string; // URL รูปภาพไอศกรีม, ชานม ฯลฯ
  cost_coins: number; // จำนวนคอยน์ที่ต้องใช้ เช่น 30
}

export interface RedeemResponse {
  success: boolean;
  message: string;
  remaining_coins: number; // ยอดเงินคงเหลือหลังแลก
}
