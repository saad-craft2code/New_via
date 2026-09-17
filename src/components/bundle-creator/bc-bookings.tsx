"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, PageHeader, formatCurrency } from "@/components/widgets";
import { mockBookings } from "@/lib/mock-data";
import { Search, Filter, Download, Eye, MessageCircle, Send, X, Check, XCircle, FileDown, Phone, Mail, MapPin, Calendar, Users, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function BCBookings() {
  const lang = useAppStore((s) => s.lang);
  const [filter, setFilter] = useState<"All" | "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled">("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = mockBookings.filter((b) => {
    if (filter !== "All" && b.status !== filter) return false;
    if (search && !b.guestName.toLowerCase().includes(search.toLowerCase()) && !b.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedBooking = mockBookings.find((b) => b.id === selected);

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_bookings", lang)}
        subtitle={lang === "ar" ? "إدارة حجوزات المسافرين" : "Manage traveler bookings"}
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
            placeholder={lang === "ar" ? "ابحث برقم الحجز أو اسم الضيف..." : "Search by booking ID or guest name..."}
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
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
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
                  <th className="text-start font-medium p-3 hidden md:table-cell">{t("bundle_name", lang)}</th>
                  <th className="text-start font-medium p-3 hidden lg:table-cell">{t("dates", lang)}</th>
                  <th className="text-start font-medium p-3 hidden sm:table-cell">{t("num_guests", lang)}</th>
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
                    <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell">
                      {new Date(b.startDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                    </td>
                    <td className="p-3 text-sm hidden sm:table-cell">{b.guests}</td>
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
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">{t("no_data", lang)}</div>
          )}
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
              {/* Header */}
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
                        <Phone className="h-3.5 w-3.5" />
                        <span className="text-foreground" dir="ltr">{selectedBooking.guestPhone}</span>
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

                {/* Bundle info */}
                <Card className="border-border/70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{t("bundle_name", lang)}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="font-medium">{lang === "ar" ? selectedBooking.itemNameAr : selectedBooking.itemName}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(selectedBooking.startDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{selectedBooking.guests} {t("persons", lang)}</span>
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

                {/* Timeline */}
                <Card className="border-border/70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{t("booking_timeline", lang)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2.5">
                      {[
                        { label: lang === "ar" ? "تم الحجز" : "Booked", date: selectedBooking.bookingDate, done: true },
                        { label: lang === "ar" ? "تأكيد الدفع" : "Payment confirmed", date: selectedBooking.bookingDate, done: selectedBooking.paymentStatus === "Paid" },
                        { label: lang === "ar" ? "إرسال المستندات" : "Documents sent", date: "", done: ["Confirmed", "Active", "Completed"].includes(selectedBooking.status) },
                        { label: lang === "ar" ? "بدء الجولة" : "Tour started", date: selectedBooking.startDate, done: ["Active", "Completed"].includes(selectedBooking.status) },
                        { label: lang === "ar" ? "إكمال الجولة" : "Tour completed", date: selectedBooking.endDate, done: selectedBooking.status === "Completed" },
                      ].map((step, i, arr) => (
                        <div key={i} className="flex gap-2.5">
                          <div className="flex flex-col items-center">
                            <div className={cn(
                              "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                              step.done ? "bg-[oklch(0.55_0.12_175)] text-white" : "bg-muted text-muted-foreground"
                            )}>
                              {step.done ? <Check className="h-3 w-3" /> : i + 1}
                            </div>
                            {i < arr.length - 1 && <div className={cn("w-0.5 flex-1 my-0.5", step.done ? "bg-[oklch(0.55_0.12_175)]" : "bg-border")} />}
                          </div>
                          <div className="flex-1 pb-2">
                            <p className="text-sm font-medium">{step.label}</p>
                            {step.date && <p className="text-xs text-muted-foreground">{new Date(step.date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</p>}
                          </div>
                        </div>
                      ))}
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
                  <Button variant="outline" className="gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {t("contact_guest", lang)}
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <Send className="h-4 w-4" />
                    {t("send_itinerary", lang)}
                  </Button>
                  {selectedBooking.status !== "Cancelled" && selectedBooking.status !== "Completed" && (
                    <Button variant="outline" className="gap-1 text-destructive hover:text-destructive">
                      <XCircle className="h-4 w-4" />
                      {t("cancel_booking", lang)}
                    </Button>
                  )}
                  {selectedBooking.status === "Active" && (
                    <Button variant="outline" className="gap-1 text-[oklch(0.5_0.15_145)]">
                      <Check className="h-4 w-4" />
                      {t("mark_completed", lang)}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
