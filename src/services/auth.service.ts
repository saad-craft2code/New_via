"use client";

import { api } from "@/lib/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@via/shared-types";

export const authService = {
  login: (payload: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", payload, { skipAuth: true }),

  register: (payload: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", payload, { skipAuth: true }),

  me: () => api.get<AuthResponse["user"]>("/auth/me"),
};
