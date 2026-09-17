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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PageHeader, EmptyState, StarRating } from "@/components/widgets";
import { carService, type CarCompany } from "@/services/car.service";
import { useApi } from "@/hooks/use-api";
import { Building2, Plus, Edit, Trash2, Phone, Mail, MapPin, Loader2, AlertCircle, Car as CarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export function CarCompaniesAdmin() {
  const lang = useAppStore((s) => s.lang);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CarCompany | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  const { data, loading, error, refetch } = useApi<CarCompany[]>(() => carService.listCompanies(), []);
  const companies = data ?? [];

  const handleDelete = async (c: CarCompany) => {
    if (!confirm(lang === "ar" ? `حذف "${c.name}"؟` : `Delete "${c.name}"?`)) return;
    setActing(c.id);
    try {
      await carService.removeCompany(c.id);
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
        title={t("cars_companies", lang)}
        subtitle={lang === "ar" ? "إدارة شركات تأجير السيارات" : "Manage car rental companies"}
        actions={
          <Button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" />
            {t("cars_add_company", lang)}
          </Button>
        }
      />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-5 w-2/3" />
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
      ) : companies.length === 0 ? (
        <Card>
          <CardContent className="p-2">
            <EmptyState icon={Building2} title={lang === "ar" ? "لا توجد شركات" : "No companies"} desc={lang === "ar" ? "أضف أول شركة" : "Add your first company"} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {companies.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">{c.name}</p>
                        {c.city && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />{c.city}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-2">
                          <StarRating rating={c.rating} size="sm" />
                          <span className="text-xs font-medium">{c.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    {c.description && <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{c.description}</p>}
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <CarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{c.carCount ?? 0} {lang === "ar" ? "سيارة" : "cars"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>{c.bookingCount ?? 0} {lang === "ar" ? "حجز" : "bookings"}</span>
                      </div>
                    </div>
                    {(c.phone || c.email) && (
                      <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
                        {c.phone && <p className="flex items-center gap-1" dir="ltr"><Phone className="h-3 w-3" />{c.phone}</p>}
                        {c.email && <p className="flex items-center gap-1 truncate" dir="ltr"><Mail className="h-3 w-3" />{c.email}</p>}
                      </div>
                    )}
                    <div className="flex gap-1.5 mt-3">
                      <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => { setEditing(c); setShowForm(true); }}>
                        <Edit className="h-3.5 w-3.5" />{t("edit", lang)}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" disabled={acting === c.id} onClick={() => handleDelete(c)}>
                        {acting === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <CompanyFormDialog open={showForm} company={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); refetch(); }} />
    </div>
  );
}

function CompanyFormDialog({ open, company, onClose, onSaved }: { open: boolean; company: CarCompany | null; onClose: () => void; onSaved: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: company?.name ?? "",
    description: company?.description ?? "",
    city: company?.city ?? "",
    phone: company?.phone ?? "",
    email: company?.email ?? "",
    rating: company?.rating ?? 4.5,
  });

  useState(() => {
    if (company) {
      setForm({
        name: company.name,
        description: company.description ?? "",
        city: company.city ?? "",
        phone: company.phone ?? "",
        email: company.email ?? "",
        rating: company.rating,
      });
    }
  });

  const handleSubmit = async () => {
    if (!form.name) {
      toast.error(lang === "ar" ? "الاسم مطلوب" : "Name is required");
      return;
    }
    setSaving(true);
    try {
      if (company) {
        await carService.updateCompany(company.id, form);
        toast.success(lang === "ar" ? "تم التحديث" : "Updated");
      } else {
        await carService.createCompany(form);
        toast.success(lang === "ar" ? "تمت الإضافة" : "Added");
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{company ? t("edit", lang) : t("cars_add_company", lang)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">{lang === "ar" ? "اسم الشركة" : "Company Name"}</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الوصف" : "Description"}</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">{t("cars_filter_city", lang)}</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">{lang === "ar" ? "التقييم" : "Rating"}</Label>
              <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">{t("phone", lang)}</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" />
            </div>
            <div>
              <Label className="text-xs">{t("email", lang)}</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} dir="ltr" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
          <Button onClick={handleSubmit} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {company ? (lang === "ar" ? "حفظ" : "Save") : (lang === "ar" ? "إضافة" : "Add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
