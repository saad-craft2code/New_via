import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL;
  // If no DATABASE_URL or it's a placeholder, return null (use mock data)
  if (!url || url.includes("file:") || url.includes("your-neon-host") || url.includes("user:password")) {
    console.log("⚠️ No valid DATABASE_URL — using mock data (in-memory)");
    return null;
  }
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    })
  } catch (e) {
    console.log("⚠️ PrismaClient failed — using mock data:", e);
    return null;
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (db && process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
