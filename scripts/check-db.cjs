// Quick DB inspection script
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const users = await db.user.findMany({ select: { id: true, email: true, role: true } });
  console.log("Users:", JSON.stringify(users, null, 2));
  const counts = {
    hotels: await db.hotel.count(),
    bundles: await db.bundle.count(),
    bookings: await db.booking.count(),
    notifications: await db.notification.count(),
  };
  console.log("Counts:", counts);
}
main().then(() => db.$disconnect());
