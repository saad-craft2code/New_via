"use client";

import { api } from "@/lib/api";

export interface ServerNotification {
  id: string;
  userId: string;
  type: string; // "booking" | "payment" | "verification" | "reviews" | "system" | "reminders"
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface UINotification {
  id: string;
  type: "booking" | "payment" | "verification" | "reviews" | "system" | "reminders";
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  timestamp: string;
  read: boolean;
}

export function adaptNotification(n: ServerNotification): UINotification {
  return {
    id: n.id,
    type: n.type as UINotification["type"],
    titleAr: n.titleAr,
    titleEn: n.titleEn,
    messageAr: n.bodyAr,
    messageEn: n.bodyEn,
    timestamp: n.createdAt,
    read: n.read,
  };
}

export const notificationService = {
  list: () => api.get<ServerNotification[]>("/notifications"),
  markRead: (id: string, read: boolean = true) =>
    api.patch<ServerNotification>(`/notifications/${id}`, { read }),
  remove: (id: string) => api.delete<{ id: string }>(`/notifications/${id}`),
};
