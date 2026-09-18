"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, EmptyState } from "@/components/widgets";
import { staffService, type Camera } from "@/services/staff.service";
import { useApi } from "@/hooks/use-api";
import { Camera as CameraIcon, Plus, Loader2, AlertCircle, Video, VideoOff, MapPin, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export function CamerasManagement() {
  const lang = useAppStore((s) => s.lang);

  const { data: cameras, loading, error, refetch } = useApi<Camera[]>(
    () => staffService.listCameras(),
    [],
  );
  const allCameras = cameras ?? [];
  const onlineCount = allCameras.filter((c) => c.status === "online").length;
  const offlineCount = allCameras.filter((c) => c.status === "offline").length;
  const maintenanceCount = allCameras.filter((c) => c.status === "maintenance").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("ops_cameras_title", lang)}
        subtitle={t("ops_cameras_subtitle", lang)}
        actions={
          <Button onClick={() => toast(lang === "ar" ? "ميزة الإضافة قريبًا" : "Add feature coming soon")} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            {lang === "ar" ? "إضافة كاميرا" : "Add Camera"}
          </Button>
        }
      />

      {/* Info banner */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800">
        <CardContent className="p-4 flex items-center gap-3">
          <Video className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{t("ops_cameras_coming_soon", lang)}</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
              {lang === "ar"
                ? "هذه الكاميرات جاهزة لربط البث المباشر (RTSP/HLS). تواصل مع مدير النظام للتفعيل."
                : "These cameras are ready for live stream (RTSP/HLS) integration. Contact admin to enable."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <p className="text-xl sm:text-2xl font-bold tabular-nums">{onlineCount}</p>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{lang === "ar" ? "متصل" : "Online"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
              <p className="text-xl sm:text-2xl font-bold tabular-nums">{offlineCount}</p>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{lang === "ar" ? "غير متصل" : "Offline"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <p className="text-xl sm:text-2xl font-bold tabular-nums">{maintenanceCount}</p>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{lang === "ar" ? "صيانة" : "Maintenance"}</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-40 w-full rounded-none" />
              <CardContent className="p-3 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <AlertCircle className="h-8 w-8 text-destructive mb-3" />
            <p className="text-sm text-muted-foreground mb-3">{error}</p>
            <Button size="sm" variant="outline" onClick={refetch}>{t("retry", lang)}</Button>
          </CardContent>
        </Card>
      ) : allCameras.length === 0 ? (
        <Card>
          <CardContent className="p-2">
            <EmptyState icon={CameraIcon} title={lang === "ar" ? "لا توجد كاميرات" : "No cameras"} desc={lang === "ar" ? "أضف كاميرا للبدء" : "Add a camera to get started"} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCameras.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Camera "feed" — placeholder */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center overflow-hidden">
                  {c.status === "online" ? (
                    <>
                      <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15), transparent 50%)",
                      }} />
                      <Video className="h-12 w-12 text-emerald-400 relative z-10" />
                      <div className="absolute top-2 start-2 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-white bg-black/50 px-1.5 py-0.5 rounded">LIVE</span>
                      </div>
                    </>
                  ) : (
                    <VideoOff className="h-12 w-12 text-slate-500" />
                  )}
                  <div className="absolute top-2 end-2">
                    <Badge className={cn(
                      "text-[10px]",
                      c.status === "online" ? "bg-emerald-500 text-white" :
                      c.status === "maintenance" ? "bg-amber-500 text-white" :
                      "bg-slate-500 text-white"
                    )}>
                      {c.status === "online" ? (lang === "ar" ? "متصل" : "Online") :
                       c.status === "maintenance" ? (lang === "ar" ? "صيانة" : "Maintenance") :
                       (lang === "ar" ? "غير متصل" : "Offline")}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 start-2 text-[10px] font-mono text-white/70">
                    {new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US")}
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />{c.location}
                  </p>
                  {c.hotel && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Building2 className="h-3 w-3" />{c.hotel.name}
                    </p>
                  )}
                  {c.streamUrl && (
                    <p className="text-[10px] font-mono text-muted-foreground/70 mt-2 truncate" dir="ltr">{c.streamUrl}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
