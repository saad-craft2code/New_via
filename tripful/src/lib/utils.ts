import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, lang: "en" | "ar" = "en") {
  const formatted = new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", { maximumFractionDigits: 0 }).format(amount);
  return lang === "ar" ? `${formatted} ر.س` : `$${formatted}`;
}

export const translations = {
  en: {
    brand: "Tripful",
    tagline: "Book your perfect stay",
    search_placeholder: "Where are you going?",
    search_btn: "Search",
    check_in: "Check-in",
    check_out: "Check-out",
    guests: "Guests",
    hotels: "Hotels",
    bundles: "Travel Bundles",
    per_night: "/ night",
    per_person: "/ person",
    available: "Available",
    sold_out: "Sold Out",
    book_now: "Book Now",
    view_details: "View Details",
    amenities: "Amenities",
    rooms: "Rooms",
    included: "What's Included",
    duration: "Duration",
    destinations: "Destinations",
    difficulty: "Difficulty",
    group_size: "Group Size",
    reviews: "Reviews",
    guest_name: "Full Name",
    email: "Email",
    phone: "Phone",
    special_requests: "Special Requests",
    confirm_booking: "Confirm Booking",
    booking_confirmed: "Booking Confirmed!",
    booking_confirmed_desc: "We'll send you a confirmation email shortly.",
    back_home: "Back to Home",
    featured_hotels: "Featured Hotels",
    featured_bundles: "Popular Travel Bundles",
    explore: "Explore",
    nights: "nights",
    days: "days",
    login: "Login",
    register: "Sign Up",
    logout: "Logout",
    my_bookings: "My Bookings",
    footer_about: "About Tripful",
    footer_about_desc: "Your trusted partner for unforgettable travel experiences.",
    footer_links: "Quick Links",
    footer_contact: "Contact",
    footer_rights: "© 2026 Tripful. All rights reserved.",
  },
  ar: {
    brand: "تريبفول",
    tagline: "احجز إقامتك المثالية",
    search_placeholder: "إلى أين تذهب؟",
    search_btn: "بحث",
    check_in: "تاريخ الوصول",
    check_out: "تاريخ المغادرة",
    guests: "الضيوف",
    hotels: "الفنادق",
    bundles: "باقات السفر",
    per_night: "/ ليلة",
    per_person: "/ شخص",
    available: "متاح",
    sold_out: "نفدت",
    book_now: "احجز الآن",
    view_details: "عرض التفاصيل",
    amenities: "المرافق",
    rooms: "الغرف",
    included: "المشمول",
    duration: "المدة",
    destinations: "الوجهات",
    difficulty: "المستوى",
    group_size: "حجم المجموعة",
    reviews: "التقييمات",
    guest_name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    special_requests: "طلبات خاصة",
    confirm_booking: "تأكيد الحجز",
    booking_confirmed: "تم تأكيد الحجز!",
    booking_confirmed_desc: "سنرسل لك رسالة تأكيد قريبًا.",
    back_home: "العودة للرئيسية",
    featured_hotels: "فنادق مميزة",
    featured_bundles: "باقات سفر رائجة",
    explore: "استكشف",
    nights: "ليالٍ",
    days: "أيام",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    my_bookings: "حجوزاتي",
    footer_about: "عن تريبفول",
    footer_about_desc: "شريكك الموثوق لتجارب سفر لا تُنسى.",
    footer_links: "روابط سريعة",
    footer_contact: "تواصل معنا",
    footer_rights: "© 2026 تريبفول. جميع الحقوق محفوظة.",
  },
};

export type Lang = "en" | "ar";
export type Dict = typeof translations.en;

export function t(lang: Lang, key: keyof Dict): string {
  return translations[lang][key] ?? key;
}
