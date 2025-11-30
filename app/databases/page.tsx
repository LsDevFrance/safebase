import { SidebarTrigger } from "@/components/ui/sidebar";
import { Layout, LayoutContent } from "@/features/page/layout";
import prisma from "@/lib/prisma";
import { columns, type Database } from "./_components/database-table/columns";
import { DataTable } from "./_components/database-table/data-table";

async function getData(): Promise<Database[]> {
  const databases = await prisma.database.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return databases.map((db) => ({
    id: db.id,
    name: db.name,
    type: db.type as "mysql" | "postgresql",
    createdAt: db.createdAt,
  }));
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <Layout size="lg">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Mes bases de données</h1>
        </div>
      </header>
      <LayoutContent>
        <DataTable columns={columns} data={data} />
      </LayoutContent>
    </Layout>
  );
}
