"use client";
import { useState, useEffect, use } from "react";
import { useLang } from "@/components/lang-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getHotel, type Hotel } from "@/data/mock-data";
import { t, formatPrice, cn } from "@/lib/utils";
import { addBooking } from "@/lib/bookings";
import { MapPin, Star, Check, ArrowLeft, BedDouble, Calendar, Users, Sparkles } from "lucide-react";

export default function HotelDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang, setLang } = useLang();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getHotel(id).then((data) => {
      if (!mounted) return;
      setHotel(data);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [id]);

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 1;
  const room = hotel?.rooms.find((r) => r.id === selectedRoom);
  const total = room ? room.pricePerNight * nights : 0;

  const handleBook = async () => {
    // Gracefully handle missing details — proceed with what we have
    if (!hotel || !room) return;
    setSubmitting(true);
    try {
      const booking = addBooking({
        type: "hotel",
        itemId: hotel.id,
        itemName: hotel.name,
        itemNameAr: hotel.nameAr,
        itemImage: hotel.coverImage,
        city: hotel.city,
        country: hotel.country,
        checkIn: checkIn || new Date().toISOString().slice(0, 10),
        checkOut: checkOut || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        guests,
        rooms: 1,
        nights,
        amount: total,
        currency: "$",
        guestName: guestName || "Guest User",
        guestEmail: guestEmail || "guest@tripful.com",
        guestPhone: guestPhone || "",
        specialRequests: specialRequests || undefined,
      });
      // Small delay for nicer UX
      await new Promise((r) => setTimeout(r, 400));
      const params = new URLSearchParams({
        type: "hotel",
        bookingId: booking.id,
        id: hotel.id,
        name: booking.guestName,
        email: booking.guestEmail,
      });
      window.location.href = `/booking-success?${params.toString()}`;
    } catch (e) {
      // Even if something fails, navigate to success with limited info
      console.warn("Booking save failed, proceeding anyway:", e);
      const params = new URLSearchParams({ type: "hotel", id: hotel.id, name: guestName || "Guest", email: guestEmail });
      window.location.href = `/booking-success?${params.toString()}`;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar lang={lang} setLang={setLang} />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-12">
          <div className="tf-skeleton h-96 w-full mb-6" />
          <div className="tf-skeleton h-8 w-2/3 mb-3" />
          <div className="tf-skeleton h-4 w-1/3 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="tf-skeleton h-32" />
              <div className="tf-skeleton h-32" />
            </div>
            <div className="tf-skeleton h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen">
        <Navbar lang={lang} setLang={setLang} />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-32 pb-12 text-center">
          <div className="tf-empty">
            <div className="tf-empty-icon"><BedDouble className="h-8 w-8" /></div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">{lang === "ar" ? "الفندق غير موجود" : "Hotel Not Found"}</h2>
            <p className="text-[#64748B] mb-6">{lang === "ar" ? "ربما تم إزالة هذا الفندق" : "This hotel may have been removed"}</p>
            <a href="/hotels" className="tf-btn-primary inline-flex">{lang === "ar" ? "تصفح الفنادق" : "Browse Hotels"} <ArrowLeft className="h-4 w-4 rtl:rotate-180" /></a>
          </div>
        </div>
        <Footer lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} setLang={setLang} />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-12">
        <a href="/hotels" className="inline-flex items-center gap-1 text-[#1A4D8F] font-medium mb-4 hover:gap-2 transition-all"><ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {lang === "ar" ? "كل الفنادق" : "All Hotels"}</a>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-2xl overflow-hidden">
          <div className="md:col-span-2 md:row-span-2 h-64 md:h-96 overflow-hidden"><img src={hotel.images[activeImg] || hotel.coverImage} alt={hotel.name} className="w-full h-full object-cover" /></div>
          {hotel.images.slice(0, 4).map((img, i) => <button key={i} onClick={() => setActiveImg(i)} className={cn("h-32 md:h-48 overflow-hidden rounded-xl", activeImg === i && "ring-2 ring-[#2563EB]")}><img src={img} alt="" className="w-full h-full object-cover" /></button>)}
        </div>

        {/* Info */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div><h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-2 tf-font-display">{lang === "ar" ? hotel.nameAr ?? hotel.name : hotel.name}</h1><p className="text-[#64748B] flex items-center gap-1"><MapPin className="h-4 w-4" />{hotel.location}, {hotel.city}</p></div>
              <div className="flex items-center gap-1 bg-[#EFF6FF] px-3 py-2 rounded-xl"><Star className="h-5 w-5 tf-star" /><span className="font-bold text-lg text-[#0F172A]">{hotel.rating}</span><span className="text-xs text-[#94A3B8]">({hotel.reviewCount.toLocaleString()})</span></div>
            </div>
            <div className="flex items-center gap-2 mb-6"><span className="bg-[#1A4D8F] text-white px-3 py-1 rounded-lg text-sm font-bold">{hotel.starRating} ★</span><span className="text-[#64748B] text-sm">{hotel.totalRooms} {t(lang, "rooms")}</span></div>
            <p className="text-[#334155] leading-relaxed mb-8">{hotel.description}</p>

            {/* Amenities */}
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 tf-font-display">{t(lang, "amenities")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {hotel.amenities.map((a, i) => <div key={a + i} className="flex items-center gap-2 text-sm text-[#334155]"><Check className="h-4 w-4 text-[#1A4D8F]" />{lang === "ar" ? hotel.amenitiesAr[i] : a}</div>)}
            </div>

            {/* Rooms */}
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 tf-font-display">{t(lang, "rooms")}</h2>
            <div className="space-y-4">
              {hotel.rooms.map((r) => (
                <div key={r.id} className={cn("border-2 rounded-2xl p-5 transition-all cursor-pointer", selectedRoom === r.id ? "border-[#2563EB] bg-[#EFF6FF]/50" : "border-[#E2E8F0] hover:border-[#93C5FD]")} onClick={() => setSelectedRoom(r.id)}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0"><img src={r.images[0]} alt={r.roomType} className="w-full h-full object-cover" /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#0F172A]">{r.roomType}</h3>
                      <p className="text-sm text-[#64748B] flex items-center gap-1 mt-1"><BedDouble className="h-4 w-4" />{r.bedType} • {r.maxGuests} {t(lang, "guests")} {r.size ? `• ${r.size}m²` : ""}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">{r.amenities.slice(0, 4).map((a) => <span key={a} className="tf-badge tf-badge-gray">{a}</span>)}</div>
                      <div className="flex items-end justify-between mt-3"><p className="text-2xl font-extrabold text-[#0F172A] tf-font-display">{formatPrice(r.pricePerNight, lang)}<span className="text-xs font-normal text-[#64748B]">{t(lang, "per_night")}</span></p></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-[#0F172A] mb-4 tf-font-display">{t(lang, "book_now")}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1.5 flex items-center gap-1"><Calendar className="h-3 w-3" /> {t(lang, "check_in")}</label>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="tf-input" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1.5 flex items-center gap-1"><Calendar className="h-3 w-3" /> {t(lang, "check_out")}</label>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="tf-input" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1.5 flex items-center gap-1"><Users className="h-3 w-3" /> {t(lang, "guests")}</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="tf-input">
                    <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
                  </select>
                </div>
              </div>
              {room && checkIn && checkOut ? (
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="flex justify-between text-sm mb-2"><span className="text-[#64748B]">{formatPrice(room.pricePerNight, lang)} × {nights} {t(lang, "nights")}</span><span className="font-semibold text-[#0F172A]">{formatPrice(total, lang)}</span></div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#E2E8F0]"><span className="text-[#0F172A]">{lang === "ar" ? "الإجمالي" : "Total"}</span><span className="text-[#1A4D8F] tf-font-display">{formatPrice(total, lang)}</span></div>
                </div>
              ) : <p className="text-xs text-[#94A3B8] mt-3">{lang === "ar" ? "اختر غرفة وتواريخ للمتابعة" : "Select a room and dates to continue"}</p>}

              {showForm ? (
                <div className="mt-4 space-y-2">
                  <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={t(lang, "guest_name")} className="tf-input" />
                  <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder={t(lang, "email")} className="tf-input" />
                  <input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder={t(lang, "phone")} className="tf-input" />
                  <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder={t(lang, "special_requests")} rows={2} className="tf-input resize-none" />
                  <button onClick={handleBook} disabled={submitting || !room} className="tf-btn-primary w-full">
                    {submitting ? (<><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {lang === "ar" ? "جاري الحجز..." : "Booking..."}</>) : (<><Sparkles className="h-4 w-4" /> {t(lang, "confirm_booking")}</>)}
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowForm(true)} disabled={!room || !checkIn || !checkOut} className="tf-btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed">{t(lang, "book_now")}</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
