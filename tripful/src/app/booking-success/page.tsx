"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/components/lang-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { t, formatPrice } from "@/lib/utils";
import { getBookings, type TripfulBooking } from "@/lib/bookings";
import { CheckCircle2, Home, Calendar, Users, Ticket } from "lucide-react";

export default function BookingSuccessPage() {
  const { lang, setLang } = useLang();
  const [params, setParams] = useState<URLSearchParams | null>(null);
  const [booking, setBooking] = useState<TripfulBooking | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setParams(p);
    const bookingId = p.get("bookingId");
    if (bookingId) {
      const all = getBookings();
      const found = all.find((b) => b.id === bookingId);
      if (found) setBooking(found);
    }
  }, []);

  if (!params) return null;

  const type = params.get("type") ?? booking?.type ?? "hotel";
  const name = params.get("name") ?? booking?.guestName ?? "Guest";
  const email = params.get("email") ?? booking?.guestEmail ?? "";
  const total = booking?.amount ?? Number(params.get("total") ?? 0);
  const guests = booking?.guests ?? Number(params.get("guests") ?? 1);
  const checkIn = booking?.checkIn ?? params.get("checkIn") ?? params.get("startDate") ?? "";
  const checkOut = booking?.checkOut ?? "";
  const itemId = booking?.itemId ?? params.get("id") ?? "";
  const itemName = booking?.itemName ?? (type === "hotel" ? "Hotel Booking" : "Travel Bundle");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang={lang} setLang={setLang} />
      <div className="flex-1 flex items-center justify-center px-4 py-12 pt-32">
        <div className="max-w-lg w-full text-center tf-fade-in">
          <div className="h-20 w-20 rounded-full bg-[#DBEAFE] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-[#1A4D8F]" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] mb-3 tf-font-display">{t(lang, "booking_confirmed")}</h1>
          <p className="text-[#64748B] mb-8">{t(lang, "booking_confirmed_desc")}</p>

          {booking && (
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#EFF6FF] border border-[#DBEAFE]">
              <Ticket className="h-4 w-4 text-[#1A4D8F]" />
              <span className="text-xs font-bold text-[#1A4D8F]">{lang === "ar" ? "رقم الحجز" : "Booking ID"}: {booking.id}</span>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-lg p-6 text-left rtl:text-right">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-[#64748B]">{lang === "ar" ? "الضيف" : "Guest"}</span><span className="font-bold text-[#0F172A]">{name}</span></div>
              {email && <div className="flex justify-between"><span className="text-[#64748B]">{t(lang, "email")}</span><span className="font-bold text-[#0F172A]" dir="ltr">{email}</span></div>}
              <div className="flex justify-between"><span className="text-[#64748B]">{lang === "ar" ? "النوع" : "Type"}</span><span className="font-bold text-[#0F172A]">{type === "hotel" ? t(lang, "hotels") : t(lang, "bundles")}</span></div>
              {itemName && <div className="flex justify-between"><span className="text-[#64748B]">{lang === "ar" ? "البند" : "Item"}</span><span className="font-bold text-[#0F172A]">{itemName}</span></div>}
              {checkIn && <div className="flex justify-between items-center"><span className="text-[#64748B] flex items-center gap-1"><Calendar className="h-3 w-3" /> {t(lang, "check_in_date")}</span><span className="font-bold text-[#0F172A]">{checkIn}</span></div>}
              {checkOut && <div className="flex justify-between items-center"><span className="text-[#64748B] flex items-center gap-1"><Calendar className="h-3 w-3" /> {t(lang, "check_out_date")}</span><span className="font-bold text-[#0F172A]">{checkOut}</span></div>}
              <div className="flex justify-between items-center"><span className="text-[#64748B] flex items-center gap-1"><Users className="h-3 w-3" /> {t(lang, "guests")}</span><span className="font-bold text-[#0F172A]">{guests}</span></div>
              {total > 0 && <div className="flex justify-between pt-3 border-t border-[#E2E8F0]"><span className="font-bold text-[#0F172A]">{lang === "ar" ? "الإجمالي" : "Total"}</span><span className="font-bold text-[#1A4D8F] text-lg tf-font-display">{formatPrice(total, lang)}</span></div>}
            </div>
          </div>

          <div className="flex gap-3 justify-center mt-8 flex-wrap">
            <a href="/my-bookings" className="tf-btn-primary inline-flex">
              <Ticket className="h-4 w-4" /> {t(lang, "my_bookings")}
            </a>
            <a href="/" className="tf-btn-outline inline-flex">
              <Home className="h-4 w-4" /> {t(lang, "back_home")}
            </a>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
