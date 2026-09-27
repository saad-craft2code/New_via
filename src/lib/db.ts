import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("file:") || url.includes("PASSWORD") || url.includes("dummy") || url.includes("your-neon-host") || url.includes("user:password")) {
    console.log("⚠️ No valid DATABASE_URL — using mock data");
    return null;
  }
  try {
    const client = new PrismaClient()
    console.log("✅ PrismaClient connected to database");
    return client;
  } catch (e) {
    console.log("⚠️ PrismaClient failed — using mock data:", e);
    return null;
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient()
if (db && process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
