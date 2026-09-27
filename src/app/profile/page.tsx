"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/components/lang-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { t, formatPrice } from "@/lib/utils";
import { getBookings, getProfile, saveProfile, computeStats, type TripfulProfile } from "@/lib/bookings";
import { User, Mail, Phone, Globe, Building2, Award, Calendar, Check, Pencil } from "lucide-react";

export default function ProfilePage() {
  const { lang, setLang } = useLang();
  const [profile, setProfile] = useState<TripfulProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<TripfulProfile | null>(null);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loyalty, setLoyalty] = useState(0);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setDraft(p);
    const stats = computeStats(getBookings());
    setTotalBookings(stats.total);
    setTotalSpent(stats.totalSpent);
    setLoyalty(stats.loyaltyPoints);
  }, []);

  const handleSave = () => {
    if (!draft) return;
    // Auto-compute initials from name
    const initials = draft.name
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "GU";
    const updated = { ...draft, avatarInitials: initials };
    saveProfile(updated);
    setProfile(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!profile || !draft) {
    return (
      <div className="min-h-screen">
        <Navbar lang={lang} setLang={setLang} />
        <div className="max-w-4xl mx-auto px-4 lg:px-8 pt-32 pb-12">
          <div className="tf-skeleton h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} setLang={setLang} />
      <div className="max-w-4xl mx-auto px-4 lg:px-8 pt-24 pb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-2 tf-font-display">{t(lang, "profile")}</h1>
        <p className="text-[#64748B] mb-8">{t(lang, "sign_in_for_bookings")}</p>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="tf-avatar">{profile.avatarInitials}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-2xl font-extrabold text-[#0F172A] tf-font-display">{profile.name}</h2>
                {!editing && (
                  <button onClick={() => { setDraft(profile); setEditing(true); }} className="tf-btn-ghost text-sm">
                    <Pencil className="h-3.5 w-3.5" /> {lang === "ar" ? "تعديل" : "Edit"}
                  </button>
                )}
              </div>
              <div className="space-y-1.5 text-sm text-[#64748B]">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {profile.email}</p>
                {profile.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {profile.phone}</p>}
                <p className="flex items-center gap-2"><Globe className="h-4 w-4" /> {profile.country}, {profile.city}</p>
                <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {t(lang, "member_since")}: {new Date(profile.memberSince).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { year: "numeric", month: "long" })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="tf-stat-card">
            <Award className="h-6 w-6 text-[#1A4D8F] mx-auto mb-2" />
            <div className="tf-stat-value">{loyalty}</div>
            <div className="tf-stat-label">{t(lang, "loyalty_points")}</div>
          </div>
          <div className="tf-stat-card">
            <Building2 className="h-6 w-6 text-[#1A4D8F] mx-auto mb-2" />
            <div className="tf-stat-value">{totalBookings}</div>
            <div className="tf-stat-label">{t(lang, "total_bookings")}</div>
          </div>
          <div className="tf-stat-card col-span-2 md:col-span-1">
            <User className="h-6 w-6 text-[#1A4D8F] mx-auto mb-2" />
            <div className="tf-stat-value">{formatPrice(totalSpent, lang)}</div>
            <div className="tf-stat-label">{t(lang, "total_spent")}</div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
          <h3 className="text-xl font-bold text-[#0F172A] mb-4 tf-font-display flex items-center gap-2">
            <User className="h-5 w-5 text-[#1A4D8F]" /> {t(lang, "account_settings")}
          </h3>

          {!editing ? (
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1">{t(lang, "full_name")}</label>
                <p className="font-semibold text-[#0F172A]">{profile.name}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1">{t(lang, "email_address")}</label>
                <p className="font-semibold text-[#0F172A]">{profile.email}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1">{t(lang, "phone_number")}</label>
                <p className="font-semibold text-[#0F172A]">{profile.phone || "—"}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1">{t(lang, "country")}</label>
                <p className="font-semibold text-[#0F172A]">{profile.country}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1">{t(lang, "city")}</label>
                <p className="font-semibold text-[#0F172A]">{profile.city}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1.5">{t(lang, "full_name")}</label>
                  <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="tf-input" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1.5">{t(lang, "email_address")}</label>
                  <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="tf-input" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1.5">{t(lang, "phone_number")}</label>
                  <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="tf-input" placeholder="+966 5x xxx xxxx" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1.5">{t(lang, "country")}</label>
                  <input value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} className="tf-input" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#475569] block mb-1.5">{t(lang, "city")}</label>
                  <input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} className="tf-input" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="tf-btn-primary">
                  {saved ? (<><Check className="h-4 w-4" /> {lang === "ar" ? "تم الحفظ" : "Saved!"}</>) : t(lang, "save_changes")}
                </button>
                <button onClick={() => { setEditing(false); setDraft(profile); }} className="tf-btn-ghost">{lang === "ar" ? "إلغاء" : "Cancel"}</button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/my-bookings" className="tf-btn-outline">{t(lang, "my_bookings")}</a>
          <a href="/deals" className="tf-btn-outline">{t(lang, "deals")}</a>
          <a href="/hotels" className="tf-btn-primary">{t(lang, "browse_hotels")}</a>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
