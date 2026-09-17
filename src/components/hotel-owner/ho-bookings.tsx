"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, PageHeader, formatCurrency } from "@/components/widgets";
import { mockHotelBookings } from "@/lib/mock-data";
import { Search, Download, Eye, X, Check, XCircle, LogIn, LogOut, Printer, Mail, BedDouble, Plus, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function HOBookings() {
  const lang = useAppStore((s) => s.lang);
  const [filter, setFilter] = useState<"All" | "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled" | "No-show">("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = mockHotelBookings.filter((b) => {
    if (filter !== "All" && b.status !== filter) return false;
    if (search && !b.guestName.toLowerCase().includes(search.toLowerCase()) && !b.id.toLowerCase().includes(search.toLowerCase()) && !b.roomNumber?.includes(search)) return false;
    return true;
  });

  const selectedBooking = mockHotelBookings.find((b) => b.id === selected);

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_bookings", lang)}
        subtitle={lang === "ar" ? "إدارة حجوزات الفندق" : "Manage hotel bookings and reservations"}
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {lang === "ar" ? "تصدير" : "Export"}
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={lang === "ar" ? "ابحث برقم الحجز أو اسم الضيف أو رقم الغرفة..." : "Search by booking ID, guest name, or room #..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
          {(["All", "Pending", "Confirmed", "Active", "Completed", "Cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors",
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
              )}
            >
              {f === "All" ? t("all", lang) : t(f.toLowerCase() as any, lang)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="border-border/70">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-start font-medium p-3">{t("booking_id", lang)}</th>
                  <th className="text-start font-medium p-3">{t("guest_name", lang)}</th>
                  <th className="text-start font-medium p-3 hidden md:table-cell">{t("room_type", lang)}</th>
                  <th className="text-start font-medium p-3 hidden sm:table-cell">{lang === "ar" ? "غرفة #" : "Room #"}</th>
                  <th className="text-start font-medium p-3 hidden lg:table-cell">{t("dates", lang)}</th>
                  <th className="text-start font-medium p-3 hidden sm:table-cell">{lang === "ar" ? "ليالٍ" : "Nights"}</th>
                  <th className="text-start font-medium p-3">{t("total_amount", lang)}</th>
                  <th className="text-start font-medium p-3">{t("status", lang)}</th>
                  <th className="text-start font-medium p-3">{t("actions", lang)}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-border/40 hover:bg-muted/30 cursor-pointer" onClick={() => setSelected(b.id)}>
                    <td className="p-3 text-sm font-mono">{b.id}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={b.guestAvatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-medium">{lang === "ar" ? b.guestNameAr : b.guestName}</p>
                          <p className="text-xs text-muted-foreground">{b.nationality}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm hidden md:table-cell">{lang === "ar" ? b.itemNameAr : b.itemName}</td>
                    <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">{b.roomNumber}</td>
                    <td className="p-3 text-sm hidden lg:table-cell">
                      <div>{new Date(b.startDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</div>
                      <div className="text-xs text-muted-foreground">→ {new Date(b.endDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</div>
                    </td>
                    <td className="p-3 text-sm hidden sm:table-cell">{b.nights}</td>
                    <td className="p-3 text-sm font-semibold">{formatCurrency(b.totalAmount, lang)}</td>
                    <td className="p-3"><StatusBadge status={b.status} lang={lang} /></td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(b.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: lang === "ar" ? -480 : 480 }}
              animate={{ x: 0 }}
              exit={{ x: lang === "ar" ? -480 : 480 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 end-0 z-50 w-full sm:w-[480px] bg-background border-s border-border overflow-y-auto scrollbar-thin"
            >
              <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t("booking_id", lang)}</p>
                  <p className="font-mono font-bold">{selectedBooking.id}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                {/* Guest info */}
                <Card className="border-border/70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{t("guest_info", lang)}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <img src={selectedBooking.guestAvatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold">{lang === "ar" ? selectedBooking.guestNameAr : selectedBooking.guestName}</p>
                        <p className="text-xs text-muted-foreground">{selectedBooking.nationality}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="text-foreground">{selectedBooking.guestEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-foreground">{lang === "ar" ? `إقامات سابقة: ${selectedBooking.previousStays}` : `Previous stays: ${selectedBooking.previousStays}`}</span>
                      </div>
                    </div>
                    {selectedBooking.specialRequests && (
                      <div className="p-2.5 rounded-lg bg-muted/50 text-xs">
                        <p className="font-medium text-foreground mb-1">{lang === "ar" ? "طلبات خاصة" : "Special Requests"}</p>
                        <p className="text-muted-foreground">{selectedBooking.specialRequests}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Room details */}
                <Card className="border-border/70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{lang === "ar" ? "تفاصيل الغرفة" : "Room Details"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-primary" />
                      <span className="font-medium">{lang === "ar" ? selectedBooking.itemNameAr : selectedBooking.itemName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">{lang === "ar" ? "رقم الغرفة" : "Room Number"}</p>
                        <p className="font-mono font-semibold">{selectedBooking.roomNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{lang === "ar" ? "عدد الغرف" : "Rooms"}</p>
                        <p className="font-semibold">{selectedBooking.rooms}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("dates", lang)}</p>
                        <p>{new Date(selectedBooking.startDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{lang === "ar" ? "ليالٍ" : "Nights"}</p>
                        <p>{selectedBooking.nights}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment details */}
                <Card className="border-border/70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{t("payment_details", lang)}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("total_amount", lang)}</span>
                      <span className="font-semibold">{formatCurrency(selectedBooking.totalAmount, lang)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("platform_commission", lang)}</span>
                      <span className="text-destructive">−{formatCurrency(selectedBooking.commission, lang)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-medium">{t("your_earnings", lang)}</span>
                      <span className="font-bold text-[oklch(0.4_0.15_145)]">{formatCurrency(selectedBooking.netEarnings, lang)}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-muted-foreground">{t("payment_status", lang)}</span>
                      <StatusBadge status={selectedBooking.paymentStatus} lang={lang} />
                    </div>
                  </CardContent>
                </Card>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 sticky bottom-0 bg-background/80 backdrop-blur-md p-3 -mx-4 -mb-4 border-t border-border">
                  {selectedBooking.status === "Pending" && (
                    <Button className="bg-[oklch(0.55_0.12_175)] hover:bg-[oklch(0.5_0.12_175)] text-white gap-1">
                      <Check className="h-4 w-4" />
                      {t("confirm_booking", lang)}
                    </Button>
                  )}
                  {selectedBooking.status === "Confirmed" && (
                    <Button className="bg-[oklch(0.55_0.12_175)] hover:bg-[oklch(0.5_0.12_175)] text-white gap-1">
                      <LogIn className="h-4 w-4" />
                      {lang === "ar" ? "تسجيل وصول" : "Check-in"}
                    </Button>
                  )}
                  {selectedBooking.status === "Active" && (
                    <Button className="bg-[oklch(0.55_0.13_30)] hover:bg-[oklch(0.5_0.13_30)] text-white gap-1">
                      <LogOut className="h-4 w-4" />
                      {lang === "ar" ? "تسجيل مغادرة" : "Check-out"}
                    </Button>
                  )}
                  <Button variant="outline" className="gap-1">
                    <BedDouble className="h-4 w-4" />
                    {lang === "ar" ? "تغيير الغرفة" : "Assign Room"}
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <Printer className="h-4 w-4" />
                    {lang === "ar" ? "بطاقة التسجيل" : "Reg. Card"}
                  </Button>
                  <Button variant="outline" className="gap-1 text-destructive hover:text-destructive">
                    <XCircle className="h-4 w-4" />
                    {t("cancel_booking", lang)}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
