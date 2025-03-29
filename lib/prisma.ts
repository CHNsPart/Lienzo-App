// import { PrismaClient } from '@prisma/client'
// import { join } from 'path'

// let prisma: PrismaClient

// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient({
//     datasources: {
//       db: {
//         url: `file:${join(process.cwd(), 'prisma', 'dev.db')}`,
//       },
//     },
//   })
// } else {
//   if (!(global as any).prisma) {
//     (global as any).prisma = new PrismaClient()
//   }
//   prisma = (global as any).prisma
// }

// export default prisma

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
};

declare global {
  /* eslint no-var: off */
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;