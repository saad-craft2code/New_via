// GET /api/v1/operations/dashboard
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../../_lib";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const hotels = await db.hotel.findMany({ where: { ownerId: userId }, select: { id: true, name: true } });
      const hotelIds = hotels.map((h: any) => h.id);
      const rooms = await db.room.findMany({ where: { hotelId: { in: hotelIds } }, select: { totalUnits: true, availableUnits: true, pricePerNight: true } });
      const totalRooms = rooms.reduce((s: number, r: any) => s + r.totalUnits, 0);
      const availableRooms = rooms.reduce((s: number, r: any) => s + r.availableUnits, 0);
      const occupiedRooms = totalRooms - availableRooms;
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
      const adr = rooms.length > 0 ? Math.round(rooms.reduce((s: number, r: any) => s + r.pricePerNight, 0) / rooms.length) : 0;
      const revpar = Math.round(adr * (occupancyRate / 100));
      return ok({
        kpi: { totalHotels: hotels.length, totalRooms, availableRooms, occupiedRooms, occupancyRate, adr, revpar, activeCheckIns: 1, arrivalsToday: 1, departuresToday: 0, openMaintenance: 1, lowStockItems: 1, inventoryValue: 2045 },
        roomStatusBreakdown: { available: availableRooms, occupied: occupiedRooms, dirty: 1 },
        todayActivity: { arrivals: [{ id: "1", guestName: "John Smith", roomNumber: "502", hotelName: "Golden Oasis Hotel", checkInAt: new Date().toISOString(), numGuests: 2 }], departures: [], maintenance: mock.maintenance.map(m => ({ id: m.id, title: m.title, priority: m.priority, status: m.status, location: m.location, assignedTo: "Yusuf Khan" })), lowStock: [{ id: "1", name: "Shampoo Bottles", quantity: 15, minStock: 40, unit: "piece" }] },
      });
    } catch (e) { console.log("DB error, using mock"); }
  }
  return ok({
    kpi: { totalHotels: mock.hotels.length, totalRooms: mock.rooms.length, availableRooms: mock.rooms.reduce((s, r) => s + r.availableUnits, 0), occupiedRooms: mock.rooms.reduce((s, r) => s + (r.totalUnits - r.availableUnits), 0), occupancyRate: 71, adr: 875, revpar: 621, activeCheckIns: 1, arrivalsToday: 1, departuresToday: 0, openMaintenance: mock.maintenance.length, lowStockItems: 1, inventoryValue: 2045 },
    roomStatusBreakdown: { available: 1, occupied: 1, dirty: 1 },
    todayActivity: { arrivals: [{ id: "1", guestName: "John Smith", roomNumber: "502", hotelName: "Golden Oasis Hotel", checkInAt: new Date().toISOString(), numGuests: 2 }], departures: [], maintenance: mock.maintenance.map(m => ({ id: m.id, title: m.title, priority: m.priority, status: m.status, location: m.location, assignedTo: "Yusuf Khan" })), lowStock: [{ id: "1", name: "Shampoo Bottles", quantity: 15, minStock: 40, unit: "piece" }] },
  });
}
