"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency } from "@/components/widgets";
import { guestService, type GuestHotelDetail, type GuestBundleDetail } from "@/services/guest.service";
import { Loader2, CheckCircle2, Calendar, Users, Mail, Phone, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export function HotelBookingForm({ hotel, room, lang, onClose }: { hotel: GuestHotelDetail; room: GuestHotelDetail["rooms"][number]; lang: "ar" | "en"; onClose: () => void }) {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [numGuests, setNumGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const nights = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000));
  const totalAmount = room.pricePerNight * nights;

  async function submit() {
    if (!guestName || !guestEmail) {
      toast.error(lang === "ar" ? "الرجاء إدخال الاسم والبريد" : "Please enter name and email");
      return;
    }
    setSubmitting(true);
    try {
      await guestService.createBooking({
        type: "HotelRoom",
        hotelId: hotel.id,
        roomId: room.id,
        startDate,
        endDate,
        numGuests,
        totalAmount,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
      });
      setSuccess(true);
      toast.success(lang === "ar" ? "تم إرسال طلب الحجز!" : "Booking request sent!");
    } catch (e) {
      toast.error(lang === "ar" ? "تعذّر إرسال الطلب" : "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
            <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-3" />
            <DialogTitle className="text-xl">{lang === "ar" ? "تم إرسال طلب الحجز!" : "Booking Requested!"}</DialogTitle>
            <DialogDescription className="mt-2">
              {lang === "ar"
                ? "سيتواصل معك الفندق خلال 24 ساعة لتأكيد الحجز."
                : "The hotel will contact you within 24 hours to confirm your reservation."}
            </DialogDescription>
            <Button className="mt-5" onClick={onClose}>{lang === "ar" ? "حسنًا" : "OK"}</Button>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{lang === "ar" ? "احجز الآن" : "Book Now"}</DialogTitle>
              <DialogDescription>
                {hotel.name} • {room.roomType}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs flex items-center gap-1"><User className="h-3 w-3" /> {lang === "ar" ? "الاسم الكامل" : "Full Name"}</Label>
                <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={lang === "ar" ? "أحمد الراشد" : "Ahmed Al-Rashid"} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" /> Email</Label>
                  <Input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1"><Phone className="h-3 w-3" /> {lang === "ar" ? "الهاتف" : "Phone"}</Label>
                  <Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+966 5x xxx xxxx" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs flex items-center gap-1"><Calendar className="h-3 w-3" /> {lang === "ar" ? "تاريخ الوصول" : "Check-in"}</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1"><Calendar className="h-3 w-3" /> {lang === "ar" ? "تاريخ المغادرة" : "Check-out"}</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <div>
                <Label className="text-xs flex items-center gap-1"><Users className="h-3 w-3" /> {lang === "ar" ? "عدد الضيوف" : "Guests"}</Label>
                <Input type="number" min={1} max={room.maxGuests} value={numGuests} onChange={(e) => setNumGuests(Number(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs">{lang === "ar" ? "طلبات خاصة" : "Special Requests"}</Label>
                <Textarea rows={2} value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder={lang === "ar" ? "أي طلبات خاصة..." : "Any special requests..."} />
              </div>
              <div className="rounded-lg bg-muted/40 p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{formatCurrency(room.pricePerNight, lang)} × {nights} {lang === "ar" ? "ليلة" : "nights"}</span>
                  <span>{formatCurrency(totalAmount, lang)}</span>
                </div>
                <div className="flex justify-between text-sm pt-1 border-t border-border">
                  <span className="font-semibold">{lang === "ar" ? "الإجمالي" : "Total"}</span>
                  <span className="font-bold text-primary">{formatCurrency(totalAmount, lang)}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
              <Button onClick={submit} disabled={submitting} className="gap-2">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {lang === "ar" ? "تأكيد الحجز" : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function BundleBookingForm({ bundle, lang, onClose }: { bundle: GuestBundleDetail; lang: "ar" | "en"; onClose: () => void }) {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [startDate, setStartDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const [numGuests, setNumGuests] = useState(bundle.groupSizeMin);
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalAmount = bundle.price * numGuests;

  async function submit() {
    if (!guestName || !guestEmail) {
      toast.error(lang === "ar" ? "الرجاء إدخال الاسم والبريد" : "Please enter name and email");
      return;
    }
    setSubmitting(true);
    try {
      await guestService.createBooking({
        type: "Bundle",
        bundleId: bundle.id,
        startDate,
        endDate: new Date(new Date(startDate).getTime() + bundle.durationDays * 86400000).toISOString().slice(0, 10),
        numGuests,
        totalAmount,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
      });
      setSuccess(true);
      toast.success(lang === "ar" ? "تم إرسال طلب الحجز!" : "Booking request sent!");
    } catch (e) {
      toast.error(lang === "ar" ? "تعذّر إرسال الطلب" : "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
            <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-3" />
            <DialogTitle className="text-xl">{lang === "ar" ? "تم إرسال طلب الحجز!" : "Booking Requested!"}</DialogTitle>
            <DialogDescription className="mt-2">
              {lang === "ar"
                ? "سيتواصل معك منشئ الباقة خلال 24 ساعة لتأكيد الحجز."
                : "The bundle creator will contact you within 24 hours to confirm your booking."}
            </DialogDescription>
            <Button className="mt-5" onClick={onClose}>{lang === "ar" ? "حسنًا" : "OK"}</Button>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{lang === "ar" ? "احجز الباقة" : "Book this Bundle"}</DialogTitle>
              <DialogDescription>{bundle.title}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs flex items-center gap-1"><User className="h-3 w-3" /> {lang === "ar" ? "الاسم الكامل" : "Full Name"}</Label>
                <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={lang === "ar" ? "أحمد الراشد" : "Ahmed Al-Rashid"} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" /> Email</Label>
                  <Input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1"><Phone className="h-3 w-3" /> {lang === "ar" ? "الهاتف" : "Phone"}</Label>
                  <Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+966 5x xxx xxxx" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs flex items-center gap-1"><Calendar className="h-3 w-3" /> {lang === "ar" ? "تاريخ البدء" : "Start Date"}</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1"><Users className="h-3 w-3" /> {lang === "ar" ? "المسافرون" : "Travelers"}</Label>
                  <Input type="number" min={bundle.groupSizeMin} max={bundle.groupSizeMax} value={numGuests} onChange={(e) => setNumGuests(Number(e.target.value))} />
                </div>
              </div>
              <div>
                <Label className="text-xs">{lang === "ar" ? "طلبات خاصة" : "Special Requests"}</Label>
                <Textarea rows={2} value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder={lang === "ar" ? "أي طلبات خاصة..." : "Any special requests..."} />
              </div>
              <div className="rounded-lg bg-muted/40 p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{formatCurrency(bundle.price, lang)} × {numGuests} {lang === "ar" ? "ضيف" : "guests"}</span>
                  <span>{formatCurrency(totalAmount, lang)}</span>
                </div>
                <div className="flex justify-between text-sm pt-1 border-t border-border">
                  <span className="font-semibold">{lang === "ar" ? "الإجمالي" : "Total"}</span>
                  <span className="font-bold text-primary">{formatCurrency(totalAmount, lang)}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
              <Button onClick={submit} disabled={submitting} className="gap-2">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {lang === "ar" ? "تأكيد الحجز" : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
