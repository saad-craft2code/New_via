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

  // ───────────────────────────────────────────────────────────
  // Operations: Staff + Tasks + Salaries + Cameras
  // ───────────────────────────────────────────────────────────
  console.log("👥 Seeding staff & operations...");

  const staffMembers = [
    { email: "cleaner1@via.example", name: "Maria Santos", nameAr: "ماريا سانتوس", phone: "+966 50 111 0001", role: "staff", department: "housekeeping", baseSalary: 3200, hourlyRate: 22 },
    { email: "cleaner2@via.example", name: "Aisha Mohammed", nameAr: "عائشة محمد", phone: "+966 50 111 0002", role: "staff", department: "housekeeping", baseSalary: 3000, hourlyRate: 20 },
    { email: "maintenance1@via.example", name: "Yusuf Khan", nameAr: "يوسف خان", phone: "+966 50 111 0003", role: "staff", department: "maintenance", baseSalary: 4500, hourlyRate: 32 },
    { email: "frontdesk1@via.example", name: "Layla Hassan", nameAr: "ليلى حسن", phone: "+966 50 111 0004", role: "supervisor", department: "front_desk", baseSalary: 5500, hourlyRate: 38 },
    { email: "security1@via.example", name: "Omar Ali", nameAr: "عمر علي", phone: "+966 50 111 0005", role: "staff", department: "security", baseSalary: 4000, hourlyRate: 28 },
    { email: "kitchen1@via.example", name: "Fatima Noor", nameAr: "فاطمة نور", phone: "+966 50 111 0006", role: "staff", department: "kitchen", baseSalary: 3500, hourlyRate: 24 },
    { email: "supervisor1@via.example", name: "Khalid Al-Rashid", nameAr: "خالد الراشد", phone: "+966 50 111 0007", role: "manager", department: "housekeeping", baseSalary: 7000, hourlyRate: 50 },
  ];

  for (const s of staffMembers) {
    await db.staff.create({
      data: {
        email: s.email,
        passwordHash: "$2a$10$demo.hashplaceholderonlynotsecure.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        name: s.name,
        nameAr: s.nameAr,
        phone: s.phone,
        role: s.role,
        department: s.department,
        hotelId: mockHotels[0].id,
        baseSalary: s.baseSalary,
        hourlyRate: s.hourlyRate,
        isActive: true,
        avatarUrl: `https://i.pravatar.cc/150?u=${s.email}`,
      },
    });
  }

  // ── Tasks (assigned to staff)
  const allStaff = await db.staff.findMany();
  const taskTemplates = [
    { type: "cleaning", title: "Deep clean Room 502", titleAr: "تنظيف عميق لغرفة 502", location: "Room 502", priority: "high", department: "housekeeping" },
    { type: "cleaning", title: "Turnover Room 304", titleAr: "تجهيز غرفة 304", location: "Room 304", priority: "normal", department: "housekeeping" },
    { type: "maintenance", title: "Fix AC in Room 210", titleAr: "إصلاح المكيف في غرفة 210", location: "Room 210", priority: "urgent", department: "maintenance" },
    { type: "maintenance", title: "Replace light bulb - Lobby", titleAr: "استبدال مصباح اللوبي", location: "Lobby", priority: "low", department: "maintenance" },
    { type: "inspection", title: "Inspect pool area", titleAr: "فحص منطقة المسبح", location: "Pool", priority: "normal", department: "housekeeping" },
    { type: "setup", title: "Setup conference room for event", titleAr: "تجهيز قاعة المؤتمرات", location: "Conference Hall A", priority: "high", department: "housekeeping" },
    { type: "cleaning", title: "Clean lobby bathrooms", titleAr: "تنظيف دورات مياه اللوبي", location: "Lobby", priority: "normal", department: "housekeeping" },
    { type: "delivery", title: "Deliver extra pillows to Room 410", titleAr: "توصيل وسائد إضافية لغرفة 410", location: "Room 410", priority: "low", department: "housekeeping" },
    { type: "maintenance", title: "Fix leaky faucet - Room 120", titleAr: "إصلاح صنبور متسرب - غرفة 120", location: "Room 120", priority: "normal", department: "maintenance" },
    { type: "inspection", title: "Fire safety check - Floor 3", titleAr: "فحص سلامة الحريق - الطابق 3", location: "Floor 3", priority: "high", department: "security" },
    { type: "cleaning", title: "Vacuum hallway carpet - Floor 5", titleAr: "كنس سجادة الممر - الطابق 5", location: "Floor 5 Hallway", priority: "low", department: "housekeeping" },
    { type: "setup", title: "Prepare breakfast buffet", titleAr: "تجهيز بوفيه الإفطار", location: "Restaurant", priority: "high", department: "kitchen" },
  ];

  const statuses = ["pending", "in_progress", "completed", "pending", "in_progress", "completed", "pending"];
  for (let i = 0; i < taskTemplates.length; i++) {
    const t = taskTemplates[i];
    const eligibleStaff = allStaff.filter((s) => s.department === t.department);
    const staff = eligibleStaff[i % eligibleStaff.length] ?? allStaff[i % allStaff.length];
    const status = statuses[i % statuses.length];
    const startedAt = status !== "pending" ? new Date(Date.now() - 3600000 * (i + 1)) : null;
    const completedAt = status === "completed" ? new Date(Date.now() - 1800000) : null;
    await db.staffTask.create({
      data: {
        staffId: staff.id,
        assignedBy: adminUser.id,
        hotelId: mockHotels[0].id,
        type: t.type,
        title: t.title,
        description: t.titleAr,
        location: t.location,
        priority: t.priority,
        status,
        startedAt,
        completedAt,
        dueAt: new Date(Date.now() + 86400000 * (i % 3 + 1)),
      },
    });
  }

  // ── Salary payments for current month
  const currentPeriod = new Date().toISOString().slice(0, 7);
  for (const s of allStaff) {
    await db.salaryPayment.create({
      data: {
        staffId: s.id,
        amount: s.baseSalary,
        period: currentPeriod,
        bonus: Math.random() > 0.7 ? 500 : 0,
        deductions: Math.random() > 0.8 ? 100 : 0,
        status: Math.random() > 0.5 ? "paid" : "pending",
        paidAt: Math.random() > 0.5 ? new Date() : null,
      },
    });
  }

  // ── Cameras (placeholder for future integration)
  const cameraLocations = [
    { name: "Lobby Camera", location: "Main Lobby", status: "online" },
    { name: "Pool Camera", location: "Pool Area", status: "online" },
    { name: "Parking Camera", location: "Parking Lot", status: "online" },
    { name: "Floor 3 Camera", location: "Floor 3 Hallway", status: "offline" },
    { name: "Restaurant Camera", location: "Restaurant", status: "maintenance" },
  ];
  for (const c of cameraLocations) {
    await db.camera.create({
      data: {
        name: c.name,
        location: c.location,
        hotelId: mockHotels[0].id,
        status: c.status,
        streamUrl: null,
      },
    });
  }

  // ───────────────────────────────────────────────────────────
  // Car Rental Module: Companies + Cars + Bookings
  // ───────────────────────────────────────────────────────────
  console.log("🚗 Seeding car rental data...");

  const carCompanyOwner = await db.user.create({
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

  const carCompanies = [
    { name: "Desert Wheels", description: "Premium car rental across Saudi Arabia", city: "Riyadh", phone: "+966 11 200 0001", email: "info@desertwheels.com", rating: 4.7 },
    { name: "Gulf Auto Rentals", description: "Wide selection of economy and luxury vehicles", city: "Jeddah", phone: "+966 12 200 0002", email: "info@gulfauto.com", rating: 4.5 },
    { name: "Pearl Motors", description: "Luxury car rentals for special occasions", city: "Dammam", phone: "+966 13 200 0003", email: "info@pearlmotors.com", rating: 4.9 },
  ];

  for (const c of carCompanies) {
    await db.carCompany.create({
      data: {
        ownerId: carCompanyOwner.id,
        name: c.name,
        description: c.description,
        phone: c.phone,
        email: c.email,
        city: c.city,
        rating: c.rating,
        isActive: true,
      },
    });
  }

  const allCompanies = await db.carCompany.findMany();
  const carTemplates = [
    { make: "Toyota", model: "Camry", year: 2024, category: "sedan", pricePerDay: 180, transmission: "automatic", seats: 5, doors: 4, bags: 2, fuelType: "petrol", color: "White" },
    { make: "Toyota", model: "Corolla", year: 2023, category: "economy", pricePerDay: 120, transmission: "automatic", seats: 5, doors: 4, bags: 2, fuelType: "petrol", color: "Silver" },
    { make: "Hyundai", model: "Sonata", year: 2024, category: "sedan", pricePerDay: 160, transmission: "automatic", seats: 5, doors: 4, bags: 2, fuelType: "petrol", color: "Black" },
    { make: "Nissan", model: "Patrol", year: 2024, category: "suv", pricePerDay: 450, transmission: "automatic", seats: 7, doors: 5, bags: 4, fuelType: "petrol", color: "White" },
    { make: "Toyota", model: "Land Cruiser", year: 2024, category: "suv", pricePerDay: 500, transmission: "automatic", seats: 7, doors: 5, bags: 4, fuelType: "petrol", color: "Black" },
    { make: "Kia", model: "Picanto", year: 2023, category: "economy", pricePerDay: 90, transmission: "automatic", seats: 4, doors: 4, bags: 1, fuelType: "petrol", color: "Red" },
    { make: "Mercedes", model: "E-Class", year: 2024, category: "luxury", pricePerDay: 750, transmission: "automatic", seats: 5, doors: 4, bags: 3, fuelType: "petrol", color: "Black" },
    { make: "BMW", model: "7 Series", year: 2024, category: "luxury", pricePerDay: 850, transmission: "automatic", seats: 5, doors: 4, bags: 3, fuelType: "petrol", color: "White" },
    { make: "Toyota", model: "Hiace", year: 2023, category: "van", pricePerDay: 280, transmission: "manual", seats: 12, doors: 4, bags: 6, fuelType: "diesel", color: "White" },
    { make: "Hyundai", model: "H1", year: 2024, category: "van", pricePerDay: 300, transmission: "manual", seats: 12, doors: 4, bags: 6, fuelType: "diesel", color: "Silver" },
    { make: "Tesla", model: "Model 3", year: 2024, category: "luxury", pricePerDay: 600, transmission: "automatic", seats: 5, doors: 4, bags: 2, fuelType: "electric", color: "Red" },
    { make: "Porsche", model: "911 Carrera", year: 2024, category: "sports", pricePerDay: 1500, transmission: "automatic", seats: 2, doors: 2, bags: 1, fuelType: "petrol", color: "Yellow" },
  ];

  for (const comp of allCompanies) {
    // 4 cars per company
    for (let i = 0; i < 4; i++) {
      const tpl = carTemplates[(i + allCompanies.indexOf(comp)) % carTemplates.length];
      await db.car.create({
        data: {
          companyId: comp.id,
          make: tpl.make,
          model: tpl.model,
          year: tpl.year,
          plateNumber: `${comp.city.slice(0, 3).toUpperCase()}-${1000 + i + allCompanies.indexOf(comp) * 10}`,
          category: tpl.category,
          transmission: tpl.transmission,
          seats: tpl.seats,
          doors: tpl.doors,
          bags: tpl.bags,
          ac: true,
          fuelType: tpl.fuelType,
          pricePerDay: tpl.pricePerDay,
          deposit: Math.round(tpl.pricePerDay * 2),
          images: json([`https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80`]),
          features: json(["Bluetooth", "USB Charging", "Air Conditioning", "Power Steering", "ABS", "Airbags"]),
          available: i !== 3, // last one unavailable
          mileage: 5000 + i * 1000 + allCompanies.indexOf(comp) * 2000,
          color: tpl.color,
        },
      });
    }
  }

  // ── Car bookings (a few sample)
  const allCars = await db.car.findMany({ include: { company: true } });
  const carBookingTemplates = [
    { guestName: "Ahmed Al-Rashid", guestEmail: "ahmed@example.com", guestPhone: "+966 50 333 0001", days: 3, status: "confirmed" },
    { guestName: "Sara Al-Otaibi", guestEmail: "sara@example.com", guestPhone: "+966 50 333 0002", days: 5, status: "active" },
    { guestName: "John Smith", guestEmail: "john@example.com", guestPhone: "+1 415 555 0100", days: 7, status: "pending" },
    { guestName: "Fatima Hassan", guestEmail: "fatima@example.com", guestPhone: "+966 55 333 0004", days: 2, status: "completed" },
  ];
  for (let i = 0; i < carBookingTemplates.length; i++) {
    const car = allCars[i % allCars.length];
    const tpl = carBookingTemplates[i];
    const startDate = new Date(Date.now() + (i - 1) * 86400000);
    const endDate = new Date(startDate.getTime() + tpl.days * 86400000);
    await db.carBooking.create({
      data: {
        carId: car.id,
        companyId: car.companyId,
        guestName: tpl.guestName,
        guestEmail: tpl.guestEmail,
        guestPhone: tpl.guestPhone,
        pickupLocation: car.company.city + " Airport",
        dropoffLocation: car.company.city + " Office",
        startDate,
        endDate,
        days: tpl.days,
        totalAmount: car.pricePerDay * tpl.days,
        deposit: car.deposit,
        status: tpl.status,
      },
    });
  }

  console.log("✅ Seed complete");
  console.log(`   Users:           ${await db.user.count()}`);
  console.log(`   Hotels:          ${await db.hotel.count()}`);
  console.log(`   Rooms:           ${await db.room.count()}`);
  console.log(`   Bundles:         ${await db.bundle.count()}`);
  console.log(`   Bundle Days:     ${await db.bundleDay.count()}`);
  console.log(`   Bundle Items:    ${await db.bundleItem.count()}`);
  console.log(`   Bookings:        ${await db.booking.count()}`);
  console.log(`   Notifications:   ${await db.notification.count()}`);
  console.log(`   Reviews:         ${await db.review.count()}`);
  console.log(`   Staff:           ${await db.staff.count()}`);
  console.log(`   Staff Tasks:     ${await db.staffTask.count()}`);
  console.log(`   Salary Payments: ${await db.salaryPayment.count()}`);
  console.log(`   Cameras:         ${await db.camera.count()}`);
  console.log(`   Car Companies:  ${await db.carCompany.count()}`);
  console.log(`   Cars:            ${await db.car.count()}`);
  console.log(`   Car Bookings:    ${await db.carBooking.count()}`);
  console.log("");
  console.log("  Demo logins (any password works — auth is mocked):");
  console.log("    Hotel Owner:        hotel@via.example");
  console.log("    Bundle Creator:     bundle@via.example");
  console.log("    Admin:              admin@via.example");
  console.log("    Car Rental Owner:   cars@via.example");
  console.log("    Staff (any):        cleaner1@via.example / cleaner2@via.example / maintenance1@via.example");
  console.log("                     / frontdesk1@via.example / security1@via.example / kitchen1@via.example / supervisor1@via.example");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
