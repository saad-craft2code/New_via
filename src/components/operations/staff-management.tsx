"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, StatCard, EmptyState, formatCurrency } from "@/components/widgets";
import { staffService, type Staff } from "@/services/staff.service";
import { useApi } from "@/hooks/use-api";
import { Users, Plus, Search, Mail, Phone, Briefcase, Edit, Trash2, Loader2, AlertCircle, UserCheck, UserX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const departments = ["housekeeping", "maintenance", "front_desk", "security", "kitchen", "logistics"];
const roles = ["staff", "supervisor", "manager"];

export function StaffManagement() {
  const lang = useAppStore((s) => s.lang);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [saving, setSaving] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

  const { data, loading, error, refetch } = useApi<Staff[]>(
    () => staffService.list(),
    [],
  );
  const staffList = data ?? [];

  const filtered = staffList.filter((s) => {
    if (department !== "all" && s.department !== department) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalSalaries = staffList.reduce((sum, s) => sum + s.baseSalary, 0);
  const activeCount = staffList.filter((s) => s.isActive).length;
  const inactiveCount = staffList.length - activeCount;

  const handleToggleActive = async (staff: Staff) => {
    setActing(staff.id);
    try {
      await staffService.update(staff.id, { isActive: !staff.isActive });
      toast.success(lang === "ar" ? "تم التحديث" : "Updated");
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setActing(null);
    }
  };

  const handleDelete = async (staff: Staff) => {
    if (!confirm(lang === "ar" ? `حذف "${staff.name}"؟` : `Delete "${staff.name}"?`)) return;
    setActing(staff.id);
    try {
      await staffService.remove(staff.id);
      toast.success(lang === "ar" ? "تم حذف الموظف" : "Staff deleted");
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
        title={t("ops_staff_title", lang)}
        subtitle={t("ops_staff_subtitle", lang)}
        actions={
          <Button onClick={() => { setEditing(null); setShowAdd(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" />
            {t("ops_add_staff", lang)}
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label={lang === "ar" ? "إجمالي الموظفين" : "Total Staff"} value={staffList.length} color="primary" delay={0} />
        <StatCard icon={UserCheck} label={t("ops_active", lang)} value={activeCount} color="accent" delay={0.05} />
        <StatCard icon={UserX} label={t("ops_inactive", lang)} value={inactiveCount} color="clay" delay={0.1} />
        <StatCard icon={Briefcase} label={lang === "ar" ? "إجمالي الرواتب الشهرية" : "Monthly Salaries"} value={formatCurrency(totalSalaries, lang)} color="sand" delay={0.15} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={lang === "ar" ? "ابحث بالاسم أو البريد..." : "Search by name or email..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9"
          />
        </div>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-full sm:w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all", lang)}</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>{t(`ops_${d}` as any, lang)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-8 w-full" />
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
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-2">
            <EmptyState icon={Users} title={t("ops_no_staff", lang)} desc={lang === "ar" ? "أضف أول موظف لفريقك" : "Add your first staff member"} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {s.avatarUrl ? (
                        <img src={s.avatarUrl} alt={s.name} className="h-12 w-12 rounded-xl object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center text-white font-bold">
                          {s.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base leading-snug break-words" dir="auto">{lang === "ar" ? s.nameAr ?? s.name : s.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3" />
                          <span className="truncate" dir="ltr">{s.email}</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <Badge variant="outline" className="text-[10px]">{t(`ops_${s.department}` as any, lang)}</Badge>
                          <Badge variant="secondary" className="text-[10px] capitalize">{t(`ops_staff_role_${s.role}` as any, lang)}</Badge>
                          <Badge className={cn("text-[10px]", s.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300")}>
                            {s.isActive ? t("ops_active", lang) : t("ops_inactive", lang)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {s.phone && (
                      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5" dir="ltr">
                        <Phone className="h-3 w-3" /> {s.phone}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border text-xs">
                      <div>
                        <p className="text-muted-foreground">{t("ops_base_salary", lang)}</p>
                        <p className="font-semibold mt-0.5">{formatCurrency(s.baseSalary, lang)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{lang === "ar" ? "المهام النشطة" : "Active Tasks"}</p>
                        <p className="font-semibold mt-0.5">
                          {((s.taskStats?.pending ?? 0) + (s.taskStats?.in_progress ?? 0))} / {s.taskStats ? Object.values(s.taskStats).reduce((a, b) => a + b, 0) : 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1.5 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5"
                        onClick={() => { setEditing(s); setShowAdd(true); }}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        {t("edit", lang)}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={acting === s.id}
                        onClick={() => handleToggleActive(s)}
                      >
                        {acting === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : s.isActive ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        disabled={acting === s.id}
                        onClick={() => handleDelete(s)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit dialog */}
      <StaffFormDialog
        open={showAdd}
        staff={editing}
        onClose={() => { setShowAdd(false); setEditing(null); }}
        onSaved={() => { setShowAdd(false); setEditing(null); refetch(); }}
      />
    </div>
  );
}

function StaffFormDialog({ open, staff, onClose, onSaved }: { open: boolean; staff: Staff | null; onClose: () => void; onSaved: () => void; }) {
  const lang = useAppStore((s) => s.lang);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    email: staff?.email ?? "",
    name: staff?.name ?? "",
    nameAr: staff?.nameAr ?? "",
    phone: staff?.phone ?? "",
    role: staff?.role ?? "staff",
    department: staff?.department ?? "housekeeping",
    baseSalary: staff?.baseSalary ?? 3000,
    hourlyRate: staff?.hourlyRate ?? 25,
    isActive: staff?.isActive ?? true,
  });

  // Reset form when staff prop changes
  useState(() => {
    if (staff) {
      setForm({
        email: staff.email,
        name: staff.name,
        nameAr: staff.nameAr ?? "",
        phone: staff.phone ?? "",
        role: staff.role,
        department: staff.department,
        baseSalary: staff.baseSalary,
        hourlyRate: staff.hourlyRate,
        isActive: staff.isActive,
      });
    }
  });

  const handleSubmit = async () => {
    if (!form.email || !form.name) {
      toast.error(lang === "ar" ? "البريد والاسم مطلوبان" : "Email and name are required");
      return;
    }
    setSaving(true);
    try {
      if (staff) {
        await staffService.update(staff.id, form);
        toast.success(lang === "ar" ? "تم تحديث الموظف" : "Staff updated");
      } else {
        await staffService.create(form);
        toast.success(lang === "ar" ? "تمت إضافة الموظف" : "Staff added");
      }
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
          <DialogTitle>{staff ? t("ops_edit_staff", lang) : t("ops_add_staff", lang)}</DialogTitle>
          <DialogDescription>{staff?.name}</DialogDescription>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">{lang === "ar" ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الاسم (عربي)" : "Name (Arabic)"}</Label>
            <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} dir="rtl" />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">{t("email", lang)}</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} dir="ltr" disabled={!!staff} />
          </div>
          <div>
            <Label className="text-xs">{t("phone", lang)}</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{t("ops_department", lang)}</Label>
            <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>{t(`ops_${d}` as any, lang)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{t("ops_role", lang)}</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>{t(`ops_staff_role_${r}` as any, lang)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{t("ops_base_salary", lang)} (SAR)</Label>
            <Input type="number" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: Number(e.target.value) })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{t("ops_hourly_rate", lang)} (SAR)</Label>
            <Input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })} dir="ltr" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
          <Button onClick={handleSubmit} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {staff ? (lang === "ar" ? "حفظ" : "Save") : (lang === "ar" ? "إضافة" : "Add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
