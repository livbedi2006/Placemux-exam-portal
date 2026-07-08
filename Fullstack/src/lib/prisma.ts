import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
  const connectionString =
    process.env.DATABASE_URL ??
    'postgresql://user:password@localhost:5432/examai?schema=public';
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
