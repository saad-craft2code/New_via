"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { PageHeader, StatCard, formatCurrency, EmptyState } from "@/components/widgets";
import { checkInService, type CheckIn } from "@/services/operations.service";
import { hotelService } from "@/services/hotel.service";
import { useApi } from "@/hooks/use-api";
import { LogIn, LogOut, Plus, Loader2, AlertCircle, Users, Clock, Key, DollarSign, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export function FrontDesk() {
  const lang = useAppStore((s) => s.lang);
  const [filter, setFilter] = useState<"all" | "checked_in" | "checked_out">("all");
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

  const { data: checkIns, loading, error, refetch } = useApi<CheckIn[]>(
    () => checkInService.list(),
    [],
  );
  const { data: hotels } = useApi(() => hotelService.list(), []);
  const allCheckIns = checkIns ?? [];

  const filtered = filter === "all" ? allCheckIns : allCheckIns.filter((c) => c.status === filter);

  const activeCount = allCheckIns.filter((c) => c.status === "checked_in").length;
  const checkedOutCount = allCheckIns.filter((c) => c.status === "checked_out").length;

  const checkOut = async (id: string) => {
    setActing(id);
    try {
      await checkInService.update(id, { status: "checked_out" });
      toast.success(lang === "ar" ? "تم تسجيل المغادرة" : "Checked out successfully");
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
        title={lang === "ar" ? "الاستقبال" : "Front Desk"}
        subtitle={lang === "ar" ? "إدارة تسجيل الوصول والمغادرة" : "Manage check-ins and check-outs"}
        actions={
          <Button onClick={() => setShowCheckIn(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <LogIn className="h-4 w-4" />
            {lang === "ar" ? "تسجيل وصول" : "New Check-in"}
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Users} label={lang === "ar" ? "نزلاء حاليون" : "Active Guests"} value={activeCount} color="primary" delay={0} />
        <StatCard icon={LogIn} label={lang === "ar" ? "إجمالي الوصولات" : "Total Check-ins"} value={allCheckIns.length} color="accent" delay={0.05} />
        <StatCard icon={LogOut} label={lang === "ar" ? "تمت المغادرة" : "Checked Out"} value={checkedOutCount} color="clay" delay={0.1} />
      </div>

      <div className="flex items-center gap-2">
        {(["all", "checked_in", "checked_out"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors",
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
            )}
          >
            {f === "all" ? t("all", lang) : f === "checked_in" ? (lang === "ar" ? "حالي" : "Active") : (lang === "ar" ? "غادر" : "Checked Out")}
          </button>
        ))}
      </div>

      {loading ? (
        [1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
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
            <EmptyState icon={LogIn} title={lang === "ar" ? "لا توجد تسجيلات" : "No check-ins"} desc={lang === "ar" ? "سجّل أول وصول" : "Create your first check-in"} />
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className={cn(
                      "h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0",
                      c.status === "checked_in" ? "bg-emerald-500" : "bg-gray-400"
                    )}>
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-semibold text-base">{c.guestName}</p>
                          <p className="text-xs text-muted-foreground">{c.hotel?.name} • {c.room?.roomType ?? "—"} • <span dir="ltr">{c.id}</span></p>
                        </div>
                        <Badge className={cn(
                          "text-[10px]",
                          c.status === "checked_in" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
                          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        )}>
                          {c.status === "checked_in" ? (lang === "ar" ? "حالي" : "Active") : (lang === "ar" ? "غادر" : "Checked Out")}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(c.checkInAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                        {c.roomNumber && <span className="flex items-center gap-1"><Key className="h-3 w-3" />{lang === "ar" ? "غرفة" : "Room"} {c.roomNumber}</span>}
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{c.numGuests}</span>
                        {c.depositCollected > 0 && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{formatCurrency(c.depositCollected, lang)}</span>}
                      </div>
                      {c.specialRequests && (
                        <p className="text-xs mt-2 p-2 rounded-md bg-muted/40"><span className="font-medium">{lang === "ar" ? "طلبات خاصة:" : "Special requests:"}</span> {c.specialRequests}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {c.status === "checked_in" && (
                          <Button size="sm" variant="outline" className="gap-1.5 text-orange-600 hover:text-orange-700" disabled={acting === c.id} onClick={() => checkOut(c.id)}>
                            {acting === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
                            {lang === "ar" ? "تسجيل مغادرة" : "Check Out"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* New check-in dialog */}
      <CheckInDialog
        open={showCheckIn}
        hotels={hotels ?? []}
        onClose={() => setShowCheckIn(false)}
        onSaved={() => { setShowCheckIn(false); refetch(); }}
      />
    </div>
  );
}

function CheckInDialog({ open, hotels, onClose, onSaved }: { open: boolean; hotels: any[]; onClose: () => void; onSaved: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    hotelId: hotels[0]?.id ?? "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomNumber: "",
    numGuests: 1,
    keyCardCount: 1,
    depositCollected: 0,
    expectedCheckOut: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    specialRequests: "",
  });

  // Update hotelId when hotels load
  useState(() => {
    if (hotels[0] && !form.hotelId) {
      setForm((p) => ({ ...p, hotelId: hotels[0].id }));
    }
  });

  const handleSubmit = async () => {
    if (!form.hotelId || !form.guestName) {
      toast.error(lang === "ar" ? "الفندق واسم الضيف مطلوبان" : "Hotel and guest name are required");
      return;
    }
    setSaving(true);
    try {
      await checkInService.create({
        ...form,
        numGuests: Number(form.numGuests),
        keyCardCount: Number(form.keyCardCount),
        depositCollected: Number(form.depositCollected),
      });
      toast.success(lang === "ar" ? "تم تسجيل الوصول" : "Check-in created");
      setForm({ hotelId: form.hotelId, guestName: "", guestEmail: "", guestPhone: "", roomNumber: "", numGuests: 1, keyCardCount: 1, depositCollected: 0, expectedCheckOut: new Date(Date.now() + 86400000).toISOString().slice(0, 10), specialRequests: "" });
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
          <DialogTitle>{lang === "ar" ? "تسجيل وصول جديد" : "New Check-in"}</DialogTitle>
          <DialogDescription>{lang === "ar" ? "أدخل بيانات الضيف" : "Enter guest details"}</DialogDescription>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <Label className="text-xs">{lang === "ar" ? "اسم الضيف" : "Guest Name"}</Label>
            <Input value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input type="email" value={form.guestEmail} onChange={(e) => setForm({ ...form, guestEmail: e.target.value })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الهاتف" : "Phone"}</Label>
            <Input value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "رقم الغرفة" : "Room Number"}</Label>
            <Input value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "عدد الضيوف" : "Number of Guests"}</Label>
            <Input type="number" min={1} value={form.numGuests} onChange={(e) => setForm({ ...form, numGuests: Number(e.target.value) })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "عدد بطاقات المفتاح" : "Key Cards"}</Label>
            <Input type="number" min={1} value={form.keyCardCount} onChange={(e) => setForm({ ...form, keyCardCount: Number(e.target.value) })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "التأمين (ر.س)" : "Deposit (SAR)"}</Label>
            <Input type="number" min={0} value={form.depositCollected} onChange={(e) => setForm({ ...form, depositCollected: Number(e.target.value) })} dir="ltr" />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">{lang === "ar" ? "تاريخ المغادرة المتوقع" : "Expected Check-out"}</Label>
            <Input type="date" value={form.expectedCheckOut} onChange={(e) => setForm({ ...form, expectedCheckOut: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">{lang === "ar" ? "طلبات خاصة" : "Special Requests"}</Label>
            <Textarea rows={2} value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
          <Button onClick={handleSubmit} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {lang === "ar" ? "تسجيل الوصول" : "Check In"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
