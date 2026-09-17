"use client";

import { api } from "@/lib/api";
import type {
  CreateHotelDto,
  UpdateHotelDto,
  Hotel,
} from "@via/shared-types";

export const hotelService = {
  list: () => api.get<Hotel[]>("/hotels"),
  get: (id: string) => api.get<Hotel>(`/hotels/${id}`),
  create: (payload: CreateHotelDto) => api.post<Hotel>("/hotels", payload),
  update: (id: string, payload: UpdateHotelDto) =>
    api.patch<Hotel>(`/hotels/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/hotels/${id}`),
};
