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

export default function Home() {
  const isAuthed = useAppStore((s) => s.isAuthed);
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
    default:
      return <LandingPage />;
  }
}
