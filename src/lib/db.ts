import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("file:") || url.includes("PASSWORD") || url.includes("your-neon-host") || url.includes("user:password")) {
    return null;
  }
  try {
    return new PrismaClient()
  } catch (e) {
    return null;
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient()
if (db && process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
