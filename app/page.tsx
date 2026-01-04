import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getDashboardStats } from "@/lib/prisma/dashboard-query";
import { BackupChart } from "./_components/backup-chart";

export default async function Home() {
  const stats = await getDashboardStats();

  const formatLastBackup = (date: Date | null | undefined) => {
    if (!date) return "-";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days}j`;
    if (hours > 0) return `Il y a ${hours}h`;
    if (minutes > 0) return `Il y a ${minutes}min`;
    return "À l'instant";
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Tableau de bord</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Bases de données
            </h3>
            <p className="text-2xl font-bold mt-2">{stats.totalDatabases}</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Sauvegardes réussies
            </h3>
            <p className="text-2xl font-bold mt-2">{stats.activeBackups}</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Dernière sauvegarde
            </h3>
            <p className="text-2xl font-bold mt-2">
              {formatLastBackup(stats.lastBackup)}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Alertes
            </h3>
            <p className="text-2xl font-bold mt-2 text-destructive">
              {stats.failedBackups}
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Historique des sauvegardes</CardTitle>
            <CardDescription>
              Évolution des sauvegardes sur les 7 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BackupChart data={stats.chartData} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
