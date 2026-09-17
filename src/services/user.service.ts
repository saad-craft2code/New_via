"use client";

import { api } from "@/lib/api";
import type { UpdateProfileDto, User } from "@via/shared-types";

export const userService = {
  profile: () => api.get<User>("/users/me"),
  updateProfile: (payload: Partial<UpdateProfileDto>) =>
    api.patch<User>("/users/me", payload),
};
