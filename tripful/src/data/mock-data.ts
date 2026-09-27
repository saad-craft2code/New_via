// Shared mock data — same as the provider panel so both sites show the same hotels/bundles.
// When you connect a real database later, replace these with API calls.

export interface Hotel {
  id: string;
  name: string;
  description: string;
  starRating: number;
  location: string;
  city: string;
  amenities: string[];
  images: string[];
  coverImage: string;
  totalRooms: number;
  availableRooms: number;
  startingPrice: number;
  rating: number;
  reviewCount: number;
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
  description: string;
  durationDays: number;
  destinations: string[];
  coverImage: string;
  images: string[];
  price: number;
  difficulty: string;
  groupSize: number;
  includedServices: string[];
  rating: number;
  reviewCount: number;
  totalBookings: number;
}

export const hotels: Hotel[] = [
  {
    id: "HTL-001",
    name: "Golden Oasis Hotel",
    description: "A luxurious 5-star hotel in the heart of Dubai, offering world-class hospitality with 124 elegantly appointed rooms. Enjoy stunning city views, a rooftop infinity pool, award-winning restaurants, and a full-service spa.",
    starRating: 5,
    location: "Downtown Dubai",
    city: "Dubai",
    amenities: ["Free WiFi", "Swimming Pool", "Spa", "Gym", "Restaurant", "Parking", "Concierge", "Room Service"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
    ],
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    totalRooms: 14,
    availableRooms: 4,
    startingPrice: 650,
    rating: 4.8,
    reviewCount: 1247,
    rooms: [
      { id: "ROOM-001", roomType: "Deluxe Room", bedType: "King", maxGuests: 2, pricePerNight: 650, size: 42, amenities: ["Free WiFi", "AC", "TV", "Mini-bar", "City View"], images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"], available: true },
      { id: "ROOM-002", roomType: "Luxury Suite", bedType: "King + Sofa", maxGuests: 4, pricePerNight: 1100, size: 70, amenities: ["Free WiFi", "AC", "TV", "Mini-bar", "Living Room", "Sea View"], images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"], available: true },
    ],
  },
];

export const bundles: Bundle[] = [
  {
    id: "BND-001",
    title: "Dubai Magic — 5 Days",
    description: "Experience the best of Dubai with this comprehensive 5-day tour package. Visit the iconic Burj Khalifa, explore Palm Jumeirah, enjoy a thrilling desert safari, and discover the city's rich culture and modern marvels.",
    durationDays: 5,
    destinations: ["Dubai", "Abu Dhabi"],
    coverImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
      "https://images.unsplash.com/photo-1582672060674-bc2bd808a8f5?w=1200&q=80",
    ],
    price: 4200,
    difficulty: "Easy",
    groupSize: 12,
    includedServices: ["Hotel", "Breakfast", "Airport Transfers", "Guided Tours", "Desert Safari"],
    rating: 4.9,
    reviewCount: 348,
    totalBookings: 87,
  },
];

export const cities = ["Dubai", "Madinah", "Sharm El-Sheikh", "Beirut", "Antalya", "Amman"];
