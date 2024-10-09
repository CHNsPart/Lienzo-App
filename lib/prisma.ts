/* import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma */

// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.VERCEL) {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'file:./prod.db'
      },
    },
  })
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient()
  }
  prisma = (global as any).prisma
}

export default prisma