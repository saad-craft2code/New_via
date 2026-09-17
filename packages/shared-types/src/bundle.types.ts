export type BundleItemType =
  | 'flight'
  | 'hotel'
  | 'tour'
  | 'meal'
  | 'transport'
  | 'custom';

export type BundleDifficulty = 'easy' | 'moderate' | 'challenging';

export type BundleStatus = 'draft' | 'published' | 'archived' | 'sold_out';

export interface BundleItem {
  id: string;
  type: BundleItemType;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  cost?: number;
  includedServices?: string[];
  metadata?: Record<string, unknown>;
}

export interface BundleDay {
  id: string;
  dayNumber: number;
  title: string;
  description?: string;
  items: BundleItem[];
}

export interface Bundle {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  durationDays: number;
  destinations: string[];
  images: string[];
  guideName?: string;
  price: number;
  difficulty: BundleDifficulty;
  groupSize?: number;
  includedServices: string[];
  status: BundleStatus;
  days: BundleDay[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBundleItemDto {
  type: BundleItemType;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  cost?: number;
  includedServices?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateBundleDayDto {
  dayNumber: number;
  title: string;
  description?: string;
  items: CreateBundleItemDto[];
}

export interface CreateBundleDto {
  title: string;
  description: string;
  durationDays: number;
  destinations: string[];
  images: string[];
  guideName?: string;
  price: number;
  difficulty: BundleDifficulty;
  groupSize?: number;
  includedServices: string[];
  days: CreateBundleDayDto[];
}

export type UpdateBundleDto = Partial<CreateBundleDto>;
