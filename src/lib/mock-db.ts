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
export const mockHotels = [];

// ─── Rooms ──────────────────────────────────────────────
export const mockRooms = [];

// ─── Bundles ───────────────────────────────────────────
export const mockBundles = [];

// ─── Bookings ───────────────────────────────────────────
export const mockBookings = [];

// ─── Notifications ──────────────────────────────────────
export const mockNotifications = [];

// ─── Reviews ────────────────────────────────────────────
export const mockReviews = [];

// ─── Staff ──────────────────────────────────────────────
export const mockStaff = [];

// ─── Staff Tasks ───────────────────────────────────────
export const mockStaffTasks = [];

// ─── Salaries ───────────────────────────────────────────
export const mockSalaries = [];

// ─── Cameras ───────────────────────────────────────────
export const mockCameras = [];

// ─── Maintenance Requests ───────────────────────────────
export const mockMaintenance = [];

// ─── Guest Profiles ─────────────────────────────────────
export const mockGuestProfiles = [];

// ─── Check-ins ──────────────────────────────────────────
export const mockCheckIns = [];

// ─── Inventory ──────────────────────────────────────────
export const mockInventory = [];

// ─── Car Companies ──────────────────────────────────────
export const mockCarCompanies = [];

// ─── Cars ───────────────────────────────────────────────
export const mockCars = [];

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
