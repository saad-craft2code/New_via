"use client";

import { api } from "@/lib/api";
import type {
  CreateBundleDto,
  UpdateBundleDto,
  Bundle,
} from "@via/shared-types";

export const bundleService = {
  list: () => api.get<Bundle[]>("/bundles"),
  get: (id: string) => api.get<Bundle>(`/bundles/${id}`),
  create: (payload: CreateBundleDto) => api.post<Bundle>("/bundles", payload),
  update: (id: string, payload: UpdateBundleDto) =>
    api.patch<Bundle>(`/bundles/${id}`, payload),
  remove: (id: string) => api.delete<{ id: string }>(`/bundles/${id}`),
};
