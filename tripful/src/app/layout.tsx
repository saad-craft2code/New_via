import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/components/lang-provider";

export const metadata: Metadata = {
  title: "Tripful — Book Hotels & Travel Bundles",
  description: "Find and book luxury hotels and curated travel bundles. Best prices, instant confirmation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-[#0F172A] antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
