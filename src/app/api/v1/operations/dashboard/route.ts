// GET /api/v1/operations/dashboard — hotel operations KPIs
// Returns: occupancy, ADR, RevPAR, today's arrivals/departures,
// active maintenance, low stock alerts, active check-ins, room status counts
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);

  const hotels = await db.hotel.findMany({
    where: { ownerId: userId },
    select: { id: true, name: true },
  });
  const hotelIds = hotels.map((h) => h.id);
  if (hotelIds.length === 0) {
    return ok({
      kpi: { totalHotels: 0, totalRooms: 0, occupancyRate: 0, adr: 0, revpar: 0, activeCheckIns: 0, arrivalsToday: 0, departuresToday: 0, openMaintenance: 0, lowStockItems: 0 },
      roomStatusBreakdown: {},
      todayActivity: { arrivals: [], departures: [], maintenance: [], lowStock: [] },
    });
  }

  // Get all rooms
  const rooms = await db.room.findMany({
    where: { hotelId: { in: hotelIds } },
    select: { id: true, totalUnits: true, availableUnits: true, pricePerNight: true },
  });
  const totalRooms = rooms.reduce((sum, r) => sum + r.totalUnits, 0);
  const availableRooms = rooms.reduce((sum, r) => sum + r.availableUnits, 0);
  const occupiedRooms = totalRooms - availableRooms;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Today's date range
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Active check-ins
  const activeCheckIns = await db.checkIn.findMany({
    where: { hotelId: { in: hotelIds }, status: "checked_in" },
    include: { room: { select: { roomType: true } }, hotel: { select: { name: true } } },
  });

  // Today's arrivals
  const arrivalsToday = await db.checkIn.findMany({
    where: {
      hotelId: { in: hotelIds },
      checkInAt: { gte: startOfDay, lte: endOfDay },
    },
    include: { hotel: { select: { name: true } } },
  });

  // Today's departures (expected check-out today, still checked in)
  const departuresToday = await db.checkIn.findMany({
    where: {
      hotelId: { in: hotelIds },
      status: "checked_in",
      expectedCheckOut: { gte: startOfDay, lte: endOfDay },
    },
    include: { hotel: { select: { name: true } } },
  });

  // Open maintenance requests
  const openMaintenance = await db.maintenanceRequest.findMany({
    where: {
      hotelId: { in: hotelIds },
      status: { in: ["open", "in_progress"] },
    },
    include: {
      hotel: { select: { name: true } },
      room: { select: { roomType: true } },
      staff: { select: { name: true } },
    },
  });

  // Inventory
  const inventoryItems = await db.inventoryItem.findMany({
    where: { hotelId: { in: hotelIds } },
  });
  const lowStockItems = inventoryItems.filter((i) => i.quantity <= i.minStock);

  // Room status breakdown — get latest log per room
  const roomStatuses = await db.roomStatusLog.groupBy({
    by: ["status"],
    where: { room: { hotelId: { in: hotelIds } } },
    _count: { status: true },
  });
  const statusBreakdown: Record<string, number> = {};
  roomStatuses.forEach((s) => { statusBreakdown[s.status] = s._count.status; });

  // Calculate ADR (Average Daily Rate) — average pricePerNight of all rooms
  const adr = rooms.length > 0
    ? Math.round(rooms.reduce((sum, r) => sum + r.pricePerNight, 0) / rooms.length)
    : 0;

  // RevPAR = ADR × Occupancy
  const revpar = Math.round(adr * (occupancyRate / 100));

  return ok({
    kpi: {
      totalHotels: hotels.length,
      totalRooms,
      availableRooms,
      occupiedRooms,
      occupancyRate,
      adr,
      revpar,
      activeCheckIns: activeCheckIns.length,
      arrivalsToday: arrivalsToday.length,
      departuresToday: departuresToday.length,
      openMaintenance: openMaintenance.length,
      lowStockItems: lowStockItems.length,
      inventoryValue: inventoryItems.reduce((sum, i) => sum + i.quantity * i.unitCost, 0),
    },
    roomStatusBreakdown: statusBreakdown,
    todayActivity: {
      arrivals: arrivalsToday.map((c) => ({
        id: c.id,
        guestName: c.guestName,
        roomNumber: c.roomNumber,
        hotelName: c.hotel?.name,
        checkInAt: c.checkInAt,
        numGuests: c.numGuests,
      })),
      departures: departuresToday.map((c) => ({
        id: c.id,
        guestName: c.guestName,
        roomNumber: c.roomNumber,
        hotelName: c.hotel?.name,
        expectedCheckOut: c.expectedCheckOut,
      })),
      maintenance: openMaintenance.map((m) => ({
        id: m.id,
        title: m.title,
        priority: m.priority,
        status: m.status,
        location: m.location,
        hotelName: m.hotel?.name,
        assignedTo: m.staff?.name,
      })),
      lowStock: lowStockItems.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        minStock: i.minStock,
        unit: i.unit,
      })),
    },
  });
}
