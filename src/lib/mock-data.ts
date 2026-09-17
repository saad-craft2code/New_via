// Comprehensive mock data for Via Trips Provider Panel

export interface Bundle {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  days: number;
  nights: number;
  destinations: string[];
  type: string;
  coverImage: string;
  startingPrice: number;
  totalBookings: number;
  rating: number;
  status: "published" | "draft" | "archived" | "sold_out";
  difficulty: "Easy" | "Moderate" | "Challenging";
  groupSizeMin: number;
  groupSizeMax: number;
  views: number;
  wishlist: number;
  conversionRate: number;
  revenue: number;
}

export const mockBundles: Bundle[] = [
  {
    id: "BND-001",
    titleAr: "سحر دبي - 5 أيام",
    titleEn: "Dubai Magic - 5 Days",
    descriptionAr: "جولة شاملة في دبي تشمل برج خليفة والنخلة والصحراء",
    descriptionEn: "Comprehensive Dubai tour including Burj Khalifa, Palm Jumeirah, and desert safari",
    days: 5,
    nights: 4,
    destinations: ["Dubai", "Abu Dhabi"],
    type: "City Tour",
    coverImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    startingPrice: 4200,
    totalBookings: 87,
    rating: 4.7,
    status: "published",
    difficulty: "Easy",
    groupSizeMin: 2,
    groupSizeMax: 12,
    views: 3421,
    wishlist: 215,
    conversionRate: 2.54,
    revenue: 365400,
  },
  {
    id: "BND-002",
    titleAr: "عمرة روحانية - 7 أيام",
    titleEn: "Spiritual Umrah - 7 Days",
    descriptionAr: "رحلة عمرة متكاملة مع زيارة الأماكن المقدسة في مكة والمدينة",
    descriptionEn: "Complete Umrah package with visits to holy sites in Makkah and Madinah",
    days: 7,
    nights: 6,
    destinations: ["Makkah", "Madinah"],
    type: "Religious",
    coverImage: "https://images.unsplash.com/photo-1591604425215-2dad9f5c0b09?w=800&q=80",
    startingPrice: 5800,
    totalBookings: 142,
    rating: 4.9,
    status: "published",
    difficulty: "Easy",
    groupSizeMin: 1,
    groupSizeMax: 20,
    views: 5892,
    wishlist: 432,
    conversionRate: 2.41,
    revenue: 823600,
  },
  {
    id: "BND-003",
    titleAr: "مغامرات جبال لبنان",
    titleEn: "Lebanon Mountain Adventure",
    descriptionAr: "مغامرات المشي والطبيعة في جبال لبنان الخلابة",
    descriptionEn: "Hiking and nature adventures in the stunning Lebanese mountains",
    days: 4,
    nights: 3,
    destinations: ["Beirut", "Cedars"],
    type: "Adventure",
    coverImage: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&q=80",
    startingPrice: 3100,
    totalBookings: 34,
    rating: 4.6,
    status: "published",
    difficulty: "Challenging",
    groupSizeMin: 4,
    groupSizeMax: 10,
    views: 1842,
    wishlist: 98,
    conversionRate: 1.85,
    revenue: 105400,
  },
  {
    id: "BND-004",
    titleAr: "شاطئ شرم الشيخ الفاخر",
    titleEn: "Luxury Sharm El-Sheikh Beach",
    descriptionAr: "عطلة شاطئية فاخرة في شرم الشيخ مع الغوص والرياضات المائية",
    descriptionEn: "Luxury beach holiday in Sharm El-Sheikh with diving and water sports",
    days: 6,
    nights: 5,
    destinations: ["Sharm El-Sheikh"],
    type: "Beach Holiday",
    coverImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    startingPrice: 6500,
    totalBookings: 56,
    rating: 4.8,
    status: "published",
    difficulty: "Easy",
    groupSizeMin: 2,
    groupSizeMax: 8,
    views: 2156,
    wishlist: 167,
    conversionRate: 2.6,
    revenue: 364000,
  },
  {
    id: "BND-005",
    titleAr: "عرس العسل في أنطاليا",
    titleEn: "Honeymoon in Antalya",
    descriptionAr: "باقة شهر عسل رومانسية في أنطاليا مع الإقامة الفاخرة",
    descriptionEn: "Romantic honeymoon package in Antalya with luxury accommodation",
    days: 8,
    nights: 7,
    destinations: ["Antalya"],
    type: "Honeymoon",
    coverImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    startingPrice: 8900,
    totalBookings: 23,
    rating: 4.9,
    status: "published",
    difficulty: "Easy",
    groupSizeMin: 2,
    groupSizeMax: 2,
    views: 1456,
    wishlist: 287,
    conversionRate: 1.58,
    revenue: 204700,
  },
  {
    id: "BND-006",
    titleAr: "ثقافة الأردن القديمة",
    titleEn: "Ancient Jordan Culture",
    descriptionAr: "استكشاف البتراء ووادي رم والثقافة الأردنية الأصيلة",
    descriptionEn: "Explore Petra, Wadi Rum, and authentic Jordanian culture",
    days: 5,
    nights: 4,
    destinations: ["Amman", "Petra", "Wadi Rum"],
    type: "Cultural",
    coverImage: "https://images.unsplash.com/photo-1559591218-9751ff9b1cf2?w=800&q=80",
    startingPrice: 4700,
    totalBookings: 0,
    rating: 0,
    status: "draft",
    difficulty: "Moderate",
    groupSizeMin: 2,
    groupSizeMax: 15,
    views: 0,
    wishlist: 0,
    conversionRate: 0,
    revenue: 0,
  },
];

export interface Hotel {
  id: string;
  nameAr: string;
  nameEn: string;
  starRating: 3 | 4 | 5 | 7;
  totalRooms: number;
  availableRooms: number;
  occupancyRate: number;
  ratingScore: number;
  status: "Active" | "Inactive" | "Under Review";
  coverImage: string;
  city: string;
  country: string;
  propertyType: string;
}

export const mockHotels: Hotel[] = [
  {
    id: "HTL-001",
    nameAr: "فندق واحة الذهب",
    nameEn: "Golden Oasis Hotel",
    starRating: 5,
    totalRooms: 124,
    availableRooms: 38,
    occupancyRate: 69,
    ratingScore: 4.7,
    status: "Active",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    city: "Dubai",
    country: "UAE",
    propertyType: "Hotel",
  },
  {
    id: "HTL-002",
    nameAr: "منتجع البحر الأحمر",
    nameEn: "Red Sea Resort",
    starRating: 7,
    totalRooms: 210,
    availableRooms: 52,
    occupancyRate: 75,
    ratingScore: 4.9,
    status: "Active",
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    city: "Sharm El-Sheikh",
    country: "Egypt",
    propertyType: "Resort",
  },
  {
    id: "HTL-003",
    nameAr: "فندق المدينة الفاخر",
    nameEn: "Madinah Luxury Hotel",
    starRating: 5,
    totalRooms: 180,
    availableRooms: 24,
    occupancyRate: 87,
    ratingScore: 4.8,
    status: "Active",
    coverImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    city: "Madinah",
    country: "Saudi Arabia",
    propertyType: "Hotel",
  },
  {
    id: "HTL-004",
    nameAr: "فندق بيروت بوتيك",
    nameEn: "Beirut Boutique Hotel",
    starRating: 4,
    totalRooms: 56,
    availableRooms: 18,
    occupancyRate: 68,
    ratingScore: 4.5,
    status: "Under Review",
    coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    city: "Beirut",
    country: "Lebanon",
    propertyType: "Boutique Hotel",
  },
];

export interface RoomType {
  id: string;
  hotelId: string;
  nameAr: string;
  nameEn: string;
  classification: string;
  classificationAr: string;
  basePrice: number;
  totalRooms: number;
  availableRooms: number;
  roomSize: number;
  bedConfig: string;
  bedConfigAr: string;
  maxAdults: number;
  maxChildren: number;
  occupancy: number;
  image: string;
  features: string[];
}

export const mockRoomTypes: RoomType[] = [
  {
    id: "RT-001",
    hotelId: "HTL-001",
    nameAr: "الجناح الملكي",
    nameEn: "Royal Suite",
    classification: "Royal Suite",
    classificationAr: "جناح ملكي",
    basePrice: 1850,
    totalRooms: 8,
    availableRooms: 2,
    roomSize: 85,
    bedConfig: "King Bed",
    bedConfigAr: "سرير كينج",
    maxAdults: 2,
    maxChildren: 2,
    occupancy: 75,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    features: ["Sea View", "Balcony", "Bathtub", "Mini Bar", "Safe"],
  },
  {
    id: "RT-002",
    hotelId: "HTL-001",
    nameAr: "غرفة ديلوكس",
    nameEn: "Deluxe Room",
    classification: "Deluxe Room",
    classificationAr: "غرفة ديلوكس",
    basePrice: 920,
    totalRooms: 48,
    availableRooms: 14,
    roomSize: 38,
    bedConfig: "Queen Bed",
    bedConfigAr: "سرير كوين",
    maxAdults: 2,
    maxChildren: 1,
    occupancy: 71,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    features: ["City View", "Air Conditioning", "Smart TV", "Work Desk"],
  },
  {
    id: "RT-003",
    hotelId: "HTL-001",
    nameAr: "غرفة قياسية",
    nameEn: "Standard Room",
    classification: "Standard Room",
    classificationAr: "غرفة قياسية",
    basePrice: 540,
    totalRooms: 68,
    availableRooms: 22,
    roomSize: 28,
    bedConfig: "Twin Beds",
    bedConfigAr: "سريرين توأم",
    maxAdults: 2,
    maxChildren: 1,
    occupancy: 68,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    features: ["Garden View", "Air Conditioning", "TV", "Work Desk"],
  },
  {
    id: "RT-004",
    hotelId: "HTL-002",
    nameAr: "جناح رئاسي",
    nameEn: "Presidential Suite",
    classification: "Presidential Suite",
    classificationAr: "جناح رئاسي",
    basePrice: 3200,
    totalRooms: 6,
    availableRooms: 1,
    roomSize: 120,
    bedConfig: "King Bed",
    bedConfigAr: "سرير كينج",
    maxAdults: 2,
    maxChildren: 3,
    occupancy: 83,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    features: ["Sea View", "Private Pool", "Butler Service", "Living Room", "Dining"],
  },
  {
    id: "RT-005",
    hotelId: "HTL-002",
    nameAr: "غرفة عائلية",
    nameEn: "Family Room",
    classification: "Family Room",
    classificationAr: "غرفة عائلية",
    basePrice: 1280,
    totalRooms: 42,
    availableRooms: 11,
    roomSize: 52,
    bedConfig: "King + Bunk",
    bedConfigAr: "كينج + أسرّة طابقية",
    maxAdults: 2,
    maxChildren: 3,
    occupancy: 74,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
    features: ["Sea View", "Balcony", "Kitchenette", "Kids Area"],
  },
];

export interface Booking {
  id: string;
  guestName: string;
  guestNameAr: string;
  guestAvatar: string;
  guestEmail: string;
  guestPhone: string;
  itemName: string;
  itemNameAr: string;
  startDate: string;
  endDate: string;
  guests: number;
  nights?: number;
  rooms?: number;
  roomNumber?: string;
  totalAmount: number;
  commission: number;
  netEarnings: number;
  status: "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled" | "No-show";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  bookingDate: string;
  nationality?: string;
  specialRequests?: string;
  previousStays?: number;
  type: "bundle" | "hotel";
}

export const mockBookings: Booking[] = [
  {
    id: "BK-2024-0142",
    guestName: "Ahmed Al-Rashid",
    guestNameAr: "أحمد الراشد",
    guestAvatar: "https://i.pravatar.cc/150?img=12",
    guestEmail: "ahmed.rashid@example.com",
    guestPhone: "+966 50 123 4567",
    itemName: "Spiritual Umrah - 7 Days",
    itemNameAr: "عمرة روحانية - 7 أيام",
    startDate: "2026-08-15",
    endDate: "2026-08-21",
    guests: 4,
    totalAmount: 23200,
    commission: 2320,
    netEarnings: 20880,
    status: "Confirmed",
    paymentStatus: "Paid",
    bookingDate: "2026-07-22",
    nationality: "Saudi Arabia",
    specialRequests: "Wheelchair access needed",
    type: "bundle",
  },
  {
    id: "BK-2024-0141",
    guestName: "Fatima Hassan",
    guestNameAr: "فاطمة حسن",
    guestAvatar: "https://i.pravatar.cc/150?img=44",
    guestEmail: "fatima.h@example.com",
    guestPhone: "+971 55 987 6543",
    itemName: "Dubai Magic - 5 Days",
    itemNameAr: "سحر دبي - 5 أيام",
    startDate: "2026-08-10",
    endDate: "2026-08-14",
    guests: 2,
    totalAmount: 8400,
    commission: 840,
    netEarnings: 7560,
    status: "Pending",
    paymentStatus: "Pending",
    bookingDate: "2026-07-25",
    nationality: "UAE",
    type: "bundle",
  },
  {
    id: "BK-2024-0140",
    guestName: "John Smith",
    guestNameAr: "جون سميث",
    guestAvatar: "https://i.pravatar.cc/150?img=33",
    guestEmail: "j.smith@example.com",
    guestPhone: "+1 415 555 0100",
    itemName: "Luxury Sharm El-Sheikh Beach",
    itemNameAr: "شاطئ شرم الشيخ الفاخر",
    startDate: "2026-08-05",
    endDate: "2026-08-10",
    guests: 4,
    totalAmount: 26000,
    commission: 2600,
    netEarnings: 23400,
    status: "Active",
    paymentStatus: "Paid",
    bookingDate: "2026-07-18",
    nationality: "USA",
    type: "bundle",
  },
  {
    id: "BK-2024-0139",
    guestName: "Layla Ibrahim",
    guestNameAr: "ليلى إبراهيم",
    guestAvatar: "https://i.pravatar.cc/150?img=23",
    guestEmail: "layla.i@example.com",
    guestPhone: "+20 100 234 5678",
    itemName: "Lebanon Mountain Adventure",
    itemNameAr: "مغامرات جبال لبنان",
    startDate: "2026-07-20",
    endDate: "2026-07-23",
    guests: 6,
    totalAmount: 18600,
    commission: 1860,
    netEarnings: 16740,
    status: "Completed",
    paymentStatus: "Paid",
    bookingDate: "2026-07-05",
    nationality: "Egypt",
    type: "bundle",
  },
  {
    id: "BK-2024-0138",
    guestName: "Mohammed Saleh",
    guestNameAr: "محمد صالح",
    guestAvatar: "https://i.pravatar.cc/150?img=15",
    guestEmail: "m.saleh@example.com",
    guestPhone: "+966 56 345 6789",
    itemName: "Honeymoon in Antalya",
    itemNameAr: "عرس العسل في أنطاليا",
    startDate: "2026-08-25",
    endDate: "2026-09-01",
    guests: 2,
    totalAmount: 17800,
    commission: 1780,
    netEarnings: 16020,
    status: "Confirmed",
    paymentStatus: "Paid",
    bookingDate: "2026-07-21",
    nationality: "Saudi Arabia",
    type: "bundle",
  },
];

export const mockHotelBookings: Booking[] = [
  {
    id: "HB-2024-0234",
    guestName: "Khalid Al-Mutairi",
    guestNameAr: "خالد المطيري",
    guestAvatar: "https://i.pravatar.cc/150?img=8",
    guestEmail: "khalid.m@example.com",
    guestPhone: "+966 50 111 2222",
    itemName: "Royal Suite - Golden Oasis",
    itemNameAr: "الجناح الملكي - واحة الذهب",
    startDate: "2026-08-12",
    endDate: "2026-08-15",
    nights: 3,
    rooms: 1,
    roomNumber: "1201",
    guests: 2,
    totalAmount: 5550,
    commission: 555,
    netEarnings: 4995,
    status: "Confirmed",
    paymentStatus: "Paid",
    bookingDate: "2026-07-28",
    nationality: "Saudi Arabia",
    specialRequests: "Late check-in at 8 PM",
    previousStays: 3,
    type: "hotel",
  },
  {
    id: "HB-2024-0233",
    guestName: "Sara Al-Otaibi",
    guestNameAr: "سارة العتيبي",
    guestAvatar: "https://i.pravatar.cc/150?img=49",
    guestEmail: "sara.o@example.com",
    guestPhone: "+966 55 333 4444",
    itemName: "Deluxe Room - Golden Oasis",
    itemNameAr: "غرفة ديلوكس - واحة الذهب",
    startDate: "2026-08-01",
    endDate: "2026-08-05",
    nights: 4,
    rooms: 2,
    roomNumber: "502, 504",
    guests: 4,
    totalAmount: 7360,
    commission: 736,
    netEarnings: 6624,
    status: "Active",
    paymentStatus: "Paid",
    bookingDate: "2026-07-20",
    nationality: "Saudi Arabia",
    previousStays: 1,
    type: "hotel",
  },
  {
    id: "HB-2024-0232",
    guestName: "Yusuf Karim",
    guestNameAr: "يوسف كريم",
    guestAvatar: "https://i.pravatar.cc/150?img=68",
    guestEmail: "yusuf.k@example.com",
    guestPhone: "+971 50 555 6666",
    itemName: "Standard Room - Golden Oasis",
    itemNameAr: "غرفة قياسية - واحة الذهب",
    startDate: "2026-07-25",
    endDate: "2026-07-28",
    nights: 3,
    rooms: 1,
    roomNumber: "210",
    guests: 2,
    totalAmount: 1620,
    commission: 162,
    netEarnings: 1458,
    status: "Completed",
    paymentStatus: "Paid",
    bookingDate: "2026-07-15",
    nationality: "UAE",
    previousStays: 0,
    type: "hotel",
  },
  {
    id: "HB-2024-0231",
    guestName: "Aisha Mahmoud",
    guestNameAr: "عائشة محمود",
    guestAvatar: "https://i.pravatar.cc/150?img=25",
    guestEmail: "aisha.m@example.com",
    guestPhone: "+20 100 777 8888",
    itemName: "Family Room - Red Sea Resort",
    itemNameAr: "غرفة عائلية - منتجع البحر الأحمر",
    startDate: "2026-08-08",
    endDate: "2026-08-14",
    nights: 6,
    rooms: 1,
    roomNumber: "305",
    guests: 5,
    totalAmount: 7680,
    commission: 768,
    netEarnings: 6912,
    status: "Pending",
    paymentStatus: "Pending",
    bookingDate: "2026-07-29",
    nationality: "Egypt",
    previousStays: 0,
    type: "hotel",
  },
  {
    id: "HB-2024-0230",
    guestName: "Omar Farouk",
    guestNameAr: "عمر فاروق",
    guestAvatar: "https://i.pravatar.cc/150?img=51",
    guestEmail: "omar.f@example.com",
    guestPhone: "+966 56 999 0000",
    itemName: "Presidential Suite - Red Sea Resort",
    itemNameAr: "جناح رئاسي - منتجع البحر الأحمر",
    startDate: "2026-08-15",
    endDate: "2026-08-22",
    nights: 7,
    rooms: 1,
    roomNumber: "PH1",
    guests: 2,
    totalAmount: 22400,
    commission: 2240,
    netEarnings: 20160,
    status: "Confirmed",
    paymentStatus: "Paid",
    bookingDate: "2026-07-26",
    nationality: "Saudi Arabia",
    previousStays: 5,
    type: "hotel",
  },
];

export interface Guest {
  id: string;
  name: string;
  nameAr: string;
  avatar: string;
  email: string;
  phone: string;
  nationality: string;
  currentBooking?: string;
  roomNumber?: string;
  totalStays: number;
  totalSpent: number;
  vipStatus: boolean;
  status: "in_house" | "upcoming" | "past";
  lastStay?: string;
  nextStay?: string;
}

export const mockGuests: Guest[] = [
  {
    id: "G-001",
    name: "Khalid Al-Mutairi",
    nameAr: "خالد المطيري",
    avatar: "https://i.pravatar.cc/150?img=8",
    email: "khalid.m@example.com",
    phone: "+966 50 111 2222",
    nationality: "Saudi Arabia",
    currentBooking: "Royal Suite - 1201",
    roomNumber: "1201",
    totalStays: 3,
    totalSpent: 18650,
    vipStatus: true,
    status: "upcoming",
    nextStay: "2026-08-12",
  },
  {
    id: "G-002",
    name: "Sara Al-Otaibi",
    nameAr: "سارة العتيبي",
    avatar: "https://i.pravatar.cc/150?img=49",
    email: "sara.o@example.com",
    phone: "+966 55 333 4444",
    nationality: "Saudi Arabia",
    currentBooking: "Deluxe Room - 502",
    roomNumber: "502",
    totalStays: 1,
    totalSpent: 7360,
    vipStatus: false,
    status: "in_house",
  },
  {
    id: "G-003",
    name: "Omar Farouk",
    nameAr: "عمر فاروق",
    avatar: "https://i.pravatar.cc/150?img=51",
    email: "omar.f@example.com",
    phone: "+966 56 999 0000",
    nationality: "Saudi Arabia",
    totalStays: 5,
    totalSpent: 64500,
    vipStatus: true,
    status: "upcoming",
    nextStay: "2026-08-15",
  },
  {
    id: "G-004",
    name: "Yusuf Karim",
    nameAr: "يوسف كريم",
    avatar: "https://i.pravatar.cc/150?img=68",
    email: "yusuf.k@example.com",
    phone: "+971 50 555 6666",
    nationality: "UAE",
    totalStays: 1,
    totalSpent: 1620,
    vipStatus: false,
    status: "past",
    lastStay: "2026-07-28",
  },
  {
    id: "G-005",
    name: "Aisha Mahmoud",
    nameAr: "عائشة محمود",
    avatar: "https://i.pravatar.cc/150?img=25",
    email: "aisha.m@example.com",
    phone: "+20 100 777 8888",
    nationality: "Egypt",
    totalStays: 0,
    totalSpent: 0,
    vipStatus: false,
    status: "upcoming",
    nextStay: "2026-08-08",
  },
];

export interface Review {
  id: string;
  guestName: string;
  guestNameAr: string;
  guestAvatar: string;
  itemName: string;
  itemNameAr: string;
  rating: number;
  categories: { cleanliness?: number; comfort?: number; location?: number; facilities?: number; staff?: number; value?: number; overall?: number };
  comment: string;
  commentAr: string;
  date: string;
  images?: string[];
  replied: boolean;
  reply?: string;
}

export const mockReviews: Review[] = [
  {
    id: "R-001",
    guestName: "Ahmed Al-Rashid",
    guestNameAr: "أحمد الراشد",
    guestAvatar: "https://i.pravatar.cc/150?img=12",
    itemName: "Spiritual Umrah - 7 Days",
    itemNameAr: "عمرة روحانية - 7 أيام",
    rating: 5,
    categories: { overall: 5 },
    comment: "Outstanding organization and spiritual experience. The guide was very knowledgeable and accommodations were excellent.",
    commentAr: "تنظيم متميز وتجربة روحانية. المرشد كان مطلعًا جدًا والإقامة ممتازة.",
    date: "2026-07-20",
    replied: true,
    reply: "Thank you Ahmed! We're glad you had a meaningful experience.",
  },
  {
    id: "R-002",
    guestName: "Layla Ibrahim",
    guestNameAr: "ليلى إبراهيم",
    guestAvatar: "https://i.pravatar.cc/150?img=23",
    itemName: "Lebanon Mountain Adventure",
    itemNameAr: "مغامرات جبال لبنان",
    rating: 4,
    categories: { overall: 4 },
    comment: "Beautiful scenery and challenging hikes. Some logistics could be improved but overall a great experience.",
    commentAr: "مناظر خلابة ومسارات صعبة. بعض اللوجستيات يمكن تحسينها لكن التجربة العامة رائعة.",
    date: "2026-07-24",
    replied: false,
  },
  {
    id: "R-003",
    guestName: "John Smith",
    guestNameAr: "جون سميث",
    guestAvatar: "https://i.pravatar.cc/150?img=33",
    itemName: "Luxury Sharm El-Sheikh Beach",
    itemNameAr: "شاطئ شرم الشيخ الفاخر",
    rating: 5,
    categories: { overall: 5 },
    comment: "Perfect beach getaway! The diving experiences were unforgettable.",
    commentAr: "عطلة شاطئية مثالية! تجارب الغوص كانت لا تُنسى.",
    date: "2026-07-22",
    replied: false,
  },
  {
    id: "R-004",
    guestName: "Sara Al-Otaibi",
    guestNameAr: "سارة العتيبي",
    guestAvatar: "https://i.pravatar.cc/150?img=49",
    itemName: "Deluxe Room - Golden Oasis",
    itemNameAr: "غرفة ديلوكس - واحة الذهب",
    rating: 4,
    categories: { cleanliness: 5, comfort: 4, location: 5, facilities: 4, staff: 5, value: 4 },
    comment: "Comfortable room with great city view. Staff were very helpful.",
    commentAr: "غرفة مريحة مع إطلالة رائعة على المدينة. الموظفون متعاونون جدًا.",
    date: "2026-07-26",
    replied: false,
  },
  {
    id: "R-005",
    guestName: "Omar Farouk",
    guestNameAr: "عمر فاروق",
    guestAvatar: "https://i.pravatar.cc/150?img=51",
    itemName: "Presidential Suite - Red Sea Resort",
    itemNameAr: "جناح رئاسي - منتجع البحر الأحمر",
    rating: 5,
    categories: { cleanliness: 5, comfort: 5, location: 5, facilities: 5, staff: 5, value: 5 },
    comment: "Absolutely luxurious! The butler service was exceptional. Will return.",
    commentAr: "فخامة مطلقة! خدمة البوتر استثنائية. سنعود مرة أخرى.",
    date: "2026-07-18",
    replied: true,
    reply: "Thank you Omar! Looking forward to welcoming you back.",
  },
];

export interface Notification {
  id: string;
  type: "booking" | "payment" | "verification" | "reviews" | "system" | "reminders";
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  timestamp: string;
  read: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: "N-001",
    type: "booking",
    titleAr: "حجز جديد",
    titleEn: "New Booking Received",
    messageAr: "قام خالد المطيري بحجز الجناح الملكي - 3 ليالٍ",
    messageEn: "Khalid Al-Mutairi booked Royal Suite for 3 nights",
    timestamp: "2026-07-29T09:14:00",
    read: false,
  },
  {
    id: "N-002",
    type: "payment",
    titleAr: "تم استلام الدفعة",
    titleEn: "Payment Received",
    messageAr: "تم استلام دفعة بقيمة 5,550 ر.س من حجز HB-2024-0234",
    messageEn: "Payment of 5,550 SAR received for booking HB-2024-0234",
    timestamp: "2026-07-29T08:42:00",
    read: false,
  },
  {
    id: "N-003",
    type: "reminders",
    titleAr: "تذكير: وصول اليوم",
    titleEn: "Reminder: Check-in Today",
    messageAr: "وصول الضيف سارة العتيبية اليوم الساعة 4 عصرًا - غرفة 502",
    messageEn: "Sara Al-Otaibi checking in today at 4 PM - Room 502",
    timestamp: "2026-07-29T07:00:00",
    read: false,
  },
  {
    id: "N-004",
    type: "reviews",
    titleAr: "تقييم جديد",
    titleEn: "New Review",
    messageAr: "ترك أحمد الراشد تقييمًا 5 نجوم على باقة العمرة",
    messageEn: "Ahmed Al-Rashid left a 5-star review on Umrah bundle",
    timestamp: "2026-07-28T19:30:00",
    read: true,
  },
  {
    id: "N-005",
    type: "verification",
    titleAr: "تم توثيق الفندق",
    titleEn: "Hotel Verified",
    messageAr: "تم توثيق فندق واحة الذهب بنجاح",
    messageEn: "Golden Oasis Hotel has been verified successfully",
    timestamp: "2026-07-27T14:15:00",
    read: true,
  },
  {
    id: "N-006",
    type: "system",
    titleAr: "تحديث المنصة",
    titleEn: "Platform Update",
    messageAr: "تم إضافة ميزة تقييم الأسعار الديناميكي الجديدة",
    messageEn: "New dynamic pricing feature has been added",
    timestamp: "2026-07-26T11:20:00",
    read: true,
  },
];

export interface Transaction {
  id: string;
  date: string;
  bookingRef: string;
  itemName: string;
  guestName: string;
  amount: number;
  commission: number;
  netEarnings: number;
  status: "Pending" | "Cleared" | "Paid Out";
}

export const mockTransactions: Transaction[] = [
  { id: "T-001", date: "2026-07-29", bookingRef: "HB-2024-0234", itemName: "Royal Suite - 3 nights", guestName: "Khalid Al-Mutairi", amount: 5550, commission: 555, netEarnings: 4995, status: "Pending" },
  { id: "T-002", date: "2026-07-28", bookingRef: "HB-2024-0233", itemName: "Deluxe Room - 4 nights", guestName: "Sara Al-Otaibi", amount: 7360, commission: 736, netEarnings: 6624, status: "Cleared" },
  { id: "T-003", date: "2026-07-26", bookingRef: "HB-2024-0230", itemName: "Presidential Suite - 7 nights", guestName: "Omar Farouk", amount: 22400, commission: 2240, netEarnings: 20160, status: "Cleared" },
  { id: "T-004", date: "2026-07-25", bookingRef: "BK-2024-0140", itemName: "Sharm Beach Package", guestName: "John Smith", amount: 26000, commission: 2600, netEarnings: 23400, status: "Cleared" },
  { id: "T-005", date: "2026-07-22", bookingRef: "BK-2024-0142", itemName: "Umrah Bundle", guestName: "Ahmed Al-Rashid", amount: 23200, commission: 2320, netEarnings: 20880, status: "Paid Out" },
  { id: "T-006", date: "2026-07-20", bookingRef: "BK-2024-0138", itemName: "Antalya Honeymoon", guestName: "Mohammed Saleh", amount: 17800, commission: 1780, netEarnings: 16020, status: "Cleared" },
  { id: "T-007", date: "2026-07-15", bookingRef: "HB-2024-0232", itemName: "Standard Room - 3 nights", guestName: "Yusuf Karim", amount: 1620, commission: 162, netEarnings: 1458, status: "Paid Out" },
  { id: "T-008", date: "2026-07-10", bookingRef: "BK-2024-0139", itemName: "Lebanon Adventure", guestName: "Layla Ibrahim", amount: 18600, commission: 1860, netEarnings: 16740, status: "Paid Out" },
];

// Revenue chart data (last 8 months)
export const revenueData = [
  { month: "Dec", revenue: 142000, target: 130000 },
  { month: "Jan", revenue: 168000, target: 150000 },
  { month: "Feb", revenue: 195000, target: 170000 },
  { month: "Mar", revenue: 178000, target: 180000 },
  { month: "Apr", revenue: 224000, target: 200000 },
  { month: "May", revenue: 251000, target: 220000 },
  { month: "Jun", revenue: 289000, target: 250000 },
  { month: "Jul", revenue: 318000, target: 280000 },
];

export const occupancyData = [
  { month: "Dec", rate: 58 },
  { month: "Jan", rate: 64 },
  { month: "Feb", rate: 72 },
  { month: "Mar", rate: 68 },
  { month: "Apr", rate: 75 },
  { month: "May", rate: 81 },
  { month: "Jun", rate: 86 },
  { month: "Jul", rate: 91 },
];

// Provider profile
export const mockProviderProfile = {
  bundle_creator: {
    fullNameAr: "أحمد عبدالله النعيمي",
    fullNameEn: "Ahmed Abdullah Al-Naimi",
    email: "ahmed@viatrips.com",
    phone: "+966 50 123 4567",
    businessNameAr: "رحلات واحة للسياحة",
    businessNameEn: "Via Trips",
    businessDesc: "Travel agency specializing in Middle East tours and Umrah packages",
    licenseNumber: "TG-2021-4567",
    taxId: "300123456700003",
    yearsExperience: 8,
    languages: ["Arabic", "English", "French"],
    avatar: "https://i.pravatar.cc/150?img=60",
    verificationStatus: "verified" as const,
  },
  hotel_owner: {
    fullNameAr: "سعود بن فهد القحطاني",
    fullNameEn: "Saud bin Fahd Al-Qahtani",
    email: "saud@goldenoasis.com",
    phone: "+966 55 987 6543",
    businessNameAr: "مجموعة واحة الذهب للفنادق",
    businessNameEn: "Golden Oasis Hotel Group",
    businessDesc: "Luxury hotel group operating premium properties across the Middle East",
    licenseNumber: "HL-2020-1234",
    taxId: "300987654300003",
    avatar: "https://i.pravatar.cc/150?img=53",
    verificationStatus: "verified" as const,
  },
};

// Calendar events (mock - colored date cells)
export const calendarEvents = [
  { date: "2026-08-01", status: "partial" as const, label: "3 bookings" },
  { date: "2026-08-02", status: "available" as const, label: "" },
  { date: "2026-08-05", status: "full" as const, label: "8 bookings" },
  { date: "2026-08-08", status: "partial" as const, label: "2 bookings" },
  { date: "2026-08-10", status: "full" as const, label: "Dubai Magic tour" },
  { date: "2026-08-12", status: "partial" as const, label: "5 bookings" },
  { date: "2026-08-15", status: "full" as const, label: "Umrah group arrives" },
  { date: "2026-08-18", status: "blocked" as const, label: "Maintenance" },
  { date: "2026-08-20", status: "available" as const, label: "" },
  { date: "2026-08-22", status: "partial" as const, label: "4 bookings" },
  { date: "2026-08-25", status: "full" as const, label: "Antalya honeymoon" },
  { date: "2026-08-28", status: "available" as const, label: "" },
];

// Room inventory grid (mock per-date availability per room number)
export const roomInventory = [
  { roomNumber: "101", type: "Standard", dates: { "2026-08-01": "available", "2026-08-02": "booked", "2026-08-03": "available", "2026-08-04": "available", "2026-08-05": "booked", "2026-08-06": "available", "2026-08-07": "available" } },
  { roomNumber: "102", type: "Standard", dates: { "2026-08-01": "available", "2026-08-02": "available", "2026-08-03": "booked", "2026-08-04": "booked", "2026-08-05": "booked", "2026-08-06": "available", "2026-08-07": "maintenance" } },
  { roomNumber: "210", type: "Standard", dates: { "2026-08-01": "booked", "2026-08-02": "booked", "2026-08-03": "available", "2026-08-04": "available", "2026-08-05": "available", "2026-08-06": "booked", "2026-08-07": "available" } },
  { roomNumber: "502", type: "Deluxe", dates: { "2026-08-01": "booked", "2026-08-02": "booked", "2026-08-03": "booked", "2026-08-04": "booked", "2026-08-05": "available", "2026-08-06": "available", "2026-08-07": "available" } },
  { roomNumber: "504", type: "Deluxe", dates: { "2026-08-01": "available", "2026-08-02": "available", "2026-08-03": "available", "2026-08-04": "booked", "2026-08-05": "booked", "2026-08-06": "booked", "2026-08-07": "booked" } },
  { roomNumber: "1201", type: "Royal Suite", dates: { "2026-08-01": "available", "2026-08-02": "available", "2026-08-03": "available", "2026-08-04": "available", "2026-08-05": "available", "2026-08-06": "booked", "2026-08-07": "booked" } },
];
