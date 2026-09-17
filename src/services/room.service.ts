"use client";

import { api } from "@/lib/api";
import type {
  CreateRoomDto,
  UpdateRoomDto,
  Room,
} from "@via/shared-types";

export const roomService = {
  list: (hotelId: string) => api.get<Room[]>(`/hotels/${hotelId}/rooms`),
  get: (hotelId: string, roomId: string) =>
    api.get<Room>(`/hotels/${hotelId}/rooms/${roomId}`),
  create: (hotelId: string, payload: CreateRoomDto) =>
    api.post<Room>(`/hotels/${hotelId}/rooms`, payload),
  update: (hotelId: string, roomId: string, payload: UpdateRoomDto) =>
    api.patch<Room>(`/hotels/${hotelId}/rooms/${roomId}`, payload),
  remove: (hotelId: string, roomId: string) =>
    api.delete<{ id: string }>(`/hotels/${hotelId}/rooms/${roomId}`),
};
