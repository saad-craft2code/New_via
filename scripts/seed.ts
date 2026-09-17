// Seed the local SQLite Prisma DB with mock data from src/lib/mock-data.ts.
// Run with: bun run /home/z/my-project/scripts/seed.ts
//
// Idempotent: deletes all rows first, then re-inserts.

import { PrismaClient } from "@prisma/client";
import {
  mockBundles,
  mockHotels,
  mockRoomTypes,
  mockBookings,
  mockHotelBookings,
  mockReviews,
  mockNotifications,
} from "../src/lib/mock-data";

const db = new PrismaClient();

function json(v: unknown): string {
  return JSON.stringify(v);
}

async function main() {
  console.log("🌱 Seeding Via Trips DB...");

  // ── Wipe (order matters for FK constraints)
  await db.notification.deleteMany();
  await db.review.deleteMany();
  await db.booking.deleteMany();
  await db.bundleItem.deleteMany();
  await db.bundleDay.deleteMany();
  await db.bundle.deleteMany();
  await db.room.deleteMany();
  await db.hotel.deleteMany();
  await db.kycDocument.deleteMany();
  await db.user.deleteMany();

  // ── Users
  const hotelOwner = await db.user.create({
    data: {
      id: "user-ho-demo",
      email: "hotel@via.example",
      passwordHash: "$2a$10$demo.hashplaceholderonlynotsecure.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      name: "Saud bin Fahd Al-Qahtani",
      role: "HotelOwner",
      phone: "+966 55 987 6543",
      companyName: "Golden Oasis Hotel Group",
      businessLicense: "HL-2020-1234",
      yearsExperience: 12,
      languagesSpoken: json(["Arabic", "English"]),
      avatarUrl: "https://i.pravatar.cc/150?img=53",
      kycStatus: "Approved",
      kycSubmittedAt: new Date("2024-08-12"),
      kycReviewedAt: new Date("2024-08-15"),
    },
  });

  const bundleCreator = await db.user.create({
    data: {
      id: "user-bc-demo",
      email: "bundle@via.example",
      passwordHash: "$2a$10$demo.hashplaceholderonlynotsecure.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      name: "Ahmed Abdullah Al-Naimi",
      role: "BundleCreator",
      phone: "+966 50 123 4567",
      companyName: "Via Trips",
      tourGuideLicense: "TG-2021-4567",
      yearsExperience: 8,
      languagesSpoken: json(["Arabic", "English", "French"]),
      avatarUrl: "https://i.pravatar.cc/150?img=60",
      kycStatus: "Approved",
      kycSubmittedAt: new Date("2024-09-01"),
      kycReviewedAt: new Date("2024-09-04"),
    },
  });

  const adminUser = await db.user.create({
    data: {
      id: "user-admin-demo",
      email: "admin@via.example",
      passwordHash: "$2a$10$demo.hashplaceholderonlynotsecure.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      name: "Via Admin",
      role: "Admin",
      languagesSpoken: json(["Arabic", "English"]),
      kycStatus: "Approved",
    },
  });

  // ── Hotels + Rooms
  for (const h of mockHotels) {
    const hotel = await db.hotel.create({
      data: {
        id: h.id,
        ownerId: hotelOwner.id,
        name: h.nameEn,
        description: `${h.nameEn} — a ${h.starRating}-star ${h.propertyType} in ${h.city}, ${h.country}. Offers world-class hospitality with ${h.totalRooms} rooms.`,
        starRating: h.starRating,
        location: h.city,
        city: h.city,
        amenities: json(["Free WiFi", "Pool", "Spa", "Gym", "Restaurant", "Parking", "Concierge"]),
        images: json([h.coverImage]),
        policies: json({ checkIn: "14:00", checkOut: "12:00", smoking: false, pets: false }),
      },
    });

    // Create rooms for this hotel from mockRoomTypes (filter by hotelId)
    const rooms = mockRoomTypes.filter((r) => r.hotelId === h.id);
    for (const r of rooms) {
      await db.room.create({
        data: {
          id: r.id,
          hotelId: hotel.id,
          roomType: r.nameEn,
          bedType: r.bedConfig,
          maxGuests: r.maxAdults + r.maxChildren,
          pricePerNight: r.basePrice,
          size: r.roomSize,
          amenities: json(r.features),
          images: json([r.image]),
          totalUnits: r.totalRooms,
          availableUnits: r.availableRooms,
        },
      });
    }
    // If no rooms defined for this hotel, create a few generic ones
    if (rooms.length === 0) {
      const generics = [
        { type: "Standard Room", bed: "Queen", price: 350, units: 20, avail: 8, size: 28 },
        { type: "Deluxe Room", bed: "King", price: 650, units: 10, avail: 3, size: 42 },
        { type: "Suite", bed: "King + Sofa", price: 1100, units: 4, avail: 1, size: 70 },
      ];
      for (const g of generics) {
        await db.room.create({
          data: {
            hotelId: hotel.id,
            roomType: g.type,
            bedType: g.bed,
            maxGuests: g.type === "Suite" ? 4 : 2,
            pricePerNight: g.price,
            size: g.size,
            amenities: json(["Free WiFi", "AC", "TV", "Mini-bar"]),
            images: json([h.coverImage]),
            totalUnits: g.units,
            availableUnits: g.avail,
          },
        });
      }
    }
  }

  // ── Bundles + Days + Items
  for (const b of mockBundles) {
    const statusMap: Record<string, string> = {
      published: "Published",
      draft: "Draft",
      archived: "Archived",
      sold_out: "SoldOut",
    };
    const bundle = await db.bundle.create({
      data: {
        id: b.id,
        creatorId: bundleCreator.id,
        title: b.titleEn,
        description: b.descriptionEn,
        durationDays: b.days,
        destinations: json(b.destinations),
        images: json([b.coverImage]),
        guideName: "Local Expert Guide",
        price: b.startingPrice,
        difficulty: b.difficulty.toLowerCase(),
        groupSize: b.groupSizeMax,
        includedServices: json(["Hotel", "Breakfast", "Transfers", "Tours"]),
        status: statusMap[b.status] ?? "Draft",
      },
    });

    // Create N days with placeholder items
    for (let i = 1; i <= b.days; i++) {
      const day = await db.bundleDay.create({
        data: {
          bundleId: bundle.id,
          dayNumber: i,
          title: `Day ${i} — ${b.destinations[0] ?? "Destination"}`,
          description: `Day ${i} itinerary for ${b.titleEn}.`,
        },
      });
      await db.bundleItem.create({
        data: {
          bundleDayId: day.id,
          type: i === 1 ? "transfer" : i === b.days ? "transfer" : "activity",
          title: i === 1 ? "Airport pickup" : i === b.days ? "Departure transfer" : `${b.destinations[0] ?? "City"} tour`,
          description: "Included in package.",
          startTime: "09:00",
          endTime: "13:00",
          location: b.destinations[0] ?? "Destination",
          cost: 0,
          includedServices: json(["Guide", "Transport"]),
        },
      });
      await db.bundleItem.create({
        data: {
          bundleDayId: day.id,
          type: "meal",
          title: "Lunch",
          startTime: "13:00",
          endTime: "14:30",
          includedServices: json(["Local cuisine"]),
        },
      });
      await db.bundleItem.create({
        data: {
          bundleDayId: day.id,
          type: "hotel",
          title: "Overnight stay",
          description: "4-star hotel included",
          includedServices: json(["Breakfast included"]),
        },
      });
    }
  }

  // ── Bookings — combine bundle & hotel bookings
  const allBookings = [...mockBookings, ...mockHotelBookings];
  for (const bk of allBookings) {
    const isHotel = bk.type === "hotel";
    try {
      await db.booking.create({
        data: {
          id: bk.id,
          userId: isHotel ? hotelOwner.id : bundleCreator.id,
          type: isHotel ? "HotelRoom" : "Bundle",
          hotelId: isHotel ? mockHotels[0].id : null,
          bundleId: !isHotel ? mockBundles[0].id : null,
          startDate: new Date(bk.startDate),
          endDate: bk.endDate ? new Date(bk.endDate) : null,
          numGuests: bk.guests ?? 2,
          totalAmount: bk.totalAmount ?? 0,
          status: bk.status ?? "Confirmed",
          metadata: json({
            guestName: bk.guestName,
            guestNameAr: bk.guestNameAr,
            guestEmail: bk.guestEmail,
            guestPhone: bk.guestPhone,
            guestAvatar: bk.guestAvatar,
            itemName: bk.itemName,
            itemNameAr: bk.itemNameAr,
            nationality: bk.nationality,
            specialRequests: bk.specialRequests,
            previousStays: bk.previousStays,
            commission: bk.commission,
            netEarnings: bk.netEarnings,
            paymentStatus: bk.paymentStatus,
            bookingDate: bk.bookingDate,
            nights: bk.nights,
            rooms: bk.rooms,
            roomNumber: bk.roomNumber,
            rawType: bk.type,
          }),
        },
      });
    } catch (e) {
      console.warn(`  ! skip booking ${bk.id}:`, (e as Error).message);
    }
  }

  // ── Notifications (map mockNotifications for both users)
  for (const n of mockNotifications) {
    const userId = n.type === "verification" ? hotelOwner.id : bundleCreator.id;
    await db.notification.create({
      data: {
        userId,
        type: n.type,
        titleEn: n.titleEn,
        titleAr: n.titleAr,
        bodyEn: n.messageEn,
        bodyAr: n.messageAr,
        read: n.read,
        link: null,
      },
    });
  }

  // ── Reviews (for bundles primarily)
  for (const r of mockReviews) {
    // Try to find a matching bundle by title
    const matchingBundle = mockBundles.find((b) => b.titleEn === r.itemName);
    const matchingHotel = mockHotels.find((h) => h.nameEn === r.itemName?.split(" - ")[1]);
    await db.review.create({
      data: {
        userId: matchingBundle ? bundleCreator.id : hotelOwner.id,
        targetId: matchingBundle?.id ?? matchingHotel?.id ?? "unknown",
        targetType: matchingBundle ? "bundle" : "hotel",
        rating: r.rating,
        commentEn: r.comment,
        commentAr: r.commentAr,
        author: r.guestName,
      },
    });
  }

  console.log("✅ Seed complete");
  console.log(`   Users:         ${await db.user.count()}`);
  console.log(`   Hotels:        ${await db.hotel.count()}`);
  console.log(`   Rooms:         ${await db.room.count()}`);
  console.log(`   Bundles:       ${await db.bundle.count()}`);
  console.log(`   Bundle Days:   ${await db.bundleDay.count()}`);
  console.log(`   Bundle Items:  ${await db.bundleItem.count()}`);
  console.log(`   Bookings:      ${await db.booking.count()}`);
  console.log(`   Notifications: ${await db.notification.count()}`);
  console.log(`   Reviews:       ${await db.review.count()}`);
  console.log("");
  console.log("  Demo logins (any password works — auth is mocked):");
  console.log("    Hotel Owner:     hotel@via.example");
  console.log("    Bundle Creator:  bundle@via.example");
  console.log("    Admin:           admin@via.example");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
