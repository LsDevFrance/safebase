import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Layout, LayoutContent } from "@/features/page/layout";
import prisma from "@/lib/prisma";
import { Calendar, Clock, Database } from "lucide-react";

type ScheduledBackup = {
  databaseId: string;
  databaseName: string;
  databaseType: string;
  lastBackupDate: Date | null;
  nextBackupDate: Date;
  daysUntilNext: number;
};

async function getScheduledBackups(): Promise<ScheduledBackup[]> {
  const databases = await prisma.database.findMany({
    include: {
      backups: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const BACKUP_INTERVAL_DAYS = 5;

  return databases.map((db) => {
    const lastBackup = db.backups[0];
    const lastBackupDate = lastBackup?.createdAt ?? db.updatedAt;

    const nextBackupDate = new Date(lastBackupDate);
    nextBackupDate.setDate(nextBackupDate.getDate() + BACKUP_INTERVAL_DAYS);

    const now = new Date();
    const daysUntilNext = Math.ceil(
      (nextBackupDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      databaseId: db.id,
      databaseName: db.name,
      databaseType: db.type,
      lastBackupDate: lastBackup?.createdAt ?? null,
      nextBackupDate,
      daysUntilNext,
    };
  });
}

function getStatusBadge(daysUntilNext: number) {
  if (daysUntilNext <= 0) {
    return (
      <Badge variant="destructive" className="gap-1.5">
        <Clock className="h-3 w-3" />
        En retard
      </Badge>
    );
  }
  if (daysUntilNext <= 2) {
    return (
      <Badge
        variant="outline"
        className="gap-1.5 border-orange-500 text-orange-600"
      >
        <Clock className="h-3 w-3" />
        Bientôt
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1.5">
      <Calendar className="h-3 w-3" />
      Planifié
    </Badge>
  );
}

export default async function SchedulePage() {
  const scheduledBackups = await getScheduledBackups();

  return (
    <Layout size="lg">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">
            Planification des sauvegardes
          </h1>
        </div>
      </header>
      <LayoutContent>
        <div className="flex flex-col gap-4">
          {scheduledBackups.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Aucune base de données trouvée
                </p>
              </CardContent>
            </Card>
          ) : (
            scheduledBackups.map((scheduled) => (
              <Card key={scheduled.databaseId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <CardTitle>{scheduled.databaseName}</CardTitle>
                        <CardDescription>
                          {scheduled.databaseType === "postgresql"
                            ? "PostgreSQL"
                            : "MySQL"}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(scheduled.daysUntilNext)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Dernière sauvegarde
                        </span>
                        <span className="text-sm font-medium">
                          {scheduled.lastBackupDate
                            ? new Intl.DateTimeFormat("fr-FR", {
                                dateStyle: "long",
                                timeStyle: "short",
                              }).format(new Date(scheduled.lastBackupDate))
                            : "Jamais"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Prochaine sauvegarde
                        </span>
                        <span className="text-sm font-medium">
                          {new Intl.DateTimeFormat("fr-FR", {
                            dateStyle: "long",
                            timeStyle: "short",
                          }).format(scheduled.nextBackupDate)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Jours restants
                        </span>
                        <span className="text-sm font-medium">
                          {scheduled.daysUntilNext <= 0
                            ? "En retard"
                            : scheduled.daysUntilNext === 1
                              ? "1 jour"
                              : `${scheduled.daysUntilNext} jours`}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </LayoutContent>
    </Layout>
  );
}
