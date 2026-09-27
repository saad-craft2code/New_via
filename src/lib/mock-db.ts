// Mock database — returns hardcoded data so the app works without any database connection.
// Used when DATABASE_URL is not set or database is unreachable.
// All data is in-memory and resets on server restart.

const now = new Date().toISOString();

// ─── Users ──────────────────────────────────────────────
export const mockUsers = [
  {
    id: "user-ho-demo",
    email: "hotel@via.example",
    passwordHash: "demo",
    name: "Saud Al-Qahtani",
    role: "HotelOwner",
    phone: "+966 55 987 6543",
    companyName: "Golden Oasis Hotel Group",
    businessLicense: "HL-2020-1234",
    yearsExperience: 12,
    languagesSpoken: ["Arabic", "English"],
    avatarUrl: "https://i.pravatar.cc/150?img=53",
    kycStatus: "approved",
    kycSubmittedAt: "2024-08-12T00:00:00.000Z",
    kycReviewedAt: "2024-08-15T00:00:00.000Z",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "user-bc-demo",
    email: "bundle@via.example",
    passwordHash: "demo",
    name: "Ahmed Al-Naimi",
    role: "BundleCreator",
    phone: "+966 50 123 4567",
    companyName: "Via Trips",
    tourGuideLicense: "TG-2021-4567",
    yearsExperience: 8,
    languagesSpoken: ["Arabic", "English", "French"],
    avatarUrl: "https://i.pravatar.cc/150?img=60",
    kycStatus: "approved",
    kycSubmittedAt: "2024-09-01T00:00:00.000Z",
    kycReviewedAt: "2024-09-04T00:00:00.000Z",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "user-admin-demo",
    email: "admin@via.example",
    passwordHash: "demo",
    name: "Via Admin",
    role: "Admin",
    languagesSpoken: ["Arabic", "English"],
    kycStatus: "approved",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "user-car-demo",
    email: "cars@via.example",
    passwordHash: "demo",
    name: "Saud Car Rentals",
    role: "BundleCreator",
    phone: "+966 55 222 0001",
    companyName: "Saud Car Rentals",
    languagesSpoken: ["Arabic", "English"],
    kycStatus: "approved",
    createdAt: now,
    updatedAt: now,
  },
];

// ─── Hotels ─────────────────────────────────────────────
export const mockHotels = [
  {
    id: "HTL-001",
    ownerId: "user-ho-demo",
    name: "Golden Oasis Hotel",
    description: "A 5-star Hotel in Dubai, UAE. Offers world-class hospitality with 124 rooms.",
    starRating: 5,
    location: "Dubai",
    city: "Dubai",
    latitude: 25.2048,
    longitude: 55.2708,
    amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Restaurant", "Parking"],
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"],
    policies: { checkIn: "14:00", checkOut: "12:00", smoking: false, pets: false },
    createdAt: now,
    updatedAt: now,
  },
];

// ─── Rooms ──────────────────────────────────────────────
export const mockRooms = [
  {
    id: "ROOM-001",
    hotelId: "HTL-001",
    roomType: "Deluxe Room",
    bedType: "King",
    maxGuests: 2,
    pricePerNight: 650,
    size: 42,
    amenities: ["Free WiFi", "AC", "TV", "Mini-bar", "City View"],
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"],
    totalUnits: 10,
    availableUnits: 3,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ROOM-002",
    hotelId: "HTL-001",
    roomType: "Suite",
    bedType: "King + Sofa",
    maxGuests: 4,
    pricePerNight: 1100,
    size: 70,
    amenities: ["Free WiFi", "AC", "TV", "Mini-bar", "Living Room", "Sea View"],
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"],
    totalUnits: 4,
    availableUnits: 1,
    createdAt: now,
    updatedAt: now,
  },
];

// ─── Bundles ───────────────────────────────────────────
export const mockBundles = [
  {
    id: "BND-001",
    creatorId: "user-bc-demo",
    title: "Dubai Magic - 5 Days",
    description: "Comprehensive Dubai tour including Burj Khalifa, Palm Jumeirah, and desert safari.",
    durationDays: 5,
    destinations: ["Dubai", "Abu Dhabi"],
    images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80"],
    guideName: "Local Expert Guide",
    price: 4200,
    difficulty: "easy",
    groupSize: 12,
    includedServices: ["Hotel", "Breakfast", "Transfers", "Tours"],
    status: "Published",
    createdAt: now,
    updatedAt: now,
  },
];

// ─── Bookings ───────────────────────────────────────────
export const mockBookings = [];

// ─── Notifications ──────────────────────────────────────
export const mockNotifications = [];

// ─── Reviews ────────────────────────────────────────────
export const mockReviews = [];

// ─── Staff ──────────────────────────────────────────────
export const mockStaff = [
  {
    id: "staff-cleaner",
    email: "cleaner@via.example",
    passwordHash: "demo",
    name: "Maria Santos",
    nameAr: "ماريا سانتوس",
    phone: "+966 50 111 0001",
    role: "staff",
    department: "housekeeping",
    hotelId: "HTL-001",
    avatarUrl: "https://i.pravatar.cc/150?u=cleaner@via.example",
    baseSalary: 3200,
    hourlyRate: 22,
    isActive: true,
    hiredAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "staff-maintenance",
    email: "maintenance@via.example",
    passwordHash: "demo",
    name: "Yusuf Khan",
    nameAr: "يوسف خان",
    phone: "+966 50 111 0003",
    role: "supervisor",
    department: "maintenance",
    hotelId: "HTL-001",
    avatarUrl: "https://i.pravatar.cc/150?u=maintenance@via.example",
    baseSalary: 4500,
    hourlyRate: 32,
    isActive: true,
    hiredAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

// ─── Staff Tasks ───────────────────────────────────────
export const mockStaffTasks = [];

// ─── Salaries ───────────────────────────────────────────
export const mockSalaries = [];

// ─── Cameras ───────────────────────────────────────────
export const mockCameras = [
  { id: "CAM-001", name: "Lobby Camera", location: "Main Lobby", hotelId: "HTL-001", status: "online", streamUrl: null, createdAt: now },
  { id: "CAM-002", name: "Pool Camera", location: "Pool Area", hotelId: "HTL-001", status: "offline", streamUrl: null, createdAt: now },
];

// ─── Maintenance Requests ───────────────────────────────
export const mockMaintenance = [];

// ─── Guest Profiles ─────────────────────────────────────
export const mockGuestProfiles = [
  {
    id: "GUEST-001",
    hotelId: "HTL-001",
    name: "John Smith",
    nameAr: "جون سميث",
    email: "john.smith@example.com",
    phone: "+1 415 555 0100",
    nationality: "USA",
    idType: "passport",
    idNumber: "US12345678",
    gender: "male",
    city: "San Francisco",
    country: "USA",
    preferences: ["non-smoking", "high floor", "quiet"],
    dietaryNeeds: "none",
    vipStatus: "gold",
    totalStays: 3,
    totalSpent: 9800,
    lastStayAt: "2026-06-15T00:00:00.000Z",
    blacklisted: false,
    createdAt: now,
    updatedAt: now,
  },
];

// ─── Check-ins ──────────────────────────────────────────
export const mockCheckIns = [];

// ─── Inventory ──────────────────────────────────────────
export const mockInventory = [];

// ─── Car Companies ──────────────────────────────────────
export const mockCarCompanies = [
  {
    id: "CARCO-001",
    ownerId: "user-car-demo",
    name: "Desert Wheels",
    description: "Premium car rental across Saudi Arabia.",
    phone: "+966 11 200 0001",
    email: "info@desertwheels.com",
    city: "Riyadh",
    rating: 4.7,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

// ─── Cars ───────────────────────────────────────────────
export const mockCars = [
  {
    id: "CAR-001",
    companyId: "CARCO-001",
    make: "Toyota",
    model: "Camry",
    year: 2024,
    plateNumber: "RYD-1001",
    category: "sedan",
    transmission: "automatic",
    seats: 5,
    doors: 4,
    bags: 2,
    ac: true,
    fuelType: "petrol",
    pricePerDay: 180,
    deposit: 360,
    images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"],
    features: ["Bluetooth", "USB Charging", "Air Conditioning", "ABS", "Airbags"],
    available: true,
    mileage: 5000,
    color: "White",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "CAR-002",
    companyId: "CARCO-001",
    make: "Nissan",
    model: "Patrol",
    year: 2024,
    plateNumber: "RYD-1002",
    category: "suv",
    transmission: "automatic",
    seats: 7,
    doors: 5,
    bags: 4,
    ac: true,
    fuelType: "petrol",
    pricePerDay: 450,
    deposit: 900,
    images: ["https://images.unsplash.com/photo-1519440139665-992c9d9c6b6e?w=800&q=80"],
    features: ["Bluetooth", "USB Charging", "Air Conditioning", "4x4", "Leather Seats"],
    available: true,
    mileage: 8000,
    color: "Black",
    createdAt: now,
    updatedAt: now,
  },
];

// ─── Car Bookings ───────────────────────────────────────
export const mockCarBookings = [];

// ─── Helper ──────────────────────────────────────────────
export function isDbEnabled() {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes("file:")) return false;
  if (url.includes("PASSWORD")) return false;
  if (url.includes("dummy")) return false;
  if (url.includes("your-neon-host")) return false;
  if (url.includes("user:password")) return false;
  return true;
}
