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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, EmptyState, formatCurrency } from "@/components/widgets";
import { carService, type Car, type CarCompany } from "@/services/car.service";
import { useApi } from "@/hooks/use-api";
import { Car as CarIcon, Plus, Edit, Trash2, Loader2, AlertCircle, Users, Fuel, Settings as SettingsIcon, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const categories = ["economy", "sedan", "suv", "luxury", "van", "sports"];
const transmissions = ["automatic", "manual"];
const fuels = ["petrol", "diesel", "hybrid", "electric"];

export function CarsAdmin() {
  const lang = useAppStore((s) => s.lang);
  const [companyId, setCompanyId] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Car | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  const { data: companies } = useApi<CarCompany[]>(() => carService.listCompanies(), []);
  const { data: cars, loading, error, refetch } = useApi<Car[]>(
    () => carService.list({ companyId: companyId !== "all" ? companyId : undefined }),
    [companyId],
  );

  const handleDelete = async (car: Car) => {
    if (!confirm(lang === "ar" ? `حذف ${car.make} ${car.model}؟` : `Delete ${car.make} ${car.model}?`)) return;
    setActing(car.id);
    try {
      await carService.remove(car.id);
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
        title={t("cars_cars", lang)}
        subtitle={lang === "ar" ? "إدارة أسطول السيارات" : "Manage your car fleet"}
        actions={
          <Button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" />
            {t("cars_add_car", lang)}
          </Button>
        }
      />

      <Select value={companyId} onValueChange={setCompanyId}>
        <SelectTrigger className="w-full sm:w-[280px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("all", lang)}</SelectItem>
          {(companies ?? []).map((c) => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-36 w-full rounded-none" />
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
      ) : (cars ?? []).length === 0 ? (
        <Card>
          <CardContent className="p-2">
            <EmptyState icon={CarIcon} title={lang === "ar" ? "لا سيارات" : "No cars"} desc={lang === "ar" ? "أضف أول سيارة" : "Add your first car"} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {(cars ?? []).map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-36 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center overflow-hidden">
                    {car.images[0] ? (
                       
                      <img src={car.images[0]} alt={car.make} className="w-full h-full object-cover" />
                    ) : (
                      <CarIcon className="h-12 w-12 text-white/40" />
                    )}
                    <div className="absolute top-2 start-2 flex gap-1">
                      <Badge className="text-[10px] capitalize">{car.category}</Badge>
                    </div>
                    <div className="absolute top-2 end-2">
                      <Badge className={cn(
                        "text-[10px]",
                        car.available ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                      )}>
                        {car.available ? (lang === "ar" ? "متاح" : "Available") : (lang === "ar" ? "محجوز" : "Rented")}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="font-semibold text-base">{car.make} {car.model}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{car.year} • {car.plateNumber}</p>
                    <div className="grid grid-cols-2 gap-1.5 mt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{car.seats}</span>
                      <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{t(`cars_${car.fuelType}` as any, lang)}</span>
                      <span className="flex items-center gap-1"><SettingsIcon className="h-3 w-3" />{t(`cars_${car.transmission}` as any, lang)}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{car.bookingCount ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                      <div>
                        <span className="text-[10px] text-muted-foreground">{lang === "ar" ? "يبدأ من" : "From"}</span>
                        <p className="font-bold text-primary">{formatCurrency(car.pricePerDay, lang)}<span className="text-[10px] text-muted-foreground font-normal">{t("cars_per_day", lang)}</span></p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setEditing(car); setShowForm(true); }}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" disabled={acting === car.id} onClick={() => handleDelete(car)}>
                          {acting === car.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <CarFormDialog open={showForm} car={editing} companies={companies ?? []} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); refetch(); }} />
    </div>
  );
}

function CarFormDialog({ open, car, companies, onClose, onSaved }: { open: boolean; car: Car | null; companies: CarCompany[]; onClose: () => void; onSaved: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyId: car?.companyId ?? companies[0]?.id ?? "",
    make: car?.make ?? "",
    model: car?.model ?? "",
    year: car?.year ?? new Date().getFullYear(),
    plateNumber: car?.plateNumber ?? "",
    category: car?.category ?? "economy",
    transmission: car?.transmission ?? "automatic",
    seats: car?.seats ?? 5,
    doors: car?.doors ?? 4,
    bags: car?.bags ?? 2,
    ac: car?.ac ?? true,
    fuelType: car?.fuelType ?? "petrol",
    pricePerDay: car?.pricePerDay ?? 200,
    deposit: car?.deposit ?? 500,
    color: car?.color ?? "",
    mileage: car?.mileage ?? 0,
    available: car?.available ?? true,
  });

  useState(() => {
    if (car) {
      setForm({
        companyId: car.companyId,
        make: car.make,
        model: car.model,
        year: car.year,
        plateNumber: car.plateNumber ?? "",
        category: car.category,
        transmission: car.transmission,
        seats: car.seats,
        doors: car.doors,
        bags: car.bags,
        ac: car.ac,
        fuelType: car.fuelType,
        pricePerDay: car.pricePerDay,
        deposit: car.deposit,
        color: car.color ?? "",
        mileage: car.mileage ?? 0,
        available: car.available,
      });
    }
  });

  const handleSubmit = async () => {
    if (!form.companyId || !form.make || !form.model) {
      toast.error(lang === "ar" ? "الشركة والماركة والموديل مطلوبة" : "Company, make, and model are required");
      return;
    }
    setSaving(true);
    try {
      if (car) {
        await carService.update(car.id, form);
        toast.success(lang === "ar" ? "تم التحديث" : "Updated");
      } else {
        await carService.create(form);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{car ? t("edit", lang) : t("cars_add_car", lang)}</DialogTitle>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <Label className="text-xs">{lang === "ar" ? "الشركة" : "Company"}</Label>
            <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v })}>
              <SelectTrigger><SelectValue placeholder={lang === "ar" ? "اختر الشركة" : "Select company"} /></SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{t("cars_make", lang)}</Label>
            <Input value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">{t("cars_model", lang)}</Label>
            <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">{t("cars_year", lang)}</Label>
            <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{t("cars_plate", lang)}</Label>
            <Input value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الفئة" : "Category"}</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{t("cars_transmission", lang)}</Label>
            <Select value={form.transmission} onValueChange={(v) => setForm({ ...form, transmission: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {transmissions.map((tr) => (
                  <SelectItem key={tr} value={tr}>{t(`cars_${tr}` as any, lang)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{t("cars_fuel", lang)}</Label>
            <Select value={form.fuelType} onValueChange={(v) => setForm({ ...form, fuelType: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {fuels.map((f) => (
                  <SelectItem key={f} value={f}>{t(`cars_${f}` as any, lang)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{t("cars_seats", lang)}</Label>
            <Input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "السعر/يوم (ر.س)" : "Price/Day (SAR)"}</Label>
            <Input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{t("cars_deposit", lang)} (SAR)</Label>
            <Input type="number" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: Number(e.target.value) })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "اللون" : "Color"}</Label>
            <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "المسافة (كم)" : "Mileage (km)"}</Label>
            <Input type="number" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: Number(e.target.value) })} dir="ltr" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
          <Button onClick={handleSubmit} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {car ? (lang === "ar" ? "حفظ" : "Save") : (lang === "ar" ? "إضافة" : "Add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
