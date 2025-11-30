import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const getConnectionString = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }

  if (process.env.NODE_ENV === "development") {
    const url = new URL(databaseUrl);
    url.searchParams.set("sslmode", "no-verify");
    return url.toString();
  }

  return databaseUrl;
};

const adapter = new PrismaPg({
  connectionString: getConnectionString(),
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
