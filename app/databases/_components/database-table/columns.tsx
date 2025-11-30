"use client";

import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteDatabaseAction } from "../../database.action";
import type { DeleteDatabaseSchemaType } from "../database-form/add-database.schema";
import { ConnectionStatus } from "./connection-status";

export type Database = {
  id: string;
  name: string;
  type: "mysql" | "postgresql";
  createdAt: Date;
};

export const columns: ColumnDef<Database>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <span className="capitalize">
          {type === "postgresql" ? "PostgreSQL" : "MySQL"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date d'ajout",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "long",
      }).format(new Date(date));
    },
  },
  {
    id: "connectionStatus",
    header: "Connexion",
    cell: ({ row }) => {
      return <ConnectionStatus databaseId={row.original.id} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionsCell database={row.original} />;
    },
  },
];

function ActionsCell({ database }: { database: Database }) {
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: async (data: DeleteDatabaseSchemaType) => {
      return await deleteDatabaseAction(data);
    },
    onSuccess: () => {
      toast.success("Base de données supprimée avec succès");
      router.refresh();
    },
    onError: (error) => {
      toast.error(
        error.message || "Une erreur est survenue lors de la suppression"
      );
    },
  });

  const handleForceBackup = () => {
    console.log("Forcer sauvegarde pour:", database.id);
  };

  const handleViewDetails = () => {
    console.log("Voir détails pour:", database.id);
  };

  const handleEdit = () => {
    console.log("Modifier:", database.id);
  };

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette base de données ?")) {
      deleteMutation.mutate({ id: database.id });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleForceBackup}>
          Forcer une sauvegarde
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewDetails}>
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>Modifier</DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="bg-destructive/10 text-destructive focus:bg-destructive/20 focus:text-destructive"
        >
          {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
