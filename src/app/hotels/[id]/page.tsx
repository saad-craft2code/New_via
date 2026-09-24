"use client";
import { useState, use } from "react";
import { useLang } from "@/components/tripful-lang-provider";
import { Navbar } from "@/components/tripful-navbar";
import { Footer } from "@/components/tripful-footer";
import { hotels } from "@/lib/tripful-data";
import { t, formatPrice, cn } from "@/lib/tripful-utils";
import { MapPin, Star, Check, Calendar, Users, ArrowLeft, BedDouble } from "lucide-react";

export default function HotelDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang, setLang } = useLang();
  const hotel = hotels.find((h) => h.id === id) ?? hotels[0];
  const [activeImg, setActiveImg] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [showForm, setShowForm] = useState(false);

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 1;
  const room = hotel.rooms.find((r) => r.id === selectedRoom);
  const total = room ? room.pricePerNight * nights : 0;

  const handleBook = () => {
    if (!guestName || !guestEmail) return;
    const params = new URLSearchParams({ type: "hotel", id: hotel.id, room: selectedRoom ?? "", name: guestName, email: guestEmail, checkIn, checkOut, guests: String(guests), total: String(total) });
    window.location.href = `/booking-success?${params.toString()}`;
  };

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} setLang={setLang} />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-12">
        <a href="/hotels" className="inline-flex items-center gap-1 text-#1A4D8F font-medium mb-4 hover:gap-2 transition-all"><ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {lang === "ar" ? "كل الفنادق" : "All Hotels"}</a>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-2xl overflow-hidden">
          <div className="md:col-span-2 md:row-span-2 h-64 md:h-96 overflow-hidden"><img src={hotel.images[activeImg]} alt={hotel.name} className="w-full h-full object-cover" /></div>
          {hotel.images.slice(0, 4).map((img, i) => <button key={i} onClick={() => setActiveImg(i)} className={cn("h-32 md:h-48 overflow-hidden rounded-xl", activeImg === i && "ring-2 ring-blue-500")}><img src={img} alt="" className="w-full h-full object-cover" /></button>)}
        </div>

        {/* Info */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div><h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{hotel.name}</h1><p className="text-slate-500 flex items-center gap-1"><MapPin className="h-4 w-4" />{hotel.location}, {hotel.city}</p></div>
              <div className="flex items-center gap-1 bg-blue-50 px-3 py-2 rounded-xl"><Star className="h-5 w-5 tf-star" /><span className="font-bold text-lg">{hotel.rating}</span><span className="text-xs text-slate-400">({hotel.reviewCount})</span></div>
            </div>
            <div className="flex items-center gap-2 mb-6"><span className="bg-#1A4D8F text-white px-3 py-1 rounded-lg text-sm font-bold">{hotel.starRating} ★</span><span className="text-slate-500 text-sm">{hotel.totalRooms} {t(lang, "rooms")}</span></div>
            <p className="text-slate-600 leading-relaxed mb-8">{hotel.description}</p>

            {/* Amenities */}
            <h2 className="text-2xl font-bold mb-4">{t(lang, "amenities")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {hotel.amenities.map((a) => <div key={a} className="flex items-center gap-2 text-sm text-slate-700"><Check className="h-4 w-4 text-#1A4D8F" />{a}</div>)}
            </div>

            {/* Rooms */}
            <h2 className="text-2xl font-bold mb-4">{t(lang, "rooms")}</h2>
            <div className="space-y-4">
              {hotel.rooms.map((r) => (
                <div key={r.id} className={cn("border-2 rounded-2xl p-5 transition-all cursor-pointer", selectedRoom === r.id ? "border-blue-500 bg-blue-50/50" : "border-slate-200 hover:border-#93C5FD")} onClick={() => setSelectedRoom(r.id)}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0"><img src={r.images[0]} alt={r.roomType} className="w-full h-full object-cover" /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{r.roomType}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><BedDouble className="h-4 w-4" />{r.bedType} • {r.maxGuests} {t(lang, "guests")} {r.size ? `• ${r.size}m²` : ""}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">{r.amenities.slice(0, 4).map((a) => <span key={a} className="text-xs px-2 py-0.5 bg-slate-100 rounded-md text-slate-600">{a}</span>)}</div>
                      <div className="flex items-end justify-between mt-3"><p className="text-2xl font-extrabold text-slate-900">{formatPrice(r.pricePerNight, lang)}<span className="text-xs font-normal text-slate-400">{t(lang, "per_night")}</span></p></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">{t(lang, "book_now")}</h3>
              <div className="space-y-3">
                <div><label className="text-xs font-semibold text-slate-500 block mb-1">{t(lang, "check_in")}</label><input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="text-xs font-semibold text-slate-500 block mb-1">{t(lang, "check_out")}</label><input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="text-xs font-semibold text-slate-500 block mb-1">{t(lang, "guests")}</label><select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select></div>
              </div>
              {room && checkIn && checkOut ? (
                <div className="mt-4 pt-4 border-t border-slate-100"><div className="flex justify-between text-sm mb-2"><span className="text-slate-500">{formatPrice(room.pricePerNight, lang)} × {nights} {t(lang, "nights")}</span><span>{formatPrice(total, lang)}</span></div><div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-100"><span>{lang === "ar" ? "الإجمالي" : "Total"}</span><span>{formatPrice(total, lang)}</span></div></div>
              ) : <p className="text-xs text-slate-400 mt-3">{lang === "ar" ? "اختر غرفة وتواريخ" : "Select a room and dates"}</p>}
              {showForm ? (
                <div className="mt-4 space-y-2">
                  <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={t(lang, "guest_name")} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder={t(lang, "email")} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={handleBook} disabled={!guestName || !guestEmail || !room} className="w-full bg-#1A4D8F text-white font-bold py-3 rounded-lg hover:bg-#2563EB transition-colors disabled:opacity-50">{t(lang, "confirm_booking")}</button>
                </div>
              ) : (
                <button onClick={() => setShowForm(true)} disabled={!room || !checkIn || !checkOut} className="w-full mt-4 bg-#1A4D8F text-white font-bold py-3 rounded-lg hover:bg-#2563EB transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{t(lang, "book_now")}</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
