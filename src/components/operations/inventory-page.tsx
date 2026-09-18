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
import { PageHeader, StatCard, formatCurrency, EmptyState } from "@/components/widgets";
import { inventoryService, type InventoryItem } from "@/services/operations.service";
import { hotelService } from "@/services/hotel.service";
import { useApi } from "@/hooks/use-api";
import { Package, Plus, Loader2, AlertCircle, Search, TrendingDown, TrendingUp, RefreshCw, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const categories = [
  { key: "linens", ar: "البياضات", en: "Linens" },
  { key: "toiletries", ar: "مستحضرات التجميل", en: "Toiletries" },
  { key: "cleaning", ar: "مواد التنظيف", en: "Cleaning" },
  { key: "food", ar: "طعام", en: "Food" },
  { key: "beverage", ar: "مشروبات", en: "Beverage" },
  { key: "office", ar: "مكتبي", en: "Office" },
  { key: "other", ar: "أخرى", en: "Other" },
];

const units = ["piece", "box", "kg", "liter", "roll", "set"];

export function InventoryPage() {
  const lang = useAppStore((s) => s.lang);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

  const { data: items, loading, error, refetch } = useApi<InventoryItem[]>(
    () => inventoryService.list({ category: category === "all" ? undefined : category, lowStock: showLowOnly ? "true" : undefined }),
    [category, showLowOnly],
  );
  const { data: hotels } = useApi(() => hotelService.list(), []);

  const all = items ?? [];
  const filtered = search
    ? all.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || (i.supplier ?? "").toLowerCase().includes(search.toLowerCase()))
    : all;

  const lowStockCount = all.filter((i) => i.lowStock).length;
  const totalValue = all.reduce((sum, i) => sum + i.stockValue, 0);

  const restock = async (item: InventoryItem) => {
    const qty = Number(prompt(lang === "ar" ? `كم تريد إضافتها لـ "${item.name}"؟` : `How many to add to "${item.name}"?`, "50") ?? 0);
    if (qty <= 0) return;
    setActing(item.id);
    try {
      await inventoryService.update(item.id, { restockQty: qty, reason: lang === "ar" ? "إعادة تخزين" : "Restock" });
      toast.success(lang === "ar" ? "تمت إعادة التخزين" : "Restocked");
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setActing(null);
    }
  };

  const consume = async (item: InventoryItem) => {
    const qty = Number(prompt(lang === "ar" ? `كم تم استهلاكه من "${item.name}"؟` : `How many consumed from "${item.name}"?`, "1") ?? 0);
    if (qty <= 0) return;
    setActing(item.id);
    try {
      await inventoryService.update(item.id, { consumeQty: qty, reason: lang === "ar" ? "استهلاك" : "Consumed" });
      toast.success(lang === "ar" ? "تم التحديث" : "Updated");
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
        title={lang === "ar" ? "المخزون" : "Inventory"}
        subtitle={lang === "ar" ? "إدارة المستلزمات والمخزون" : "Manage supplies and stock levels"}
        actions={
          <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" />
            {lang === "ar" ? "إضافة صنف" : "Add Item"}
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Package} label={lang === "ar" ? "إجمالي الأصناف" : "Total Items"} value={all.length} color="primary" delay={0} />
        <StatCard icon={AlertCircle} label={lang === "ar" ? "مخزون منخفض" : "Low Stock"} value={lowStockCount} trend={lowStockCount > 0 ? "Needs restock" : "Healthy"} trendUp={lowStockCount === 0} color="sand" delay={0.05} />
        <StatCard icon={TrendingUp} label={lang === "ar" ? "قيمة المخزون" : "Stock Value"} value={formatCurrency(totalValue, lang)} color="accent" delay={0.1} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder={lang === "ar" ? "ابحث بالاسم أو المورد..." : "Search by name or supplier..."} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang === "ar" ? "كل الفئات" : "All Categories"}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.key} value={c.key}>{lang === "ar" ? c.ar : c.en}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={showLowOnly ? "default" : "outline"}
          onClick={() => setShowLowOnly(!showLowOnly)}
          className="gap-1.5"
        >
          <AlertCircle className="h-4 w-4" />
          {lang === "ar" ? "المنخفض فقط" : "Low Only"}
        </Button>
      </div>

      {loading ? (
        [1, 2, 3, 4].map((i) => (
          <Card key={i}><CardContent className="p-4 space-y-2"><Skeleton className="h-5 w-1/3" /><Skeleton className="h-3 w-1/2" /></CardContent></Card>
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
        <Card><CardContent className="p-2"><EmptyState icon={Package} title={lang === "ar" ? "لا أصناف" : "No items"} desc={lang === "ar" ? "أضف أول صنف" : "Add your first item"} /></CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-xs text-muted-foreground">
                  <tr>
                    <th className="text-start font-medium p-3">{lang === "ar" ? "الصنف" : "Item"}</th>
                    <th className="text-start font-medium p-3 hidden sm:table-cell">{lang === "ar" ? "الفئة" : "Category"}</th>
                    <th className="text-center font-medium p-3">{lang === "ar" ? "الكمية" : "Quantity"}</th>
                    <th className="text-center font-medium p-3 hidden md:table-cell">{lang === "ar" ? "الحد الأدنى" : "Min"}</th>
                    <th className="text-end font-medium p-3 hidden lg:table-cell">{lang === "ar" ? "التكلفة/وحدة" : "Unit Cost"}</th>
                    <th className="text-end font-medium p-3 hidden lg:table-cell">{lang === "ar" ? "القيمة" : "Value"}</th>
                    <th className="text-center font-medium p-3">{lang === "ar" ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((item, i) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, delay: i * 0.02 }}
                        className={cn("border-b border-border/40 hover:bg-muted/30", item.lowStock && "bg-amber-50/50 dark:bg-amber-950/20")}
                      >
                        <td className="p-3">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.supplier ?? "—"}</p>
                          {item.location && <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-2.5 w-2.5" />{item.location}</p>}
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <Badge variant="outline" className="text-[10px] capitalize">{categories.find((c) => c.key === item.category)?.[lang === "ar" ? "ar" : "en"] ?? item.category}</Badge>
                        </td>
                        <td className="p-3 text-center">
                          <span className={cn("font-bold tabular-nums", item.lowStock ? "text-amber-600" : "")}>{item.quantity}</span>
                          <span className="text-xs text-muted-foreground ms-1">{item.unit}</span>
                          {item.lowStock && <Badge className="ms-2 bg-amber-500 text-white text-[10px]">{lang === "ar" ? "منخفض" : "Low"}</Badge>}
                        </td>
                        <td className="p-3 text-center text-muted-foreground hidden md:table-cell">{item.minStock}</td>
                        <td className="p-3 text-end tabular-nums hidden lg:table-cell">{formatCurrency(item.unitCost, lang)}</td>
                        <td className="p-3 text-end tabular-nums font-semibold hidden lg:table-cell">{formatCurrency(item.stockValue, lang)}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button size="sm" variant="outline" className="gap-1 h-7 px-2 text-xs" disabled={acting === item.id} onClick={() => restock(item)}>
                              <TrendingUp className="h-3 w-3" />
                              {lang === "ar" ? "تخزين" : "Restock"}
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 h-7 px-2 text-xs" disabled={acting === item.id} onClick={() => consume(item)}>
                              <TrendingDown className="h-3 w-3" />
                              {lang === "ar" ? "استهلاك" : "Use"}
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <ItemFormDialog open={showForm} hotels={hotels ?? []} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); refetch(); }} />
    </div>
  );
}

function ItemFormDialog({ open, hotels, onClose, onSaved }: { open: boolean; hotels: any[]; onClose: () => void; onSaved: () => void }) {
  const lang = useAppStore((s) => s.lang);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    hotelId: hotels[0]?.id ?? "",
    name: "",
    nameAr: "",
    category: "other",
    unit: "piece",
    quantity: 0,
    minStock: 10,
    maxStock: 100,
    unitCost: 0,
    supplier: "",
    location: "",
  });

  const handleSubmit = async () => {
    if (!form.hotelId || !form.name) {
      toast.error(lang === "ar" ? "الفندق والاسم مطلوبان" : "Hotel and name are required");
      return;
    }
    setSaving(true);
    try {
      await inventoryService.create({
        ...form,
        quantity: Number(form.quantity),
        minStock: Number(form.minStock),
        maxStock: Number(form.maxStock),
        unitCost: Number(form.unitCost),
      });
      toast.success(lang === "ar" ? "تمت الإضافة" : "Item added");
      setForm({ hotelId: form.hotelId, name: "", nameAr: "", category: "other", unit: "piece", quantity: 0, minStock: 10, maxStock: 100, unitCost: 0, supplier: "", location: "" });
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
          <DialogTitle>{lang === "ar" ? "صنف مخزون جديد" : "New Inventory Item"}</DialogTitle>
          <DialogDescription>{lang === "ar" ? "أدخل تفاصيل الصنف" : "Enter item details"}</DialogDescription>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <Label className="text-xs">{lang === "ar" ? "اسم الصنف" : "Item Name"}</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
          <div>
            <Label className="text-xs">{lang === "ar" ? "الوحدة" : "Unit"}</Label>
            <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {units.map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الكمية" : "Quantity"}</Label>
            <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الحد الأدنى" : "Min Stock"}</Label>
            <Input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الحد الأقصى" : "Max Stock"}</Label>
            <Input type="number" value={form.maxStock} onChange={(e) => setForm({ ...form, maxStock: Number(e.target.value) })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "التكلفة/وحدة (ر.س)" : "Unit Cost (SAR)"}</Label>
            <Input type="number" step="0.01" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: Number(e.target.value) })} dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "المورد" : "Supplier"}</Label>
            <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">{lang === "ar" ? "الموقع" : "Location"}</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
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
