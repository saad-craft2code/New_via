// Database client — gracefully handles missing DATABASE_URL
// Returns null when no database is configured (app uses mock data instead)

let dbClient: any = null;

try {
  const url = process.env.DATABASE_URL;
  if (url && !url.includes("file:") && !url.includes("PASSWORD") && !url.includes("dummy") && !url.includes("your-neon-host") && !url.includes("user:password")) {
    // Dynamic import so this doesn't crash the build if @prisma/client isn't fully generated
    const { PrismaClient } = require("@prisma/client");
    dbClient = new PrismaClient();
    if (process.env.NODE_ENV !== 'production') {
      (globalThis as any).prisma = dbClient;
    }
  }
} catch (e) {
  console.log("⚠️ PrismaClient not available — using mock data");
}

export const db = dbClient;
