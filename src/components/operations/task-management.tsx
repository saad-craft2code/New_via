"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, StatCard, EmptyState } from "@/components/widgets";
import { staffService, type StaffTask, type Staff } from "@/services/staff.service";
import { useApi } from "@/hooks/use-api";
import { ClipboardList, Plus, Search, MapPin, Clock, Loader2, AlertCircle, Play, CheckCircle2, XCircle, Calendar, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const taskTypes = ["cleaning", "maintenance", "delivery", "inspection", "setup", "other"];
const priorities = ["low", "normal", "high", "urgent"];
const statuses = ["pending", "in_progress", "completed", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  normal: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export function TaskManagement() {
  const lang = useAppStore((s) => s.lang);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showAssign, setShowAssign] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

  const { data: tasks, loading, error, refetch } = useApi<StaffTask[]>(
    () => staffService.listTasks(),
    [],
  );
  const { data: staffList } = useApi<Staff[]>(() => staffService.list(), []);
  const allTasks = tasks ?? [];

  const filtered = allTasks.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !(t.staff?.name ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    pending: allTasks.filter((t) => t.status === "pending").length,
    in_progress: allTasks.filter((t) => t.status === "in_progress").length,
    completed: allTasks.filter((t) => t.status === "completed").length,
    urgent: allTasks.filter((t) => t.priority === "urgent" && t.status !== "completed" && t.status !== "cancelled").length,
  };

  const updateStatus = async (id: string, status: string) => {
    setActing(id);
    try {
      await staffService.updateTask(id, { status });
      toast.success(lang === "ar" ? "تم التحديث" : "Updated");
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setActing(null);
    }
  };

  const handleDelete = async (task: StaffTask) => {
    if (!confirm(lang === "ar" ? `حذف "${task.title}"؟` : `Delete "${task.title}"?`)) return;
    setActing(task.id);
    try {
      await staffService.deleteTask(task.id);
      toast.success(lang === "ar" ? "تم حذف المهمة" : "Task deleted");
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("ops_tasks_title", lang)}
        subtitle={t("ops_tasks_subtitle", lang)}
        actions={
          <Button onClick={() => setShowAssign(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" />
            {t("ops_assign_task", lang)}
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label={t("ops_status_pending", lang)} value={counts.pending} color="clay" delay={0} />
        <StatCard icon={Play} label={t("ops_status_in_progress", lang)} value={counts.in_progress} color="primary" delay={0.05} />
        <StatCard icon={CheckCircle2} label={t("ops_status_completed", lang)} value={counts.completed} color="accent" delay={0.1} />
        <StatCard icon={AlertCircle} label={t("ops_priority_urgent", lang)} value={counts.urgent} color="sand" delay={0.15} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={lang === "ar" ? "ابحث بالعنوان أو اسم الموظف..." : "Search by title or staff..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
          {["all", ...statuses].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors",
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
              )}
            >
              {f === "all" ? t("all", lang) : t(`ops_status_${f}` as any, lang)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        [1, 2, 3, 4].map((i) => (
          <Card key={i} className="mb-3">
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-2 mt-2">
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
          <CardContent className="p-2">
            <EmptyState icon={ClipboardList} title={t("ops_no_tasks", lang)} desc={lang === "ar" ? "أنشئ أول مهمة" : "Create your first task"} />
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          {filtered.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0", task.priority === "urgent" ? "bg-red-500" : task.priority === "high" ? "bg-amber-500" : "bg-primary")}>
                      <ClipboardList className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="font-semibold text-base">{task.title}</h3>
                        <div className="flex gap-1.5">
                          <Badge className={cn("text-[10px] capitalize", priorityColors[task.priority])}>{t(`ops_priority_${task.priority}` as any, lang)}</Badge>
                          <Badge className={cn("text-[10px] capitalize", statusColors[task.status])}>{t(`ops_status_${task.status}` as any, lang)}</Badge>
                        </div>
                      </div>
                      {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {t("ops_task_assigned_to", lang)}: <span className="font-medium">{lang === "ar" ? task.staff?.nameAr ?? task.staff?.name : task.staff?.name}</span>
                        </span>
                        {task.location && (
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{task.location}</span>
                        )}
                        {task.dueAt && (
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(task.dueAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {task.status === "pending" && (
                          <Button size="sm" variant="outline" className="gap-1.5 text-blue-600" disabled={acting === task.id} onClick={() => updateStatus(task.id, "in_progress")}>
                            {acting === task.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                            {t("ops_start_task", lang)}
                          </Button>
                        )}
                        {task.status === "in_progress" && (
                          <Button size="sm" variant="outline" className="gap-1.5 text-emerald-600" disabled={acting === task.id} onClick={() => updateStatus(task.id, "completed")}>
                            {acting === task.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            {t("ops_complete_task", lang)}
                          </Button>
                        )}
                        {(task.status === "pending" || task.status === "in_progress") && (
                          <Button size="sm" variant="outline" className="gap-1.5 text-destructive hover:text-destructive" disabled={acting === task.id} onClick={() => updateStatus(task.id, "cancelled")}>
                            <XCircle className="h-3.5 w-3.5" />
                            {t("ops_cancel_task", lang)}
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="gap-1.5 text-destructive hover:text-destructive" disabled={acting === task.id} onClick={() => handleDelete(task)}>
                          <XCircle className="h-3.5 w-3.5" />
                          {lang === "ar" ? "حذف" : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Assign Task Dialog */}
      <AssignTaskDialog
        open={showAssign}
        staffList={staffList ?? []}
        onClose={() => setShowAssign(false)}
        onSaved={() => { setShowAssign(false); refetch(); }}
      />
    </div>
  );
}

function AssignTaskDialog({ open, staffList, onClose, onSaved }: { open: boolean; staffList: Staff[]; onClose: () => void; onSaved: () => void; }) {
  const lang = useAppStore((s) => s.lang);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    staffId: "",
    type: "cleaning",
    title: "",
    description: "",
    location: "",
    priority: "normal",
    dueAt: "",
  });

  const handleSubmit = async () => {
    if (!form.staffId || !form.title) {
      toast.error(lang === "ar" ? "الموظف والعنوان مطلوبان" : "Staff and title are required");
      return;
    }
    setSaving(true);
    try {
      await staffService.assignTask({
        ...form,
        dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : undefined,
      });
      toast.success(lang === "ar" ? "تم إسناد المهمة" : "Task assigned");
      setForm({ staffId: "", type: "cleaning", title: "", description: "", location: "", priority: "normal", dueAt: "" });
      onSaved();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("ops_assign_task", lang)}</DialogTitle>
          <DialogDescription>{t("ops_tasks_subtitle", lang)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">{t("ops_task_assigned_to", lang)}</Label>
            <Select value={form.staffId} onValueChange={(v) => setForm({ ...form, staffId: v })}>
              <SelectTrigger><SelectValue placeholder={lang === "ar" ? "اختر الموظف" : "Select staff"} /></SelectTrigger>
              <SelectContent>
                {staffList.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {lang === "ar" ? s.nameAr ?? s.name : s.name} — {t(`ops_${s.department}` as any, lang)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "عنوان المهمة" : "Task Title"}</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الوصف" : "Description"}</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">{lang === "ar" ? "النوع" : "Type"}</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {taskTypes.map((t2) => (
                    <SelectItem key={t2} value={t2}>{t(`ops_task_${t2}` as any, lang)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">{lang === "ar" ? "الأولوية" : "Priority"}</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>{t(`ops_priority_${p}` as any, lang)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">{t("ops_task_location", lang)}</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">{t("ops_task_due", lang)}</Label>
              <Input type="date" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
          <Button onClick={handleSubmit} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {lang === "ar" ? "إسناد" : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
