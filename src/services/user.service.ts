"use client";

import { api } from "@/lib/api";
import type { UpdateProfileDto, User } from "@via/shared-types";

export const userService = {
  profile: () => api.get<User>("/user/profile"),
  updateProfile: (payload: UpdateProfileDto) =>
    api.patch<User>("/user/profile", payload),
};
