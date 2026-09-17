"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BrandLogo } from "@/components/provider/brand-logo";
import { HotelStars, StarRating, formatCurrency, EmptyState } from "@/components/widgets";
import { guestService, type GuestHotel, type GuestBundle, type GuestHotelDetail, type GuestBundleDetail } from "@/services/guest.service";
import { Hotel, Package, MapPin, Search, Star, Users, Calendar, ArrowLeft, ArrowRight, Moon, Sun, Globe, Loader2, Compass, Heart, Share2, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/hooks/use-mounted";
import { toast } from "react-hot-toast";
import { HotelBookingForm, BundleBookingForm } from "./guest-booking-forms";

type Tab = "hotels" | "bundles";

export function GuestBrowse() {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const setLang = useAppStore((s) => s.setLang);
  const setTheme = useAppStore((s) => s.setTheme);
  const setAuthScreen = useAppStore((s) => s.setAuthScreen);
  const isRtl = lang === "ar";
  const Back = isRtl ? ArrowRight : ArrowLeft;
  const mounted = useMounted();

  const [tab, setTab] = useState<Tab>("hotels");
  const [hotels, setHotels] = useState<GuestHotel[]>([]);
  const [bundles, setBundles] = useState<GuestBundle[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [city, setCity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [starRating, setStarRating] = useState<string>("all");
  const [destination, setDestination] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const [selectedHotel, setSelectedHotel] = useState<GuestHotelDetail | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<GuestBundleDetail | null>(null);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [bundleLoading, setBundleLoading] = useState(false);

  // Hero stats
  const [stats, setStats] = useState({ totalHotels: 0, totalBundles: 0, totalBookings: 0, totalProviders: 0, cities: [] as string[] });

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [h, b, s] = await Promise.all([
        guestService.listHotels({ search, city: city === "all" ? undefined : city, starRating: starRating === "all" ? undefined : starRating, sortBy }),
        guestService.listBundles({ search, destination: destination === "all" ? undefined : destination, difficulty: difficulty === "all" ? undefined : difficulty, maxPrice: maxPrice || undefined, sortBy }),
        guestService.getStats(),
      ]);
      setHotels(h);
      setBundles(b);
      setStats(s);
    } catch (e) {
      console.error("loadAll error", e);
      toast.error(lang === "ar" ? "تعذّر تحميل البيانات" : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [search, city, sortBy, starRating, destination, difficulty, maxPrice, lang]);

  useEffect(() => {
    const id = setTimeout(loadAll, 300);
    return () => clearTimeout(id);
  }, [loadAll]);

  async function openHotel(id: string) {
    setHotelLoading(true);
    setSelectedHotel(null);
    try {
      const h = await guestService.getHotel(id);
      setSelectedHotel(h);
    } catch (e) {
      toast.error(lang === "ar" ? "تعذّر تحميل تفاصيل الفندق" : "Failed to load hotel details");
    } finally {
      setHotelLoading(false);
    }
  }

  async function openBundle(id: string) {
    setBundleLoading(true);
    setSelectedBundle(null);
    try {
      const b = await guestService.getBundle(id);
      setSelectedBundle(b);
    } catch (e) {
      toast.error(lang === "ar" ? "تعذّر تحميل تفاصيل الباقة" : "Failed to load bundle details");
    } finally {
      setBundleLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="gap-1.5">
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:inline">{t("language_toggle", lang)}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAuthScreen("login")} className="hidden sm:inline-flex">
              {t("cta_login", lang)}
            </Button>
            <Button size="sm" onClick={() => setAuthScreen("role_selection")} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
              {t("cta_get_started", lang)}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 oasis-mesh pointer-events-none opacity-50" />
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-12 lg:py-20 relative">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-5">
              <Compass className="h-3.5 w-3.5" />
              {lang === "ar" ? "استكشف كضيف" : "Browse as Guest"}
            </span>
            <h1 className="display-heading mb-5 bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-primary">
              {lang === "ar" ? "اكتشف الفنادق والباقات الفاخرة" : "Discover luxury stays & curated bundles"}
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground mb-8 leading-relaxed">
              {lang === "ar"
                ? "تصفّح أرقى الفنادق والباقات السياحية المعتمدة من مقدمي خدمة فيا تريبس. اختر وجهتك، ابحث عن إقامتك المثالية، واحجز في دقائق."
                : "Browse premium hotels and curated travel bundles from verified Via Trips providers. Pick your destination, find the perfect stay, and book in minutes."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setAuthScreen("role_selection")} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12 px-7">
                {t("cta_get_started", lang)}
                {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
              <Button size="lg" variant="outline" onClick={() => setAuthScreen("landing")} className="h-12 px-7 gap-2">
                <Back className="h-4 w-4" />
                {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: lang === "ar" ? "فندق شريك" : "Partner Hotels", value: stats.totalHotels || "—" },
              { label: lang === "ar" ? "باقة سفر" : "Travel Bundles", value: stats.totalBundles || "—" },
              { label: lang === "ar" ? "حجز ناجح" : "Bookings", value: stats.totalBookings.toLocaleString() },
              { label: lang === "ar" ? "مقدم خدمة" : "Providers", value: stats.totalProviders.toLocaleString() },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <Card className="border-border/70 bg-background/60 backdrop-blur">
                  <CardContent className="p-4">
                    <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + listings */}
      <main className="container mx-auto max-w-7xl px-4 lg:px-8 py-10 flex-1">
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="hotels" className="gap-2">
                <Hotel className="h-4 w-4" />
                {lang === "ar" ? "الفنادق" : "Hotels"}
                <Badge variant="secondary" className="ml-1">{hotels.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="bundles" className="gap-2">
                <Package className="h-4 w-4" />
                {lang === "ar" ? "الباقات" : "Bundles"}
                <Badge variant="secondary" className="ml-1">{bundles.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Common search */}
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن فندق، مدينة، باقة..." : "Search hotels, cities, bundles..."}
                className="pl-9 rtl:pl-3 rtl:pr-9"
              />
            </div>
          </div>

          {/* Hotel filters */}
          <TabsContent value="hotels">
            <div className="flex flex-wrap gap-3 mb-6">
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder={lang === "ar" ? "كل المدن" : "All Cities"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang === "ar" ? "كل المدن" : "All Cities"}</SelectItem>
                  {(stats.cities.length ? stats.cities : Array.from(new Set(hotels.map((h) => h.city)))).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={starRating} onValueChange={setStarRating}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder={lang === "ar" ? "كل التصنيفات" : "Any Stars"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang === "ar" ? "كل التصنيفات" : "Any Stars"}</SelectItem>
                  <SelectItem value="3">3★ +</SelectItem>
                  <SelectItem value="4">4★ +</SelectItem>
                  <SelectItem value="5">5★ +</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">{lang === "ar" ? "الأحدث" : "Newest"}</SelectItem>
                  <SelectItem value="starRating">{lang === "ar" ? "الأعلى تصنيفًا" : "Top Rated"}</SelectItem>
                  <SelectItem value="name">{lang === "ar" ? "الاسم" : "Name (A-Z)"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <ListingSkeleton />
            ) : hotels.length === 0 ? (
              <EmptyState icon={Hotel} title={lang === "ar" ? "لا فنادق مطابقة" : "No hotels match"} desc={lang === "ar" ? "جرّب تعديل عوامل التصفية" : "Try adjusting your filters"} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {hotels.map((h, idx) => (
                  <HotelCard key={h.id} hotel={h} lang={lang} onClick={() => openHotel(h.id)} delay={idx * 0.05} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Bundle filters */}
          <TabsContent value="bundles">
            <div className="flex flex-wrap gap-3 mb-6">
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder={lang === "ar" ? "كل الوجهات" : "All Destinations"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang === "ar" ? "كل الوجهات" : "All Destinations"}</SelectItem>
                  {Array.from(new Set(bundles.flatMap((b) => b.destinations))).map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder={lang === "ar" ? "كل المستويات" : "Any Difficulty"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang === "ar" ? "كل المستويات" : "Any Difficulty"}</SelectItem>
                  <SelectItem value="easy">{lang === "ar" ? "سهل" : "Easy"}</SelectItem>
                  <SelectItem value="moderate">{lang === "ar" ? "متوسط" : "Moderate"}</SelectItem>
                  <SelectItem value="challenging">{lang === "ar" ? "صعب" : "Challenging"}</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder={lang === "ar" ? "السعر الأقصى" : "Max Price (SAR)"}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-[180px]"
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">{lang === "ar" ? "الأحدث" : "Newest"}</SelectItem>
                  <SelectItem value="price">{lang === "ar" ? "الأقل سعرًا" : "Price (Low-High)"}</SelectItem>
                  <SelectItem value="durationDays">{lang === "ar" ? "المدة" : "Duration"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <ListingSkeleton />
            ) : bundles.length === 0 ? (
              <EmptyState icon={Package} title={lang === "ar" ? "لا باقات مطابقة" : "No bundles match"} desc={lang === "ar" ? "جرّب تعديل عوامل التصفية" : "Try adjusting your filters"} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {bundles.map((b, idx) => (
                  <BundleCard key={b.id} bundle={b} lang={lang} onClick={() => openBundle(b.id)} delay={idx * 0.05} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <BrandLogo />
            <p className="text-xs text-muted-foreground">
              {lang === "ar" ? "© 2026 فيا تريبس. جميع الحقوق محفوظة." : "© 2026 Via Trips. All rights reserved."}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" />{lang === "ar" ? "مدفوعات آمنة" : "Secure payments"}</span>
              <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" />{lang === "ar" ? "مقدمون موثّقون" : "Verified providers"}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Hotel detail dialog */}
      <Dialog open={!!selectedHotel || hotelLoading} onOpenChange={(o) => !o && setSelectedHotel(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {hotelLoading ? (
            <div className="py-20 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : selectedHotel ? (
            <HotelDetail hotel={selectedHotel} lang={lang} />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Bundle detail dialog */}
      <Dialog open={!!selectedBundle || bundleLoading} onOpenChange={(o) => !o && setSelectedBundle(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {bundleLoading ? (
            <div className="py-20 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : selectedBundle ? (
            <BundleDetail bundle={selectedBundle} lang={lang} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HotelCard({ hotel, lang, onClick, delay }: { hotel: GuestHotel; lang: "ar" | "en"; onClick: () => void; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={onClick}>
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {hotel.coverImage ? (
             
            <img src={hotel.coverImage} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Hotel className="h-10 w-10 text-muted-foreground/50" /></div>
          )}
          <div className="absolute top-2 right-2 rtl:left-2 rtl:right-auto flex items-center gap-1">
            <Badge className="bg-background/90 text-foreground backdrop-blur">{hotel.starRating}★</Badge>
          </div>
          <div className="absolute bottom-2 left-2 rtl:right-2 rtl:left-auto">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur">
              <MapPin className="h-3 w-3 me-1" />
              {hotel.city || hotel.location}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base line-clamp-1">{hotel.name}</h3>
            <div className="flex items-center gap-0.5 text-xs">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{(4 + Math.min(0.9, hotel.bookingCount / 100)).toFixed(1)}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5">{hotel.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.amenities.slice(0, 4).map((a) => (
              <Badge key={a} variant="outline" className="text-[10px] font-normal">{a}</Badge>
            ))}
            {hotel.amenities.length > 4 && <Badge variant="outline" className="text-[10px] font-normal">+{hotel.amenities.length - 4}</Badge>}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">{lang === "ar" ? "يبدأ من" : "From"}</span>
              <p className="font-bold text-primary">{formatCurrency(hotel.startingPrice, lang)}<span className="text-xs text-muted-foreground font-normal"> / {lang === "ar" ? "ليلة" : "night"}</span></p>
            </div>
            <Button size="sm">{lang === "ar" ? "عرض التفاصيل" : "View Details"}</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function BundleCard({ bundle, lang, onClick, delay }: { bundle: GuestBundle; lang: "ar" | "en"; onClick: () => void; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={onClick}>
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {bundle.coverImage ? (
             
            <img src={bundle.coverImage} alt={bundle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Package className="h-10 w-10 text-muted-foreground/50" /></div>
          )}
          <div className="absolute top-2 right-2 rtl:left-2 rtl:right-auto">
            <Badge className="bg-background/90 text-foreground backdrop-blur capitalize">{bundle.difficulty}</Badge>
          </div>
          <div className="absolute bottom-2 left-2 rtl:right-2 rtl:left-auto flex flex-wrap gap-1">
            {bundle.destinations.slice(0, 3).map((d) => (
              <Badge key={d} variant="secondary" className="bg-background/90 backdrop-blur text-[10px]"><MapPin className="h-3 w-3 me-1" />{d}</Badge>
            ))}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-base line-clamp-1">{bundle.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5">{bundle.description}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{bundle.days}{lang === "ar" ? "ي" : "d"} / {bundle.nights}{lang === "ar" ? "ل" : "n"}</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{bundle.groupSizeMax}</span>
            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{bundle.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">{lang === "ar" ? "يبدأ من" : "From"}</span>
              <p className="font-bold text-primary">{formatCurrency(bundle.startingPrice, lang)}</p>
            </div>
            <Button size="sm">{lang === "ar" ? "عرض الباقة" : "View Bundle"}</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function HotelDetail({ hotel, lang }: { hotel: GuestHotelDetail; lang: "ar" | "en" }) {
  const [bookingRoom, setBookingRoom] = useState<typeof hotel.rooms[number] | null>(null);
  return (
    <div>
      <div className="relative aspect-[16/8] overflow-hidden rounded-lg mb-5 bg-muted">
        {hotel.coverImage ? (
           
          <img src={hotel.coverImage} alt={hotel.name} className="w-full h-full object-cover" />
        ) : null}
      </div>
      <DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <HotelStars rating={hotel.starRating} />
              <Badge variant="outline">{hotel.propertyType}</Badge>
            </div>
            <DialogTitle className="text-2xl mt-1">{hotel.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5" /> {hotel.city || hotel.location} • {hotel.ownerName}
            </DialogDescription>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="icon"><Heart className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </DialogHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        <Stat label={lang === "ar" ? "غرف متاحة" : "Available Rooms"} value={`${hotel.availableRooms}/${hotel.totalRooms}`} />
        <Stat label={lang === "ar" ? "نسبة الإشغال" : "Occupancy"} value={`${hotel.occupancyRate}%`} />
        <Stat label={lang === "ar" ? "الحجوزات" : "Bookings"} value={hotel.bookingCount} />
        <Stat label={lang === "ar" ? "يبدأ من" : "From"} value={formatCurrency(hotel.startingPrice, lang)} />
      </div>

      <h3 className="font-semibold mt-6 mb-2">{lang === "ar" ? "نبذة" : "About"}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{hotel.description}</p>

      <h3 className="font-semibold mt-6 mb-2">{lang === "ar" ? "المرافق" : "Amenities"}</h3>
      <div className="flex flex-wrap gap-2">
        {hotel.amenities.map((a) => (
          <Badge key={a} variant="outline">{a}</Badge>
        ))}
      </div>

      <h3 className="font-semibold mt-6 mb-3">{lang === "ar" ? "الغرف المتاحة" : "Available Rooms"}</h3>
      <div className="space-y-3">
        {hotel.rooms.length === 0 ? (
          <EmptyState icon={Hotel} title={lang === "ar" ? "لا توجد غرف" : "No rooms listed"} />
        ) : (
          hotel.rooms.map((r) => (
            <Card key={r.id} className="overflow-hidden">
              <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                <div className="md:w-32 h-24 md:h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {r.images[0] ? (
                     
                    <img src={r.images[0]} alt={r.roomType} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{r.roomType}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.bedType} • {r.maxGuests} {lang === "ar" ? "ضيوف" : "guests"} • {r.size ? `${r.size} m²` : ""}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {r.amenities.slice(0, 3).map((a) => (
                        <Badge key={a} variant="outline" className="text-[10px] font-normal">{a}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right rtl:text-left">
                    <p className="text-xs text-muted-foreground">{lang === "ar" ? "متاح" : "Available"}: {r.availableUnits}/{r.totalUnits}</p>
                    <p className="font-bold text-primary">{formatCurrency(r.pricePerNight, lang)}<span className="text-xs text-muted-foreground font-normal"> / {lang === "ar" ? "ليلة" : "night"}</span></p>
                    <Button size="sm" className="mt-2" onClick={() => setBookingRoom(r)} disabled={r.availableUnits === 0}>
                      {r.availableUnits === 0 ? (lang === "ar" ? "نفدت" : "Sold Out") : (lang === "ar" ? "احجز الآن" : "Book Now")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AnimatePresence>
        {bookingRoom && (
          <HotelBookingForm hotel={hotel} room={bookingRoom} lang={lang} onClose={() => setBookingRoom(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function BundleDetail({ bundle, lang }: { bundle: GuestBundleDetail; lang: "ar" | "en" }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  return (
    <div>
      <div className="relative aspect-[16/8] overflow-hidden rounded-lg mb-5 bg-muted">
        {bundle.coverImage ? (
           
          <img src={bundle.coverImage} alt={bundle.title} className="w-full h-full object-cover" />
        ) : null}
      </div>
      <DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="capitalize">{bundle.difficulty}</Badge>
              <Badge variant="outline">{bundle.days}{lang === "ar" ? "أيام" : "days"}</Badge>
              <Badge variant="outline">{bundle.groupSizeMin}-{bundle.groupSizeMax} {lang === "ar" ? "أشخاص" : "pax"}</Badge>
            </div>
            <DialogTitle className="text-2xl mt-1">{bundle.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 mt-1">
              <MapPin className="h-3.5 w-3.5" /> {bundle.destinations.join(" • ")}
              {bundle.guideName && <span className="mx-1">•</span>}
              {bundle.guideName && <span>👨‍🏫 {bundle.guideName}</span>}
            </DialogDescription>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="icon"><Heart className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </DialogHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        <Stat label={lang === "ar" ? "السعر يبدأ من" : "From Price"} value={formatCurrency(bundle.price, lang)} />
        <Stat label={lang === "ar" ? "إجمالي الحجوزات" : "Total Bookings"} value={bundle.totalBookings} />
        <Stat label={lang === "ar" ? "التقييم" : "Rating"} value={`★ ${bundle.rating.toFixed(1)}`} />
        <Stat label={lang === "ar" ? "الإيرادات" : "Revenue"} value={formatCurrency(bundle.revenue, lang)} />
      </div>

      <h3 className="font-semibold mt-6 mb-2">{lang === "ar" ? "نبذة" : "About this bundle"}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{bundle.description}</p>

      <h3 className="font-semibold mt-6 mb-2">{lang === "ar" ? "خدمات مشمولة" : "Included Services"}</h3>
      <div className="flex flex-wrap gap-2">
        {bundle.includedServices.map((s) => (
          <Badge key={s} variant="outline">{s}</Badge>
        ))}
      </div>

      <h3 className="font-semibold mt-6 mb-3">{lang === "ar" ? "برنامج الرحلة" : "Itinerary"}</h3>
      <div className="space-y-3">
        {bundle.itinerary.map((day) => (
          <Card key={day.dayNumber}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {day.dayNumber}
                </div>
                <div>
                  <p className="font-medium">{day.title}</p>
                  {day.description && <p className="text-xs text-muted-foreground">{day.description}</p>}
                </div>
              </div>
              <div className="space-y-2 ms-11">
                {day.items.map((it) => (
                  <div key={it.id} className="text-xs border-s-2 border-primary/30 ps-3 py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{it.startTime}{it.endTime && ` - ${it.endTime}`}</span>
                      <Badge variant="secondary" className="text-[10px] capitalize">{it.type}</Badge>
                    </div>
                    <p className="text-muted-foreground mt-0.5">{it.title}{it.location && ` • ${it.location}`}</p>
                    {it.description && <p className="text-muted-foreground/70 mt-0.5">{it.description}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 sticky bottom-0 bg-background/95 backdrop-blur border-t border-border p-4 -mx-6 -mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{lang === "ar" ? "يبدأ من" : "From"}</p>
            <p className="font-bold text-xl text-primary">{formatCurrency(bundle.price, lang)}</p>
          </div>
          <Button size="lg" onClick={() => setBookingOpen(true)} className="gap-2">
            {lang === "ar" ? "احجز الباقة الآن" : "Book this Bundle"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {bookingOpen && (
          <BundleBookingForm bundle={bundle} lang={lang} onClose={() => setBookingOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border p-3 bg-muted/30">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-base font-bold mt-0.5">{value}</p>
    </div>
  );
}

function ListingSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-[16/10] bg-muted animate-pulse" />
          <CardContent className="p-4 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
            <div className="flex justify-between mt-3">
              <div className="h-6 bg-muted rounded w-20 animate-pulse" />
              <div className="h-8 bg-muted rounded w-24 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
