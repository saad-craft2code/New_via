// Shared mock data — same structure as Via Trips provider panel.
// When database is connected, these will be replaced with live API calls.

export interface Hotel {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  starRating: number;
  location: string;
  city: string;
  country: string;
  countryAr: string;
  amenities: string[];
  amenitiesAr: string[];
  images: string[];
  coverImage: string;
  totalRooms: number;
  availableRooms: number;
  startingPrice: number;
  currency: string;
  rating: number;
  reviewCount: number;
  propertyType: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  roomType: string;
  bedType: string;
  maxGuests: number;
  pricePerNight: number;
  size?: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

export interface Bundle {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  durationDays: number;
  destinations: string[];
  destinationsAr: string[];
  coverImage: string;
  images: string[];
  price: number;
  currency: string;
  difficulty: string;
  groupSize: number;
  includedServices: string[];
  includedServicesAr: string[];
  rating: number;
  reviewCount: number;
  totalBookings: number;
}

// Using reliable, well-known Unsplash photo IDs that are guaranteed to load
const IMG = {
  hotel1: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80",
  hotel1b: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
  hotel1c: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
  hotel2: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
  hotel2b: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80",
  hotel2c: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
  hotel3: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
  hotel3b: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
  hotel3c: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
  hotel4: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
  hotel4b: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80",
  hotel4c: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80",
  hotel5: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
  hotel5b: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
  hotel5c: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80",
  room1: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  room2: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
  room3: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
  room4: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
  room5: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
  bundle1: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
  bundle2: "https://images.unsplash.com/photo-1591604129939-f1efa4d6f7da?w=1200&q=80",
  bundle3: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&q=80",
  bundle4: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80",
};

export const hotels: Hotel[] = [
  {
    id: "HTL-001",
    name: "Burj Al Arab Jumeirah",
    nameAr: "برج العرب جميرا",
    description: "Rising 321 meters above the Arabian Gulf, this sail-shaped architectural marvel redefines luxury hospitality. Each of its 202 duplex suites spans two floors with floor-to-ceiling windows framing the Dubai skyline. Experience nine world-class restaurants, a private helipad, Rolls-Royce chauffeur service, and a dedicated butler for every guest. The hotel's exclusive private beach and infinity pools offer uninterrupted views of the Palm Jumeirah.",
    starRating: 7,
    location: "Jumeirah Beach Road",
    city: "Dubai",
    country: "United Arab Emirates",
    countryAr: "الإمارات العربية المتحدة",
    amenities: ["Free WiFi", "Private Beach", "Spa", "Infinity Pool", "Fine Dining", "Valet Parking", "Butler Service", "Helipad", "Gym", "Concierge"],
    amenitiesAr: ["واي فاي مجاني", "شاطئ خاص", "سبا", "مسبح لا نهائي", "مطاعم فاخرة", "خدمة الصف", "خدمة البوتر", "مهبط طائرات", "صالة رياضية", "كونسيرج"],
    images: [IMG.hotel1, IMG.hotel1b, IMG.hotel1c],
    coverImage: IMG.hotel1,
    totalRooms: 202,
    availableRooms: 14,
    startingPrice: 1200,
    currency: "$",
    rating: 4.9,
    reviewCount: 3421,
    propertyType: "Luxury Resort",
    rooms: [
      { id: "R1", roomType: "Deluxe One-Bedroom Suite", bedType: "King", maxGuests: 2, pricePerNight: 1200, size: 170, amenities: ["Living Room", "Sea View", "Butler Service", "Jacuzzi"], images: [IMG.room1], available: true },
      { id: "R2", roomType: "Panoramic Suite", bedType: "King", maxGuests: 4, pricePerNight: 2800, size: 340, amenities: ["Panoramic View", "Living Room", "Dining Room", "Butler Service", "Private Bar"], images: [IMG.room2], available: true },
    ],
  },
  {
    id: "HTL-002",
    name: "Raffles Makkah Palace",
    nameAr: "رافلز مكة بالاس",
    description: "Steps from the Grand Mosque, this sanctuary of tranquility offers direct views of the Holy Kaaba from select suites. Every room features a dedicated prayer area oriented towards the Qibla. The hotel's award-winning culinary team serves authentic Hijazi cuisine alongside international favorites. A dedicated Umrah concierge team assists pilgrims with every aspect of their spiritual journey, from Zamzam water arrangements to guided historical tours of Makkah and Madinah.",
    starRating: 5,
    location: "Adjacent to Al-Masjid Al-Haram",
    city: "Makkah",
    country: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
    amenities: ["Free WiFi", "Kaaba View", "Prayer Area", "Fine Dining", "24/7 Room Service", "Umrah Concierge", "Gym", "Parking", "Elevator", "AC"],
    amenitiesAr: ["واي فاي مجاني", "إطلالة الكعبة", "مصلى", "مطاعم فاخرة", "خدمة غرف ٢٤/٧", "كونسيرج العمرة", "صالة رياضية", "موقف سيارات", "مصعد", "تكييف"],
    images: [IMG.hotel2, IMG.hotel2b, IMG.hotel2c],
    coverImage: IMG.hotel2,
    totalRooms: 1258,
    availableRooms: 38,
    startingPrice: 450,
    currency: "$",
    rating: 4.8,
    reviewCount: 5847,
    propertyType: "Hotel",
    rooms: [
      { id: "R3", roomType: "Kaaba View King Room", bedType: "King", maxGuests: 2, pricePerNight: 450, size: 45, amenities: ["Kaaba View", "Prayer Area", "AC", "Mini Fridge"], images: [IMG.room3], available: true },
      { id: "R4", roomType: "Kaaba View Suite", bedType: "King + Twin", maxGuests: 4, pricePerNight: 850, size: 85, amenities: ["Kaaba View", "Living Room", "Prayer Area", "Mini Bar", "AC"], images: [IMG.room4], available: true },
    ],
  },
  {
    id: "HTL-003",
    name: "Corinthia Hotel Tripoli",
    nameAr: "كورينثيا طرابلس",
    description: "A beacon of Mediterranean elegance on the Tripoli waterfront. This architectural gem features 298 rooms adorned with Italian marble and handcrafted Libyan textiles. The rooftop infinity pool offers panoramic views of the Mediterranean Sea and the historic medina. Authentic Libyan cuisine is served at the hotel's signature restaurant, where chefs source ingredients from local markets daily. The spa offers traditional hammam treatments blended with modern wellness therapies.",
    starRating: 5,
    location: "Al-Shat Road, Mediterranean Coast",
    city: "Tripoli",
    country: "Libya",
    countryAr: "ليبيا",
    amenities: ["Free WiFi", "Sea View", "Infinity Pool", "Spa", "Gym", "Restaurant", "Bar", "Parking", "AC", "Concierge"],
    amenitiesAr: ["واي فاي مجاني", "إطلالة بحرية", "مسبح لا نهائي", "سبا", "صالة رياضية", "مطعم", "بار", "موقف سيارات", "تكييف", "كونسيرج"],
    images: [IMG.hotel3, IMG.hotel3b, IMG.hotel3c],
    coverImage: IMG.hotel3,
    totalRooms: 298,
    availableRooms: 22,
    startingPrice: 280,
    currency: "$",
    rating: 4.6,
    reviewCount: 1203,
    propertyType: "Hotel",
    rooms: [
      { id: "R5", roomType: "Deluxe Sea View", bedType: "King", maxGuests: 2, pricePerNight: 280, size: 38, amenities: ["Sea View", "AC", "Mini Bar", "WiFi"], images: [IMG.room1], available: true },
      { id: "R6", roomType: "Executive Suite", bedType: "King", maxGuests: 3, pricePerNight: 520, size: 75, amenities: ["Sea View", "Living Room", "Mini Bar", "Espresso Machine"], images: [IMG.room2], available: true },
    ],
  },
  {
    id: "HTL-004",
    name: "Four Seasons Resort Sharm El-Sheikh",
    nameAr: "فور سيزونز شرم الشيخ",
    description: "Where the Sinai mountains meet the crystal waters of the Red Sea. Set across 1,500 meters of private beachfront, this resort is a diver's paradise with a PADI 5-Star dive center and direct access to some of the world's most spectacular coral reefs. Five cascading swimming pools flow through lush tropical gardens. Eight restaurants serve cuisine from around the globe, while the award-winning spa offers treatments inspired by ancient Egyptian wellness traditions.",
    starRating: 5,
    location: "Sharm El Maya Bay",
    city: "Sharm El-Sheikh",
    country: "Egypt",
    countryAr: "مصر",
    amenities: ["Free WiFi", "Private Beach", "5 Pools", "Diving Center", "Spa", "8 Restaurants", "Kids Club", "Tennis", "Gym", "Parking"],
    amenitiesAr: ["واي فاي مجاني", "شاطئ خاص", "٥ مسابح", "مركز غوص", "سبا", "٨ مطاعم", "نادي أطفال", "تنس", "صالة رياضية", "موقف سيارات"],
    images: [IMG.hotel4, IMG.hotel4b, IMG.hotel4c],
    coverImage: IMG.hotel4,
    totalRooms: 222,
    availableRooms: 52,
    startingPrice: 650,
    currency: "$",
    rating: 4.9,
    reviewCount: 2856,
    propertyType: "Beach Resort",
    rooms: [
      { id: "R7", roomType: "Garden View Room", bedType: "Queen", maxGuests: 2, pricePerNight: 650, size: 48, amenities: ["Terrace", "Garden View", "AC", "WiFi"], images: [IMG.room3], available: true },
      { id: "R8", roomType: "Red Sea View Suite", bedType: "King", maxGuests: 4, pricePerNight: 1100, size: 95, amenities: ["Sea View", "Private Terrace", "Living Room", "Jacuzzi"], images: [IMG.room4], available: true },
    ],
  },
  {
    id: "HTL-005",
    name: "W Amman Hotel",
    nameAr: "دبليو عمّان",
    description: "Contemporary luxury meets ancient hospitality in the heart of Abdoun. Floor-to-ceiling windows frame the cityscape of Amman's seven hills. The signature W Beds feature plush pillow-top mattresses and Egyptian cotton linens. The rooftop pool deck transforms into the city's most exclusive sunset lounge, while the underground nightclub hosts international DJs. Every room comes with a personal W Insider — a local expert who curates personalized experiences from Petra day trips to hidden culinary gems.",
    starRating: 5,
    location: "Abdoun Circle",
    city: "Amman",
    country: "Jordan",
    countryAr: "الأردن",
    amenities: ["Free WiFi", "Rooftop Pool", "Nightclub", "Spa", "Gym", "Restaurant", "Bar", "Valet Parking", "AC", "Pet Friendly"],
    amenitiesAr: ["واي فاي مجاني", "مسبح على السطح", "نادي ليلي", "سبا", "صالة رياضية", "مطعم", "بار", "خدمة الصف", "تكييف", "مسموح بالحيوانات"],
    images: [IMG.hotel5, IMG.hotel5b, IMG.hotel5c],
    coverImage: IMG.hotel5,
    totalRooms: 280,
    availableRooms: 18,
    startingPrice: 380,
    currency: "$",
    rating: 4.7,
    reviewCount: 1923,
    propertyType: "Boutique Hotel",
    rooms: [
      { id: "R9", roomType: "Wonderful Room", bedType: "King", maxGuests: 2, pricePerNight: 380, size: 40, amenities: ["City View", "W Bed", "Mini Bar", "WiFi"], images: [IMG.room5], available: true },
      { id: "R10", roomType: "E-Wow Suite", bedType: "King", maxGuests: 4, pricePerNight: 950, size: 120, amenities: ["Panoramic View", "DJ Booth", "Living Room", "Private Bar", "Jacuzzi"], images: [IMG.room2], available: true },
    ],
  },
];

export const bundles: Bundle[] = [
  {
    id: "BND-001",
    title: "Dubai Luxury Experience — 5 Days",
    titleAr: "تجربة دبي الفاخرة — ٥ أيام",
    description: "An immersive journey through Dubai's most exclusive experiences. Board a private yacht for a sunset cruise around Palm Jumeirah. Dine at Burj Al Arab's Al Muntaha, 200 meters above the sea. Experience a VIP desert safari with falconry demonstration and a private tent under the stars. Enjoy exclusive sunrise access to the Burj Khalifa observation deck — the world's tallest building — before the crowds arrive.",
    durationDays: 5,
    destinations: ["Dubai", "Abu Dhabi"],
    destinationsAr: ["دبي", "أبو ظبي"],
    coverImage: IMG.bundle1,
    images: [IMG.bundle1],
    price: 4200,
    currency: "$",
    difficulty: "Easy",
    groupSize: 12,
    includedServices: ["5-Star Hotel", "Daily Breakfast", "Private Yacht Tour", "Desert Safari", "Burj Khalifa Access", "Airport Transfers", "English-Speaking Guide"],
    includedServicesAr: ["فندق ٥ نجوم", "إفطار يومي", "جولة يخت خاصة", "سفاري الصحراء", "دخول برج خليفة", "نقل المطار", "مرشد ناطق بالإنجليزية"],
    rating: 4.9,
    reviewCount: 348,
    totalBookings: 87,
  },
  {
    id: "BND-002",
    title: "Spiritual Umrah Journey — 7 Days",
    titleAr: "رحلة العمرة الروحانية — ٧ أيام",
    description: "A transformative pilgrimage designed with meticulous attention to spiritual needs. Stay in a Kaaba-view suite at Raffles Makkah Palace. A dedicated scholar-guide accompanies you throughout, providing historical context at Jabal al-Nour, the Cave of Hira, and the sites of the Battle of Badr. In Madinah, visit the Prophet's Mosque, Quba Mosque, and the Uhud battlefield. Daily Zamzam water service and private prayer arrangements included.",
    durationDays: 7,
    destinations: ["Makkah", "Madinah"],
    destinationsAr: ["مكة المكرمة", "المدينة المنورة"],
    coverImage: IMG.bundle2,
    images: [IMG.bundle2],
    price: 2800,
    currency: "$",
    difficulty: "Easy",
    groupSize: 20,
    includedServices: ["Kaaba View Hotel", "Half Board", "Umrah Guide", "Zamzam Water", "Historical Tours", "Transfers", "Arabic Guide"],
    includedServicesAr: ["فندق بإطلالة الكعبة", "نصف إقامة", "مرشد عمرة", "ماء زمزم", "جولات تاريخية", "نقل", "مرشد عربي"],
    rating: 4.9,
    reviewCount: 892,
    totalBookings: 234,
  },
  {
    id: "BND-003",
    title: "Red Sea & Sinai Adventure — 6 Days",
    titleAr: "مغامرة البحر الأحمر وسيناء — ٦ أيام",
    description: "An adventure that combines the underwater wonders of the Red Sea with the spiritual heights of Mount Sinai. Begin with a PADI Open Water diving certification course at the Four Seasons dive center. Explore Ras Mohammed National Park's vibrant coral walls. Then journey into the Sinai interior for a midnight ascent of Mount Moses, arriving at the summit for a breathtaking sunrise. Visit the 6th-century St. Catherine's Monastery, home to the Burning Bush.",
    durationDays: 6,
    destinations: ["Sharm El-Sheikh", "Mount Sinai"],
    destinationsAr: ["شرم الشيخ", "جبل موسى"],
    coverImage: IMG.bundle3,
    images: [IMG.bundle3],
    price: 3100,
    currency: "$",
    difficulty: "Moderate",
    groupSize: 15,
    includedServices: ["Beach Resort", "All Inclusive", "PADI Diving Course", "Mount Sinai Hike", "Monastery Visit", "Equipment", "Guide"],
    includedServicesAr: ["منتجع شاطئي", "شامل كامل", "دورة غوص بادي", "تسلق جبل موسى", "زيارة الدير", "معدات", "مرشد"],
    rating: 4.8,
    reviewCount: 215,
    totalBookings: 64,
  },
  {
    id: "BND-004",
    title: "Libya & Jordan Heritage Tour — 8 Days",
    titleAr: "جولة ليبيا والأردن التراثية — ٨ أيام",
    description: "A journey through 3,000 years of history. Begin in Tripoli at the Corinthia, then drive to Leptis Magna — the best-preserved Roman city in the world, a UNESCO World Heritage site with its magnificent amphitheater and marble forum. Fly to Amman and continue to Petra, the Rose City carved into sandstone cliffs by the Nabataeans 2,000 years ago. Walk the Siq canyon at dawn, explore the Royal Tombs, and dine under the stars at a Bedouin camp.",
    durationDays: 8,
    destinations: ["Tripoli", "Amman", "Petra"],
    destinationsAr: ["طرابلس", "عمّان", "البتراء"],
    coverImage: IMG.bundle4,
    images: [IMG.bundle4],
    price: 3800,
    currency: "$",
    difficulty: "Moderate",
    groupSize: 12,
    includedServices: ["4-Star Hotels", "Daily Breakfast", "Archaeological Guide", "Leptis Magna Tour", "Petra Tour", "Flights", "All Transfers"],
    includedServicesAr: ["فنادق ٤ نجوم", "إفطار يومي", "مرشد أثري", "جولة لبدة الكبرى", "جولة البتراء", "رحلات جوية", "جميع التنقلات"],
    rating: 4.7,
    reviewCount: 128,
    totalBookings: 41,
  },
];

export const cities = ["Dubai", "Makkah", "Tripoli", "Sharm El-Sheikh", "Amman"];
export const countries = ["United Arab Emirates", "Saudi Arabia", "Libya", "Egypt", "Jordan"];

export const allAmenities = [
  { en: "Free WiFi", ar: "واي فاي مجاني" },
  { en: "Pool", ar: "مسبح" },
  { en: "Spa", ar: "سبا" },
  { en: "Gym", ar: "صالة رياضية" },
  { en: "Restaurant", ar: "مطعم" },
  { en: "Parking", ar: "موقف سيارات" },
  { en: "AC", ar: "تكييف" },
  { en: "Concierge", ar: "كونسيرج" },
  { en: "Sea View", ar: "إطلالة بحرية" },
  { en: "Private Beach", ar: "شاطئ خاص" },
  { en: "Fine Dining", ar: "مطاعم فاخرة" },
  { en: "Butler Service", ar: "خدمة البوتر" },
];

export const testimonials = [
  { name: "Ahmed Al-Rashid", nameAr: "أحمد الراشد", country: "Saudi Arabia", countryAr: "السعودية", avatar: "https://i.pravatar.cc/150?img=12", rating: 5, text: "Best booking experience I've ever had. The Umrah package was flawless — from Kaaba-view room to guided tours. Highly recommended!", textAr: "أفضل تجربة حجز على الإطلاق. باقة العمرة كانت مثالية — من غرفة بإطلالة الكعبة إلى الجولات الموجهة. أنصح بها بشدة!" },
  { name: "Fatima Hassan", nameAr: "فاطمة حسن", country: "UAE", countryAr: "الإمارات", avatar: "https://i.pravatar.cc/150?img=44", rating: 5, text: "The Dubai luxury bundle exceeded all expectations. Private yacht, desert safari, Burj Khalifa — everything was perfectly organized.", textAr: "باقة دبي الفاخرة فاقت كل التوقعات. يخت خاص، سفاري الصحراء، برج خليفة — كل شيء كان منظمًا بشكل مثالي." },
  { name: "Omar Farouk", nameAr: "عمر فاروق", country: "Egypt", countryAr: "مصر", avatar: "https://i.pravatar.cc/150?img=51", rating: 5, text: "Booked the Red Sea adventure — diving course was incredible. The resort was world-class. Will definitely book again!", textAr: "حجزت مغامرة البحر الأحمر — دورة الغوص كانت مذهلة. المنتجع كان عالمي المستوى. سأحجز مرة أخرى بالتأكيد!" },
];
