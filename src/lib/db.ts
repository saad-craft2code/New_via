import { PrismaClient } from '@prisma/client'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Use Neon serverless adapter for Vercel/edge environments
  if (process.env.DATABASE_URL?.includes('neon.tech') || process.env.DATABASE_URL?.includes('pooler')) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaNeon(pool)
    return new PrismaClient({ adapter } as any)
  }
  // Fallback to standard PrismaClient for local dev
  return new PrismaClient({
    log: ['query'],
  })
}

export const db =
  globalForPrisma.prisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
