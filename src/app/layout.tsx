import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionGate } from "@/components/provider/session-gate";

export const metadata: Metadata = {
  title: "Via Trips — Provider Panel",
  description:
    "Service Provider Dashboard for Via Trips — manage hotels, bundles, bookings, and earnings.",
  keywords: ["Via Trips", "Provider Panel", "Hotel Owner", "Bundle Creator", "Travel Dashboard"],
  authors: [{ name: "Via Trips" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Local fonts — IBM Plex Sans Arabic for Arabic UI, Plus Jakarta Sans for Latin */}
        <link rel="preload" href="/fonts/IBM-Plex-Sans-Arabic-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/IBM-Plex-Sans-Arabic-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/IBM-Plex-Sans-Arabic-SemiBold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <SessionGate>{children}</SessionGate>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--popover, #fff)",
              color: "var(--popover-foreground, #111)",
              border: "1px solid var(--border, #e5e7eb)",
              borderRadius: "12px",
              fontSize: "14px",
              padding: "12px 16px",
            },
            success: { iconTheme: { primary: "oklch(0.2 0.02 240)", secondary: "#fff" } },
            error: { iconTheme: { primary: "oklch(0.55 0.22 25)", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
