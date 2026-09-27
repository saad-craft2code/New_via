import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionGate } from "@/components/provider/session-gate";

export const metadata: Metadata = {
  title: "Via Trips — Provider Panel",
  description: "Service Provider Dashboard for Via Trips — manage hotels, bundles, bookings, and earnings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/IBM-Plex-Sans-Arabic-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/IBM-Plex-Sans-Arabic-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <SessionGate>{children}</SessionGate>
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: "var(--popover, #fff)", color: "var(--popover-foreground, #111)", border: "1px solid var(--border, #e5e7eb)", borderRadius: "12px", fontSize: "14px", padding: "12px 16px" } }} />
      </body>
    </html>
  );
}
