import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
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
            <p className="text-2xl font-bold mt-2">0</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Sauvegardes actives
            </h3>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Dernière sauvegarde
            </h3>
            <p className="text-2xl font-bold mt-2">-</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Alertes
            </h3>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>
        </div>
        <div className="flex-1 rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Bienvenue sur SafeBase</h2>
          <p className="text-muted-foreground">
            Commencez par ajouter une base de données pour démarrer la gestion
            de vos sauvegardes.
          </p>
        </div>
      </main>
    </div>
  );
}
