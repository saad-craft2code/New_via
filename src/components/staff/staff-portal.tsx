"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandLogo } from "@/components/provider/brand-logo";
import { staffService, type StaffTask } from "@/services/staff.service";
import { useApi } from "@/hooks/use-api";
import { Globe, Moon, Sun, LogOut, ChevronLeft, ChevronRight, Briefcase, MapPin, Clock, CheckCircle2, Loader2, AlertCircle, Play, XCircle, Camera, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/hooks/use-mounted";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, any> = {
  cleaning: CheckCircle2,
  maintenance: Briefcase,
  delivery: Briefcase,
  inspection: Star,
  setup: Briefcase,
  other: Briefcase,
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  normal: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const statusColors: Record<string, string> = {
  pending: "border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700",
  in_progress: "border-blue-300 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-700",
  completed: "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-700",
  cancelled: "border-gray-300 bg-gray-50 dark:bg-gray-900/30 dark:border-gray-700",
};

export function StaffPortal() {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const setLang = useAppStore((s) => s.setLang);
  const setTheme = useAppStore((s) => s.setTheme);
  const setAuthScreen = useAppStore((s) => s.setAuthScreen);
  const staffLogout = useAppStore((s) => s.staffLogout);
  const staff = useAppStore((s) => s.staff);
  const isRtl = lang === "ar";
  const Back = isRtl ? ChevronRight : ChevronLeft;
  const mounted = useMounted();

  const [filter, setFilter] = useState<string>("all");
  const [acting, setActing] = useState<string | null>(null);

  const { data, loading, error, refetch } = useApi<StaffTask[]>(
    () => staffService.listTasks(),
    [],
  );
  const tasks = data ?? [];

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const updateStatus = async (id: string, status: string) => {
    setActing(id);
    try {
      await staffService.updateTask(id, { status });
      toast.success(lang === "ar" ? "تم تحديث المهمة" : "Task updated");
      await refetch();
    } catch (e: any) {
      toast.error(e?.message ?? (lang === "ar" ? "فشل التحديث" : "Update failed"));
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandLogo />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="gap-1.5">
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:inline">{t("language_toggle", lang)}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={staffLogout} className="gap-1.5 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("staff_portal_logout", lang)}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 lg:px-8 py-8 flex-1">
        {/* Hero — staff welcome */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 p-5 sm:p-6">
            <div className="flex items-center gap-4">
              {staff?.avatarUrl ? (
                <img src={staff.avatarUrl} alt={staff.name} className="h-16 w-16 rounded-2xl object-cover border-4 border-background shadow-md" />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{t("staff_portal_welcome", lang)} 👋</p>
                <h1 className="text-xl sm:text-2xl font-bold mt-0.5">{lang === "ar" ? staff?.nameAr ?? staff?.name : staff?.name}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="capitalize">
                    {t(`ops_${staff?.department}` as any, lang)}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {t(`ops_staff_role_${staff?.role}` as any, lang)}
                  </Badge>
                  {staff?.hotelName && (
                    <Badge variant="secondary">{staff.hotelName}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatPill label={t("staff_portal_pending", lang)} value={counts.pending} color="bg-amber-500" />
          <StatPill label={t("staff_portal_in_progress", lang)} value={counts.in_progress} color="bg-blue-500" />
          <StatPill label={t("staff_portal_completed", lang)} value={counts.completed} color="bg-emerald-500" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2 mb-4">
          {[
            { key: "all", label: t("all", lang) },
            { key: "pending", label: t("ops_status_pending", lang) },
            { key: "in_progress", label: t("ops_status_in_progress", lang) },
            { key: "completed", label: t("ops_status_completed", lang) },
            { key: "cancelled", label: t("ops_status_cancelled", lang) },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors flex-shrink-0",
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} className="mb-3">
              <CardContent className="p-4">
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <AlertCircle className="h-8 w-8 text-destructive mb-3" />
              <p className="text-sm text-muted-foreground mb-3">{error}</p>
              <Button size="sm" variant="outline" onClick={refetch}>{t("retry", lang)}</Button>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">{t("staff_portal_no_tasks", lang)}</p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            {filtered.map((task, i) => {
              const TI = typeIcons[task.type] ?? Briefcase;
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <Card className={cn("mb-3 border-2 transition-all", statusColors[task.status] ?? "border-border")}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          task.priority === "urgent" ? "bg-red-500" : task.priority === "high" ? "bg-amber-500" : "bg-primary"
                        )}>
                          <TI className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-base">{task.title}</h3>
                            <Badge className={cn("capitalize text-[10px] whitespace-nowrap", priorityColors[task.priority])}>
                              {t(`ops_priority_${task.priority}` as any, lang)}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                            {task.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {task.location}
                              </span>
                            )}
                            {task.dueAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {t("ops_task_due", lang)}: {new Date(task.dueAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                              </span>
                            )}
                            {task.startedAt && (
                              <span className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                {new Date(task.startedAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                              </span>
                            )}
                            {task.completedAt && (
                              <span className="flex items-center gap-1 text-emerald-600">
                                <CheckCircle2 className="h-3 w-3" />
                                {new Date(task.completedAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                              </span>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {task.status === "pending" && (
                              <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white gap-1.5"
                                disabled={acting === task.id}
                                onClick={() => updateStatus(task.id, "in_progress")}
                              >
                                {acting === task.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                                {t("ops_start_task", lang)}
                              </Button>
                            )}
                            {task.status === "in_progress" && (
                              <Button
                                size="sm"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5"
                                disabled={acting === task.id}
                                onClick={() => updateStatus(task.id, "completed")}
                              >
                                {acting === task.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                                {t("ops_complete_task", lang)}
                              </Button>
                            )}
                            {(task.status === "pending" || task.status === "in_progress") && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:text-destructive gap-1.5"
                                disabled={acting === task.id}
                                onClick={() => updateStatus(task.id, "cancelled")}
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                {t("ops_cancel_task", lang)}
                              </Button>
                            )}
                            {task.status === "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                disabled={acting === task.id}
                                onClick={() => updateStatus(task.id, "pending")}
                              >
                                {lang === "ar" ? "إعادة فتح" : "Reopen"}
                              </Button>
                            )}
                            {/* Camera button placeholder for future integration */}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1.5"
                              onClick={() => toast(lang === "ar" ? "تكامل الكاميرا قريبًا" : "Camera integration coming soon")}
                            >
                              <Camera className="h-3.5 w-3.5" />
                              {lang === "ar" ? "صورة" : "Photo"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </main>

      <footer className="mt-auto border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <BrandLogo />
            <p className="text-xs text-muted-foreground">{lang === "ar" ? "© 2026 فيا تريبس — بوابة الموظف" : "© 2026 Via Trips — Staff Portal"}</p>
            <Button variant="ghost" size="sm" onClick={() => setAuthScreen("landing")} className="gap-1.5 text-xs">
              <Back className="h-3 w-3" />
              {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card className="border-border/70">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
          <p className="text-xl sm:text-2xl font-bold tabular-nums">{value}</p>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">{label}</p>
      </CardContent>
    </Card>
  );
}
