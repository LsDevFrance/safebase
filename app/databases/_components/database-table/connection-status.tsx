"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { testConnectionAction } from "../../database.action";

type ConnectionStatusProps = {
  databaseId: string;
};

export function ConnectionStatus({ databaseId }: ConnectionStatusProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["database-connection", databaseId],
    queryFn: async () => {
      return await testConnectionAction(databaseId);
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (isLoading) {
    return (
      <Badge variant="outline" className="gap-1.5">
        <Loader2 className="h-3 w-3 animate-spin" />
        Vérification...
      </Badge>
    );
  }

  const isSuccess = data?.success ?? false;

  return (
    <Badge
      variant={isSuccess ? "default" : "destructive"}
      className={
        isSuccess
          ? "bg-green-600 hover:bg-green-600/90 text-white dark:bg-green-500 dark:hover:bg-green-500/90 gap-1.5"
          : "gap-1.5"
      }
    >
      {isSuccess ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      {isSuccess ? "Réussi" : "Échec"}
    </Badge>
  );
}

