const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.carBooking.findMany({ include: { car: true }, orderBy: { createdAt: "desc" }, take: 5 }).then((rows) => {
  console.log("Latest car bookings:");
  rows.forEach((r, i) => {
    console.log(`  ${i+1}. ${r.guestName} — ${r.car.make} ${r.car.model} (${r.days} days, ${r.totalAmount} SAR, status: ${r.status})`);
  });
}).then(() => p.$disconnect());
