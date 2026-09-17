"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { authService } from "@/services/auth.service";
import { getToken, setToken } from "@/lib/api";

/**
 * SessionGate
 * ───────────────────────────────────────────────────────────
 * Rehydrates the user from a stored token on app boot, and
 * listens for the `via:unauthorized` event dispatched by the
 * API client when a 401 is received.
 */
export function SessionGate({ children }: { children: React.ReactNode }) {
  const logout = useAppStore((s) => s.logout);
  const isAuthed = useAppStore((s) => s.isAuthed);
  const token = useAppStore((s) => s.token);

  // On boot: if we have a token in localStorage but no user in store,
  // fetch /auth/me to rehydrate.
  useEffect(() => {
    const stored = getToken();
    if (stored && !isAuthed) {
      authService
        .me()
        .then((user) => {
          const rawRole = (user as unknown as { role: string }).role;
          const rawKyc = (user as unknown as { kycStatus: string }).kycStatus;
          const sharedRole: "hotel_owner" | "bundle_creator" =
            rawRole === "HotelOwner" ? "hotel_owner" : "bundle_creator";
          const sharedKyc =
            rawKyc === "Pending"
              ? "pending"
              : rawKyc === "Approved"
                ? "approved"
                : rawKyc === "Rejected"
                  ? "rejected"
                  : "not_submitted";
          useAppStore.setState({
            isAuthed: true,
            token: stored,
            user: { ...(user as any), role: sharedRole, kycStatus: sharedKyc },
            role: sharedRole,
          });
        })
        .catch(() => {
          setToken(null);
        });
    } else if (!stored && isAuthed) {
      // Persisted store says authed but there's no token — clear it.
      logout();
    }
     
  }, []);

  // Listen for forced logout events from the API client.
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("via:unauthorized", handler);
    return () => window.removeEventListener("via:unauthorized", handler);
  }, [logout]);

  return <>{children}</>;
}
