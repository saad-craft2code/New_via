"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { LandingPage } from "@/components/auth/landing-page";
import { RoleSelection } from "@/components/auth/role-selection";
import { RegisterForm } from "@/components/auth/register-form";
import { VerificationScreen } from "@/components/auth/verification-screen";
import { LoginForm } from "@/components/auth/login-form";
import { AppShell } from "@/components/provider/app-shell";
import { GuestBrowse } from "@/components/guest/guest-browse";
import { StaffLogin } from "@/components/staff/staff-login";
import { StaffPortal } from "@/components/staff/staff-portal";

export default function Home() {
  const isAuthed = useAppStore((s) => s.isAuthed);
  const isStaffAuthed = useAppStore((s) => s.isStaffAuthed);
  const authScreen = useAppStore((s) => s.authScreen);
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);

  // Sync <html> dir/lang + theme class
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  }, [theme]);

  // Staff portal takes priority (separate auth namespace)
  if (isStaffAuthed && (authScreen === "staff_portal" || authScreen === "staff_login")) {
    return <StaffPortal />;
  }
  if (authScreen === "staff_login") {
    return <StaffLogin />;
  }

  if (isAuthed) {
    return <AppShell />;
  }

  switch (authScreen) {
    case "landing":
      return <LandingPage />;
    case "role_selection":
      return <RoleSelection />;
    case "register":
      return <RegisterForm />;
    case "verification":
      return <VerificationScreen />;
    case "login":
      return <LoginForm />;
    case "guest_browse":
      return <GuestBrowse />;
    case "staff_login":
      return <StaffLogin />;
    case "staff_portal":
      return <StaffPortal />;
    default:
      return <LandingPage />;
  }
}
