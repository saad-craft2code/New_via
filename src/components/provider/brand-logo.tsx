"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";

export function BrandLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const lang = useAppStore((s) => s.lang);
  const dims = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-14 w-14" : "h-10 w-10";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${dims} relative rounded-xl bg-gradient-to-br from-neutral-950 via-zinc-800 to-zinc-600 flex items-center justify-center shadow-md`}>
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
          <circle cx="12" cy="10" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <span className={`font-bold ${text} tracking-tight`}>{t("brand", lang)}</span>
        {size !== "sm" && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("provider_panel", lang)}
          </span>
        )}
      </div>
    </div>
  );
}
