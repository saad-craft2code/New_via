"use client";

import { api } from "@/lib/api";

export interface ServerReview {
  id: string;
  targetId: string;
  targetType: string; // "hotel" | "bundle"
  rating: number;
  commentEn: string;
  commentAr: string;
  author: string;
  createdAt: string;
}

export interface UIReview {
  id: string;
  guestName: string;
  guestNameAr: string;
  guestAvatar: string;
  itemName: string;
  itemNameAr: string;
  rating: number;
  categories: { cleanliness?: number; comfort?: number; location?: number; facilities?: number; staff?: number; value?: number; overall?: number };
  comment: string;
  commentAr: string;
  date: string;
  images?: string[];
  replied: boolean;
  reply?: string;
}

function avatarFor(name: string): string {
  const seed = (name?.charCodeAt(0) ?? 65) % 60;
  return `https://i.pravatar.cc/150?img=${seed + 1}`;
}

export function adaptReview(r: ServerReview, itemNameEn?: string, itemNameAr?: string): UIReview {
  return {
    id: r.id,
    guestName: r.author,
    guestNameAr: r.author,
    guestAvatar: avatarFor(r.author),
    itemName: itemNameEn ?? r.targetId,
    itemNameAr: itemNameAr ?? r.targetId,
    rating: r.rating,
    categories: { overall: r.rating },
    comment: r.commentEn || "",
    commentAr: r.commentAr || "",
    date: (r.createdAt ?? new Date()).slice(0, 10),
    replied: false,
  };
}

export const reviewService = {
  list: () => api.get<ServerReview[]>("/reviews"),
};
