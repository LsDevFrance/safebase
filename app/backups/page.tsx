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
import { CheckCircle2, Database, Download, XCircle } from "lucide-react";

type DatabaseWithBackups = {
  id: string;
  name: string;
  type: string;
  backups: {
    id: string;
    name: string;
    url: string;
    error: boolean;
    createdAt: Date;
  }[];
};

async function getDatabasesWithBackups(): Promise<DatabaseWithBackups[]> {
  const databases = await prisma.database.findMany({
    include: {
      backups: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return databases.map((db) => ({
    id: db.id,
    name: db.name,
    type: db.type,
    backups: db.backups.map((backup) => ({
      id: backup.id,
      name: backup.name,
      url: backup.url,
      error: backup.error,
      createdAt: backup.createdAt,
    })),
  }));
}

export default async function BackupsPage() {
  const databases = await getDatabasesWithBackups();

  return (
    <Layout size="lg">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Historique des sauvegardes</h1>
        </div>
      </header>
      <LayoutContent>
        <div className="flex flex-col gap-4">
          {databases.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Aucune base de données trouvée
                </p>
              </CardContent>
            </Card>
          ) : (
            databases.map((database) => (
              <Card key={database.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <CardTitle>{database.name}</CardTitle>
                        <CardDescription>
                          {database.type === "postgresql"
                            ? "PostgreSQL"
                            : "MySQL"}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {database.backups.length} sauvegarde
                      {database.backups.length > 1 ? "s" : ""}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {database.backups.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune sauvegarde effectuée pour cette base de données
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {database.backups.map((backup) => (
                        <div
                          key={backup.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              {backup.error ? (
                                <XCircle className="h-4 w-4 text-destructive" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              )}
                              <span className="font-medium">{backup.name}</span>
                              {backup.error && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Erreur
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Intl.DateTimeFormat("fr-FR", {
                                dateStyle: "long",
                                timeStyle: "short",
                              }).format(new Date(backup.createdAt))}
                            </p>
                          </div>
                          {!backup.error && (
                            <a
                              href={`/api/backups/${backup.id}/download`}
                              download
                              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                            >
                              <Download className="h-4 w-4" />
                              Télécharger
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </LayoutContent>
    </Layout>
  );
}
