// src/models/admin.model.ts

export interface AdminReward {
  id: number;
  name: string;
  description: string;
  cost_coins: number;
  stock: number;
  image_url: string;
}

export interface AdminRewardInput {
  name: string;
  description: string;
  cost_coins: number;
  stock: number;
  image_url: string;
}

export interface AdminCategory {
  id: number;
  name: string;
  description: string;
}

export interface AdminCategoryInput {
  name: string;
  description: string;
}

export interface AdminAnimal {
  id: number;
  category_id: number;
  name: string;
  description: string;
  thumbnail_url: string;
}

export interface AdminAnimalInput {
  category_id: number;
  name: string;
  description: string;
  thumbnail_url: string;
}

export type MediaTypeValue = "image" | "video";

export interface AdminStage {
  id: number;
  animal_id: number;
  stage_no: number;
  media_type: MediaTypeValue;
  media_url: string;
  display_time_sec: number;
  reward_coins: number;
}

export interface AdminStageInput {
  animal_id: number;
  stage_no: number;
  media_type: MediaTypeValue;
  media_url: string;
  display_time_sec: number;
  reward_coins: number;
}

// Nested category with animals and stages for admin game hierarchy
export interface AdminCategoryWithHierarchy {
  id: number;
  name: string;
  description?: string;
  animals?: {
    id: number;
    category_id?: number;
    name: string;
    description?: string;
    thumbnail_url?: string;
    stages?: AdminStage[];
  }[];
}
