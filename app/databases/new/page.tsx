import { SidebarTrigger } from "@/components/ui/sidebar";
import { Layout, LayoutContent } from "@/features/page/layout";
import { AddDatabaseForm } from "../_components/database-form/add-database.form";

export default function RootPage() {
  return (
    <Layout size="lg">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Ajouter une base de données</h1>
        </div>
      </header>

      <LayoutContent>
        <AddDatabaseForm />
      </LayoutContent>
    </Layout>
  );
}
