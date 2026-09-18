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
import { maintenanceService, type MaintenanceRequest } from "@/services/operations.service";
import { hotelService } from "@/services/hotel.service";
import { staffService, type Staff } from "@/services/staff.service";
import { useApi } from "@/hooks/use-api";
import { Wrench, Plus, Loader2, AlertCircle, MapPin, Clock, User, RefreshCw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const categories = [
  { key: "electrical", ar: "كهرباء", en: "Electrical" },
  { key: "plumbing", ar: "سباكة", en: "Plumbing" },
  { key: "hvac", ar: "تكييف", en: "HVAC" },
  { key: "furniture", ar: "أثاث", en: "Furniture" },
  { key: "appliance", ar: "أجهزة", en: "Appliance" },
  { key: "structural", ar: "هيكلي", en: "Structural" },
  { key: "other", ar: "أخرى", en: "Other" },
];

const priorities = ["low", "normal", "high", "urgent"];
const statuses = ["open", "in_progress", "resolved", "closed"];

const statusColors: Record<string, string> = {
  open: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  closed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  normal: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export function MaintenancePage() {
  const lang = useAppStore((s) => s.lang);
  const [filter, setFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

  const { data: requests, loading, error, refetch } = useApi<MaintenanceRequest[]>(
    () => maintenanceService.list(),
    [],
  );
  const { data: hotels } = useApi(() => hotelService.list(), []);
  const { data: staff } = useApi<Staff[]>(() => staffService.list(), []);

  const all = requests ?? [];
  const filtered = filter === "all" ? all : all.filter((r) => r.status === filter);

  const counts = {
    open: all.filter((r) => r.status === "open").length,
    in_progress: all.filter((r) => r.status === "in_progress").length,
    resolved: all.filter((r) => r.status === "resolved").length,
    urgent: all.filter((r) => r.priority === "urgent" && r.status !== "resolved" && r.status !== "closed").length,
  };

  const updateStatus = async (id: string, status: string) => {
    setActing(id);
    try {
      await maintenanceService.update(id, { status });
      toast.success(lang === "ar" ? "تم التحديث" : "Updated");
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setActing(null);
    }
  };

  const handleDelete = async (req: MaintenanceRequest) => {
    if (!confirm(lang === "ar" ? `حذف "${req.title}"؟` : `Delete "${req.title}"?`)) return;
    setActing(req.id);
    try {
      await maintenanceService.remove(req.id);
      toast.success(lang === "ar" ? "تم الحذف" : "Deleted");
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
        title={lang === "ar" ? "طلبات الصيانة" : "Maintenance Requests"}
        subtitle={lang === "ar" ? "إدارة ومتابعة طلبات الصيانة" : "Track and resolve maintenance issues"}
        actions={
          <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" />
            {lang === "ar" ? "طلب صيانة" : "New Request"}
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={AlertCircle} label={lang === "ar" ? "مفتوحة" : "Open"} value={counts.open} color="sand" delay={0} />
        <StatCard icon={Wrench} label={lang === "ar" ? "قيد التنفيذ" : "In Progress"} value={counts.in_progress} color="clay" delay={0.05} />
        <StatCard icon={RefreshCw} label={lang === "ar" ? "تم حلها" : "Resolved"} value={counts.resolved} color="accent" delay={0.1} />
        <StatCard icon={AlertCircle} label={lang === "ar" ? "عاجلة" : "Urgent"} value={counts.urgent} color="primary" delay={0.15} />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
        {["all", ...statuses].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors flex-shrink-0",
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
            )}
          >
            {f === "all" ? t("all", lang) : (lang === "ar" ? (f === "open" ? "مفتوحة" : f === "in_progress" ? "قيد التنفيذ" : f === "resolved" ? "تم حلها" : "مغلقة") : f.replace("_", " "))}
          </button>
        ))}
      </div>

      {loading ? (
        [1, 2, 3].map((i) => (
          <Card key={i}><CardContent className="p-4 space-y-2"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-3 w-1/2" /></CardContent></Card>
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
        <Card><CardContent className="p-2"><EmptyState icon={Wrench} title={lang === "ar" ? "لا طلبات" : "No requests"} /></CardContent></Card>
      ) : (
        <AnimatePresence>
          {filtered.map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, delay: i * 0.03 }}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0", req.priority === "urgent" ? "bg-red-500" : req.priority === "high" ? "bg-amber-500" : "bg-primary")}>
                      <Wrench className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="font-semibold text-base">{req.title}</h3>
                        <div className="flex gap-1.5">
                          <Badge className={cn("text-[10px] capitalize", priorityColors[req.priority])}>{req.priority}</Badge>
                          <Badge className={cn("text-[10px] capitalize", statusColors[req.status])}>{req.status.replace("_", " ")}</Badge>
                        </div>
                      </div>
                      {req.description && <p className="text-sm text-muted-foreground mt-1">{req.description}</p>}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                        {req.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{req.location}</span>}
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(req.reportedAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</span>
                        {req.staff && <span className="flex items-center gap-1"><User className="h-3 w-3" />{req.staff.name}</span>}
                        <span className="capitalize">{categories.find((c) => c.key === req.category)?.[lang === "ar" ? "ar" : "en"] ?? req.category}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {req.status === "open" && (
                          <Button size="sm" variant="outline" className="gap-1.5 text-amber-600" disabled={acting === req.id} onClick={() => updateStatus(req.id, "in_progress")}>
                            {acting === req.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                            {lang === "ar" ? "بدء العمل" : "Start Work"}
                          </Button>
                        )}
                        {req.status === "in_progress" && (
                          <Button size="sm" variant="outline" className="gap-1.5 text-emerald-600" disabled={acting === req.id} onClick={() => updateStatus(req.id, "resolved")}>
                            {lang === "ar" ? "تم الحل" : "Mark Resolved"}
                          </Button>
                        )}
                        {req.status !== "closed" && req.status !== "resolved" && (
                          <Button size="sm" variant="outline" className="gap-1.5 text-destructive hover:text-destructive" disabled={acting === req.id} onClick={() => updateStatus(req.id, "closed")}>
                            {lang === "ar" ? "إغلاق" : "Close"}
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="gap-1.5 text-destructive hover:text-destructive" disabled={acting === req.id} onClick={() => handleDelete(req)}>
                          <Trash2 className="h-3.5 w-3.5" />
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

      <MaintenanceFormDialog open={showForm} hotels={hotels ?? []} staff={staff ?? []} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); refetch(); }} />
    </div>
  );
}

function MaintenanceFormDialog({ open, hotels, staff, onClose, onSaved }: { open: boolean; hotels: any[]; staff: Staff[]; onClose: () => void; onSaved: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    hotelId: hotels[0]?.id ?? "",
    title: "",
    description: "",
    location: "",
    priority: "normal",
    category: "other",
    assignedTo: "",
  });

  const handleSubmit = async () => {
    if (!form.hotelId || !form.title) {
      toast.error(lang === "ar" ? "الفندق والعنوان مطلوبان" : "Hotel and title are required");
      return;
    }
    setSaving(true);
    try {
      await maintenanceService.create({ ...form, assignedTo: form.assignedTo || undefined });
      toast.success(lang === "ar" ? "تم إنشاء الطلب" : "Request created");
      setForm({ hotelId: form.hotelId, title: "", description: "", location: "", priority: "normal", category: "other", assignedTo: "" });
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
          <DialogTitle>{lang === "ar" ? "طلب صيانة جديد" : "New Maintenance Request"}</DialogTitle>
          <DialogDescription>{lang === "ar" ? "أدخل تفاصيل المشكلة" : "Enter issue details"}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">{lang === "ar" ? "العنوان" : "Title"}</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الوصف" : "Description"}</Label>
            <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">{lang === "ar" ? "الموقع" : "Location"}</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">{lang === "ar" ? "الفئة" : "Category"}</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.key} value={c.key}>{lang === "ar" ? c.ar : c.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">{lang === "ar" ? "الأولوية" : "Priority"}</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">{lang === "ar" ? "إسناد إلى" : "Assign To"}</Label>
              <Select value={form.assignedTo} onValueChange={(v) => setForm({ ...form, assignedTo: v })}>
                <SelectTrigger><SelectValue placeholder={lang === "ar" ? "غير مسند" : "Unassigned"} /></SelectTrigger>
                <SelectContent>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{lang === "ar" ? s.nameAr ?? s.name : s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
          <Button onClick={handleSubmit} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {lang === "ar" ? "إنشاء" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
