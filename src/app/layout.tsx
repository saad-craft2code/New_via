import type { Metadata } from "next";
import "./globals.css";
import "./tripful.css";
import { LangProvider } from "@/components/tripful-lang-provider";

export const metadata: Metadata = {
  title: "Tripful — Book Hotels & Travel Bundles | Middle East",
  description: "Find and book luxury hotels and curated travel bundles across the Middle East. Best prices, instant confirmation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-[#0F172A] antialiased tf-font-body">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
