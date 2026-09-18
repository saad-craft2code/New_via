// Seed the local SQLite Prisma DB with MINIMAL data (1-2 items per category).
// Run with: bun run /home/z/my-project/scripts/seed.ts
// Idempotent: deletes all rows first, then re-inserts.

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function json(v: unknown): string {
  return JSON.stringify(v);
}

async function main() {
  console.log("🌱 Seeding Via Trips DB (minimal)...");

  // ── Wipe (order matters for FK constraints)
  await db.roomStatusLog.deleteMany();
  await db.inventoryTransaction.deleteMany();
  await db.inventoryItem.deleteMany();
  await db.checkIn.deleteMany();
  await db.guestProfile.deleteMany();
  await db.maintenanceRequest.deleteMany();
  await db.carBooking.deleteMany();
  await db.car.deleteMany();
  await db.carCompany.deleteMany();
  await db.camera.deleteMany();
  await db.salaryPayment.deleteMany();
  await db.staffShift.deleteMany();
  await db.staffTask.deleteMany();
  await db.staff.deleteMany();
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
      name: "Saud Al-Qahtani",
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
      name: "Ahmed Al-Naimi",
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

  // ── 1 Hotel + 2 Rooms
  const hotel = await db.hotel.create({
    data: {
      id: "HTL-001",
      ownerId: hotelOwner.id,
      name: "Golden Oasis Hotel",
      description: "A 5-star Hotel in Dubai, UAE. Offers world-class hospitality with 124 rooms.",
      starRating: 5,
      location: "Dubai",
      city: "Dubai",
      amenities: json(["Free WiFi", "Pool", "Spa", "Gym", "Restaurant", "Parking"]),
      images: json(["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"]),
      policies: json({ checkIn: "14:00", checkOut: "12:00", smoking: false, pets: false }),
    },
  });

  await db.room.create({
    data: {
      id: "ROOM-001",
      hotelId: hotel.id,
      roomType: "Deluxe Room",
      bedType: "King",
      maxGuests: 2,
      pricePerNight: 650,
      size: 42,
      amenities: json(["Free WiFi", "AC", "TV", "Mini-bar", "City View"]),
      images: json(["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"]),
      totalUnits: 10,
      availableUnits: 3,
    },
  });
  await db.room.create({
    data: {
      id: "ROOM-002",
      hotelId: hotel.id,
      roomType: "Suite",
      bedType: "King + Sofa",
      maxGuests: 4,
      pricePerNight: 1100,
      size: 70,
      amenities: json(["Free WiFi", "AC", "TV", "Mini-bar", "Living Room", "Sea View"]),
      images: json(["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"]),
      totalUnits: 4,
      availableUnits: 1,
    },
  });

  // ── 1 Bundle + days + items
  const bundle = await db.bundle.create({
    data: {
      id: "BND-001",
      creatorId: bundleCreator.id,
      title: "Dubai Magic - 5 Days",
      description: "Comprehensive Dubai tour including Burj Khalifa, Palm Jumeirah, and desert safari.",
      durationDays: 5,
      destinations: json(["Dubai", "Abu Dhabi"]),
      images: json(["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80"]),
      guideName: "Local Expert Guide",
      price: 4200,
      difficulty: "easy",
      groupSize: 12,
      includedServices: json(["Hotel", "Breakfast", "Transfers", "Tours"]),
      status: "Published",
    },
  });
  for (let i = 1; i <= 5; i++) {
    const day = await db.bundleDay.create({
      data: {
        bundleId: bundle.id,
        dayNumber: i,
        title: `Day ${i} — Dubai`,
        description: `Day ${i} itinerary.`,
      },
    });
    await db.bundleItem.create({
      data: {
        bundleDayId: day.id,
        type: i === 1 ? "transfer" : i === 5 ? "transfer" : "activity",
        title: i === 1 ? "Airport pickup" : i === 5 ? "Departure transfer" : "City tour",
        startTime: "09:00",
        endTime: "13:00",
        location: "Dubai",
        cost: 0,
        includedServices: json(["Guide", "Transport"]),
      },
    });
  }

  // ── 2 Bookings (1 bundle, 1 hotel)
  await db.booking.create({
    data: {
      id: "BK-001",
      userId: bundleCreator.id,
      type: "Bundle",
      bundleId: bundle.id,
      startDate: new Date("2026-10-15"),
      endDate: new Date("2026-10-20"),
      numGuests: 2,
      totalAmount: 8400,
      status: "Confirmed",
      metadata: json({
        guestName: "Fatima Hassan",
        guestNameAr: "فاطمة حسن",
        guestEmail: "fatima@example.com",
        guestPhone: "+971 55 987 6543",
        guestAvatar: "https://i.pravatar.cc/150?img=44",
        itemName: "Dubai Magic - 5 Days",
        itemNameAr: "سحر دبي - 5 أيام",
        nationality: "UAE",
        paymentStatus: "Paid",
        bookingDate: "2026-09-25",
      }),
    },
  });
  await db.booking.create({
    data: {
      id: "BK-002",
      userId: hotelOwner.id,
      type: "HotelRoom",
      hotelId: hotel.id,
      roomId: "ROOM-002",
      startDate: new Date("2026-10-10"),
      endDate: new Date("2026-10-13"),
      numGuests: 2,
      totalAmount: 3300,
      status: "Pending",
      metadata: json({
        guestName: "John Smith",
        guestNameAr: "جون سميث",
        guestEmail: "john@example.com",
        guestPhone: "+1 415 555 0100",
        guestAvatar: "https://i.pravatar.cc/150?img=33",
        itemName: "Suite",
        itemNameAr: "جناح",
        nationality: "USA",
        paymentStatus: "Pending",
        bookingDate: "2026-09-28",
        nights: 3,
      }),
    },
  });

  // ── 2 Notifications
  await db.notification.create({
    data: {
      userId: bundleCreator.id,
      type: "booking",
      titleEn: "New Booking Received",
      titleAr: "حجز جديد",
      bodyEn: "Fatima Hassan booked Dubai Magic - 5 Days",
      bodyAr: "قامت فاطمة حسن بحجز سحر دبي - 5 أيام",
      read: false,
    },
  });
  await db.notification.create({
    data: {
      userId: hotelOwner.id,
      type: "payment",
      titleEn: "Payment Received",
      titleAr: "تم استلام الدفعة",
      bodyEn: "Payment of 3,300 SAR received for booking BK-002",
      bodyAr: "تم استلام دفعة بقيمة ٣٬٣٠٠ ر.س لحجز BK-002",
      read: true,
    },
  });

  // ── 2 Reviews
  await db.review.create({
    data: {
      userId: bundleCreator.id,
      targetId: bundle.id,
      targetType: "bundle",
      rating: 5,
      commentEn: "Outstanding organization and spiritual experience.",
      commentAr: "تنظيم متميز وتجربة روحانية.",
      author: "Ahmed Al-Rashid",
    },
  });
  await db.review.create({
    data: {
      userId: hotelOwner.id,
      targetId: hotel.id,
      targetType: "hotel",
      rating: 4,
      commentEn: "Comfortable room with great city view.",
      commentAr: "غرفة مريحة مع إطلالة رائعة على المدينة.",
      author: "Sara Al-Otaibi",
    },
  });

  // ───────────────────────────────────────────────────────────
  // Operations: 2 Staff + 2 Tasks + 2 Salaries + 2 Cameras
  // ───────────────────────────────────────────────────────────
  console.log("👥 Seeding operations (minimal)...");

  const cleaner = await db.staff.create({
    data: {
      email: "cleaner@via.example",
      passwordHash: "$2a$10$demo.hashplaceholderonlynotsecure.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      name: "Maria Santos",
      nameAr: "ماريا سانتوس",
      phone: "+966 50 111 0001",
      role: "staff",
      department: "housekeeping",
      hotelId: hotel.id,
      baseSalary: 3200,
      hourlyRate: 22,
      isActive: true,
      avatarUrl: "https://i.pravatar.cc/150?u=cleaner@via.example",
    },
  });

  const maintenance = await db.staff.create({
    data: {
      email: "maintenance@via.example",
      passwordHash: "$2a$10$demo.hashplaceholderonlynotsecure.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      name: "Yusuf Khan",
      nameAr: "يوسف خان",
      phone: "+966 50 111 0003",
      role: "supervisor",
      department: "maintenance",
      hotelId: hotel.id,
      baseSalary: 4500,
      hourlyRate: 32,
      isActive: true,
      avatarUrl: "https://i.pravatar.cc/150?u=maintenance@via.example",
    },
  });

  // 2 Tasks
  await db.staffTask.create({
    data: {
      staffId: cleaner.id,
      assignedBy: adminUser.id,
      hotelId: hotel.id,
      type: "cleaning",
      title: "Deep clean Room 502",
      description: "تنظيف عميق لغرفة 502",
      location: "Room 502",
      priority: "high",
      status: "pending",
      dueAt: new Date(Date.now() + 86400000),
    },
  });
  await db.staffTask.create({
    data: {
      staffId: maintenance.id,
      assignedBy: adminUser.id,
      hotelId: hotel.id,
      type: "maintenance",
      title: "Fix AC in Room 210",
      description: "إصلاح المكيف في غرفة 210",
      location: "Room 210",
      priority: "urgent",
      status: "in_progress",
      startedAt: new Date(Date.now() - 3600000),
      dueAt: new Date(Date.now() + 86400000),
    },
  });

  // 2 Salaries
  const currentPeriod = new Date().toISOString().slice(0, 7);
  await db.salaryPayment.create({
    data: {
      staffId: cleaner.id,
      amount: cleaner.baseSalary,
      period: currentPeriod,
      bonus: 200,
      deductions: 0,
      status: "paid",
      paidAt: new Date(),
    },
  });
  await db.salaryPayment.create({
    data: {
      staffId: maintenance.id,
      amount: maintenance.baseSalary,
      period: currentPeriod,
      bonus: 0,
      deductions: 50,
      status: "pending",
    },
  });

  // 2 Cameras
  await db.camera.create({
    data: {
      name: "Lobby Camera",
      location: "Main Lobby",
      hotelId: hotel.id,
      status: "online",
      streamUrl: null,
    },
  });
  await db.camera.create({
    data: {
      name: "Pool Camera",
      location: "Pool Area",
      hotelId: hotel.id,
      status: "offline",
      streamUrl: null,
    },
  });

  // ───────────────────────────────────────────────────────────
  // Front Desk & Operations: Maintenance, Guests, CheckIns, Inventory
  // ───────────────────────────────────────────────────────────
  console.log("🏨 Seeding front desk & operations (minimal)...");

  // 1 Maintenance Request
  await db.maintenanceRequest.create({
    data: {
      hotelId: hotel.id,
      roomId: "ROOM-001",
      reportedBy: hotelOwner.id,
      assignedTo: maintenance.id,
      title: "AC not cooling properly",
      description: "Guest in Room 001 reported AC blowing warm air. Needs urgent servicing.",
      location: "Room 001",
      priority: "high",
      status: "in_progress",
      category: "hvac",
      startedAt: new Date(Date.now() - 3600000),
    },
  });

  // 1 Guest Profile
  const guest = await db.guestProfile.create({
    data: {
      hotelId: hotel.id,
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
      preferences: json(["non-smoking", "high floor", "quiet"]),
      dietaryNeeds: "none",
      vipStatus: "gold",
      totalStays: 3,
      totalSpent: 9800,
      lastStayAt: new Date("2026-06-15"),
    },
  });

  // 1 CheckIn
  await db.checkIn.create({
    data: {
      hotelId: hotel.id,
      guestId: guest.id,
      roomId: "ROOM-002",
      guestName: "John Smith",
      guestEmail: "john.smith@example.com",
      guestPhone: "+1 415 555 0100",
      numGuests: 2,
      checkInAt: new Date(),
      expectedCheckOut: new Date(Date.now() + 3 * 86400000),
      status: "checked_in",
      roomNumber: "502",
      keyCardCount: 2,
      depositCollected: 500,
      specialRequests: "Late check-out preferred",
    },
  });

  // 2 Inventory Items
  await db.inventoryItem.create({
    data: {
      hotelId: hotel.id,
      name: "Bath Towels",
      nameAr: "مناشف الحمام",
      category: "linens",
      unit: "piece",
      quantity: 80,
      minStock: 30,
      maxStock: 150,
      unitCost: 25,
      supplier: "Hotel Supplies Co.",
      location: "Linen Room A",
      lastRestockedAt: new Date(Date.now() - 7 * 86400000),
      lastRestockQty: 50,
    },
  });
  await db.inventoryItem.create({
    data: {
      hotelId: hotel.id,
      name: "Shampoo Bottles",
      nameAr: "زجاجات الشامبو",
      category: "toiletries",
      unit: "piece",
      quantity: 15,
      minStock: 40,
      maxStock: 200,
      unitCost: 3,
      supplier: "Toiletries Direct",
      location: "Storage Room B",
      lastRestockedAt: new Date(Date.now() - 14 * 86400000),
      lastRestockQty: 100,
    },
  });

  // 1 Room Status Log
  await db.roomStatusLog.create({
    data: {
      roomId: "ROOM-001",
      status: "dirty",
      notes: "Guest checked out, needs cleaning",
      changedBy: hotelOwner.id,
    },
  });
  await db.roomStatusLog.create({
    data: {
      roomId: "ROOM-002",
      status: "occupied",
      notes: "John Smith checked in",
      changedBy: hotelOwner.id,
    },
  });

  // ───────────────────────────────────────────────────────────
  // Car Rental: 1 Company + 2 Cars + 1 Booking
  // ───────────────────────────────────────────────────────────
  console.log("🚗 Seeding car rental (minimal)...");

  const carOwner = await db.user.create({
    data: {
      id: "user-car-demo",
      email: "cars@via.example",
      passwordHash: "$2a$10$demo.hashplaceholderonlynotsecure.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      name: "Saud Car Rentals",
      role: "BundleCreator",
      phone: "+966 55 222 0001",
      companyName: "Saud Car Rentals",
      languagesSpoken: json(["Arabic", "English"]),
      kycStatus: "Approved",
      kycSubmittedAt: new Date("2024-07-01"),
      kycReviewedAt: new Date("2024-07-03"),
    },
  });

  const carCompany = await db.carCompany.create({
    data: {
      ownerId: carOwner.id,
      name: "Desert Wheels",
      description: "Premium car rental across Saudi Arabia.",
      phone: "+966 11 200 0001",
      email: "info@desertwheels.com",
      city: "Riyadh",
      rating: 4.7,
      isActive: true,
    },
  });

  // 2 Cars
  const car1 = await db.car.create({
    data: {
      companyId: carCompany.id,
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
      images: json(["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"]),
      features: json(["Bluetooth", "USB Charging", "Air Conditioning", "ABS", "Airbags"]),
      available: true,
      mileage: 5000,
      color: "White",
    },
  });
  const car2 = await db.car.create({
    data: {
      companyId: carCompany.id,
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
      images: json(["https://images.unsplash.com/photo-1519440139665-992c9d9c6b6e?w=800&q=80"]),
      features: json(["Bluetooth", "USB Charging", "Air Conditioning", "4x4", "Leather Seats"]),
      available: true,
      mileage: 8000,
      color: "Black",
    },
  });

  // 1 Car booking
  await db.carBooking.create({
    data: {
      carId: car1.id,
      companyId: carCompany.id,
      guestName: "Ahmed Al-Rashid",
      guestEmail: "ahmed@example.com",
      guestPhone: "+966 50 333 0001",
      pickupLocation: "Riyadh Airport",
      dropoffLocation: "Riyadh Office",
      startDate: new Date(Date.now() + 86400000),
      endDate: new Date(Date.now() + 4 * 86400000),
      days: 3,
      totalAmount: 540,
      deposit: 360,
      status: "confirmed",
    },
  });

  console.log("✅ Seed complete (minimal)");
  console.log(`   Users:               ${await db.user.count()}`);
  console.log(`   Hotels:              ${await db.hotel.count()}`);
  console.log(`   Rooms:               ${await db.room.count()}`);
  console.log(`   Bundles:             ${await db.bundle.count()}`);
  console.log(`   Bundle Days:         ${await db.bundleDay.count()}`);
  console.log(`   Bundle Items:        ${await db.bundleItem.count()}`);
  console.log(`   Bookings:            ${await db.booking.count()}`);
  console.log(`   Notifications:       ${await db.notification.count()}`);
  console.log(`   Reviews:             ${await db.review.count()}`);
  console.log(`   Staff:               ${await db.staff.count()}`);
  console.log(`   Staff Tasks:         ${await db.staffTask.count()}`);
  console.log(`   Salary Payments:     ${await db.salaryPayment.count()}`);
  console.log(`   Cameras:             ${await db.camera.count()}`);
  console.log(`   Maintenance Reqs:    ${await db.maintenanceRequest.count()}`);
  console.log(`   Guest Profiles:      ${await db.guestProfile.count()}`);
  console.log(`   Check-Ins:           ${await db.checkIn.count()}`);
  console.log(`   Inventory Items:     ${await db.inventoryItem.count()}`);
  console.log(`   Room Status Logs:    ${await db.roomStatusLog.count()}`);
  console.log(`   Car Companies:       ${await db.carCompany.count()}`);
  console.log(`   Cars:                ${await db.car.count()}`);
  console.log(`   Car Bookings:        ${await db.carBooking.count()}`);
  console.log("");
  console.log("  Demo logins (any password works — auth is mocked):");
  console.log("    Hotel Owner:      hotel@via.example");
  console.log("    Bundle Creator:   bundle@via.example");
  console.log("    Admin:            admin@via.example");
  console.log("    Car Rental Owner: cars@via.example");
  console.log("    Staff:            cleaner@via.example / maintenance@via.example");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
