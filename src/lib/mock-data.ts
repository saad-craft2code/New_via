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

export const mockBundles: Bundle[] = [];

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

export const mockHotels: Hotel[] = [];

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

export const mockRoomTypes: RoomType[] = [];

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

export const mockBookings: Booking[] = [];

export const mockHotelBookings: Booking[] = [];

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

export const mockGuests: Guest[] = [];

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

export const mockReviews: Review[] = [];

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

export const mockNotifications: Notification[] = [];

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

export const mockTransactions: Transaction[] = [];

// Revenue chart data (last 8 months)
export const revenueData = [];

export const occupancyData = [];

// Provider profile — empty placeholder, real values come from auth user / DB
export const mockProviderProfile = {
  bundle_creator: {
    fullNameAr: "",
    fullNameEn: "",
    email: "",
    phone: "",
    businessNameAr: "",
    businessNameEn: "",
    businessDesc: "",
    licenseNumber: "",
    taxId: "",
    yearsExperience: 0,
    languages: [] as string[],
    avatar: "",
    verificationStatus: "pending" as const,
  },
  hotel_owner: {
    fullNameAr: "",
    fullNameEn: "",
    email: "",
    phone: "",
    businessNameAr: "",
    businessNameEn: "",
    businessDesc: "",
    licenseNumber: "",
    taxId: "",
    avatar: "",
    verificationStatus: "pending" as const,
  },
};

// Calendar events (mock - colored date cells)
export const calendarEvents = [];

// Room inventory grid (mock per-date availability per room number)
export const roomInventory = [];
