// Check user after profile update
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
async function main() {
  const u = await db.user.findUnique({ where: { email: "bundle@via.example" } });
  console.log("User now:", JSON.stringify({ id: u?.id, name: u?.name, phone: u?.phone, companyName: u?.companyName, languagesSpoken: u?.languagesSpoken }, null, 2));
}
main().then(() => db.$disconnect());
