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
import { PageHeader, StatCard, formatCurrency, EmptyState } from "@/components/widgets";
import { guestProfileService, type GuestProfile } from "@/services/operations.service";
import { useApi } from "@/hooks/use-api";
import { Users, Plus, Loader2, AlertCircle, Mail, Phone, Globe, Star, MapPin, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const vipColors: Record<string, string> = {
  regular: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  silver: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  gold: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  platinum: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

export function GuestsPage() {
  const lang = useAppStore((s) => s.lang);
  const [search, setSearch] = useState("");
  const [vipFilter, setVipFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);

  const { data: guests, loading, error, refetch } = useApi<GuestProfile[]>(
    () => guestProfileService.list({ search, vipStatus: vipFilter === "all" ? undefined : vipFilter }),
    [search, vipFilter],
  );

  const all = guests ?? [];
  const totalGuests = all.length;
  const vipCount = all.filter((g) => g.vipStatus !== "regular").length;
  const totalRevenue = all.reduce((sum, g) => sum + g.totalSpent, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "ar" ? "الضيوف" : "Guests"}
        subtitle={lang === "ar" ? "ملفات الضيوف وتاريخ الإقامة" : "Guest profiles and stay history"}
        actions={
          <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" />
            {lang === "ar" ? "ضيف جديد" : "Add Guest"}
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Users} label={lang === "ar" ? "إجمالي الضيوف" : "Total Guests"} value={totalGuests} color="primary" delay={0} />
        <StatCard icon={Star} label={lang === "ar" ? "ضيوف VIP" : "VIP Guests"} value={vipCount} color="accent" delay={0.05} />
        <StatCard icon={Globe} label={lang === "ar" ? "إجمالي الإنفاق" : "Total Revenue"} value={formatCurrency(totalRevenue, lang)} color="clay" delay={0.1} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder={lang === "ar" ? "ابحث بالاسم أو البريد أو الهاتف..." : "Search by name, email, or phone..."} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
        </div>
        <Select value={vipFilter} onValueChange={setVipFilter}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang === "ar" ? "الكل" : "All"}</SelectItem>
            <SelectItem value="regular">{lang === "ar" ? "عادي" : "Regular"}</SelectItem>
            <SelectItem value="silver">Silver</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
            <SelectItem value="platinum">Platinum</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}><CardContent className="p-4 space-y-2"><Skeleton className="h-12 w-12 rounded-full" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /></CardContent></Card>
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
      ) : all.length === 0 ? (
        <Card><CardContent className="p-2"><EmptyState icon={Users} title={lang === "ar" ? "لا ضيوف" : "No guests"} desc={lang === "ar" ? "أضف أول ضيف" : "Add your first guest"} /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {all.map((g, i) => (
              <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25, delay: i * 0.03 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0",
                        g.vipStatus === "platinum" ? "bg-gradient-to-br from-purple-500 to-purple-700" :
                        g.vipStatus === "gold" ? "bg-gradient-to-br from-amber-400 to-amber-600" :
                        g.vipStatus === "silver" ? "bg-gradient-to-br from-gray-400 to-gray-600" :
                        "bg-gradient-to-br from-blue-500 to-indigo-700")}>
                        {g.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-base leading-snug break-words" dir="auto">{lang === "ar" ? g.nameAr ?? g.name : g.name}</p>
                          {g.vipStatus !== "regular" && (
                            <Badge className={cn("text-[10px] capitalize", vipColors[g.vipStatus])}>{g.vipStatus}</Badge>
                          )}
                        </div>
                        {g.email && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate" dir="ltr"><Mail className="h-3 w-3" />{g.email}</p>}
                        {g.phone && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5" dir="ltr"><Phone className="h-3 w-3" />{g.phone}</p>}
                        {g.nationality && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{g.nationality}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border text-xs">
                      <div>
                        <p className="text-muted-foreground">{lang === "ar" ? "زيارات" : "Stays"}</p>
                        <p className="font-semibold mt-0.5">{g.totalStays}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{lang === "ar" ? "الإنفاق" : "Spent"}</p>
                        <p className="font-semibold mt-0.5">{formatCurrency(g.totalSpent, lang)}</p>
                      </div>
                    </div>
                    {g.preferences.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {g.preferences.slice(0, 3).map((p) => (
                          <Badge key={p} variant="outline" className="text-[10px] font-normal">{p}</Badge>
                        ))}
                      </div>
                    )}
                    {g.blacklisted && (
                      <div className="mt-2 p-2 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                        <p className="text-xs text-red-700 dark:text-red-300">{lang === "ar" ? "محظور" : "Blacklisted"}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <GuestFormDialog open={showForm} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); refetch(); }} />
    </div>
  );
}

function GuestFormDialog({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    nameAr: "",
    email: "",
    phone: "",
    nationality: "",
    gender: "male",
    vipStatus: "regular",
    city: "",
    country: "",
    preferences: "",
    dietaryNeeds: "none",
    notes: "",
  });

  const handleSubmit = async () => {
    if (!form.name) {
      toast.error(lang === "ar" ? "الاسم مطلوب" : "Name is required");
      return;
    }
    setSaving(true);
    try {
      await guestProfileService.create({
        ...form,
        preferences: form.preferences.split(",").map((s) => s.trim()).filter(Boolean),
      });
      toast.success(lang === "ar" ? "تمت إضافة الضيف" : "Guest added");
      setForm({ name: "", nameAr: "", email: "", phone: "", nationality: "", gender: "male", vipStatus: "regular", city: "", country: "", preferences: "", dietaryNeeds: "none", notes: "" });
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
          <DialogTitle>{lang === "ar" ? "ضيف جديد" : "Add Guest"}</DialogTitle>
          <DialogDescription>{lang === "ar" ? "أدخل بيانات الضيف" : "Enter guest information"}</DialogDescription>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">{lang === "ar" ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الاسم (عربي)" : "Name (Arabic)"}</Label>
            <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} dir="rtl" />
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الهاتف" : "Phone"}</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الجنسية" : "Nationality"}</Label>
            <Input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الجنس" : "Gender"}</Label>
            <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{lang === "ar" ? "ذكر" : "Male"}</SelectItem>
                <SelectItem value="female">{lang === "ar" ? "أنثى" : "Female"}</SelectItem>
                <SelectItem value="other">{lang === "ar" ? "أخرى" : "Other"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">VIP Status</Label>
            <Select value={form.vipStatus} onValueChange={(v) => setForm({ ...form, vipStatus: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">{lang === "ar" ? "عادي" : "Regular"}</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "المدينة" : "City"}</Label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">{lang === "ar" ? "تفضيلات (مفصولة بفواصل)" : "Preferences (comma-separated)"}</Label>
            <Input value={form.preferences} onChange={(e) => setForm({ ...form, preferences: e.target.value })} placeholder="non-smoking, high floor, quiet" dir="ltr" />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">{lang === "ar" ? "ملاحظات" : "Notes"}</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
          <Button onClick={handleSubmit} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {lang === "ar" ? "إضافة" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
