// Debug auth helper
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const userId = "user-bc-demo";
  console.log(`Looking up user with id="${userId}"...`);
  const user = await db.user.findUnique({ where: { id: userId } });
  console.log("Found:", user ? `${user.id} (${user.email})` : "null");
  
  const userId2 = "demo-user-bc-demo".slice(6);
  console.log(`Token slice(6) = "${userId2}"`);
  const user2 = await db.user.findUnique({ where: { id: userId2 } });
  console.log("Found:", user2 ? `${user2.id} (${user2.email})` : "null");
}
main().then(() => db.$disconnect());
