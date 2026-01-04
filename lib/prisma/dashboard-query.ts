import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";

export const getDashboardStats = async () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalDatabases,
    activeBackups,
    lastBackup,
    failedBackups,
    backupsLast7Days,
  ] = await Promise.all([
    prisma.database.count(),

    prisma.backup.count({
      where: { error: false },
    }),

    prisma.backup.findFirst({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),

    prisma.backup.count({
      where: { error: true },
    }),

    prisma.backup.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
        error: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const backupsOnDay = backupsLast7Days.filter(
      (b) => b.createdAt >= dayStart && b.createdAt <= dayEnd
    );

    return {
      date: dayStart.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      }),
      success: backupsOnDay.filter((b) => !b.error).length,
      failed: backupsOnDay.filter((b) => b.error).length,
    };
  });

  return {
    totalDatabases,
    activeBackups,
    lastBackup: lastBackup?.createdAt,
    failedBackups,
    chartData,
  };
};

export type DashboardStatsType = Prisma.PromiseReturnType<
  typeof getDashboardStats
>;
