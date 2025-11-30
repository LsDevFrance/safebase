"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createDatabaseAction } from "../../database.action";
import {
  AddDatabaseSchema,
  type AddDatabaseSchemaType,
} from "./add-database.schema";

export function AddDatabaseForm() {
  const form = useForm<AddDatabaseSchemaType>({
    resolver: zodResolver(AddDatabaseSchema),
    defaultValues: {
      name: "",
      type: "postgresql",
      host: "",
      port: "5432",
      username: "",
      password: "",
      database: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: AddDatabaseSchemaType) => {
      return await createDatabaseAction(data);
    },
    onSuccess: () => {
      toast.success("Base de données créée avec succès");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue");
    },
  });

  const onSubmit = (data: AddDatabaseSchemaType) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 bg-card p-4 rounded-lg"
      >
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-semibold">Informations générales</h3>
            <p className="text-sm text-muted-foreground">
              Configurez les paramètres de base de votre connexion
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Ma base de données" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de base de données</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="postgresql">PostgreSQL</option>
                      <option value="mysql">MySQL</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-semibold">Paramètres de connexion</h3>
            <p className="text-sm text-muted-foreground">
              Informations nécessaires pour se connecter à la base de données
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_120px]">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hôte</FormLabel>
                    <FormControl>
                      <Input placeholder="localhost" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5432" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="database"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la base de données</FormLabel>
                  <FormControl>
                    <Input placeholder="mydb" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-semibold">Authentification</h3>
            <p className="text-sm text-muted-foreground">
              Identifiants pour accéder à la base de données
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input placeholder="postgres" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={mutation.isPending} size="lg">
            {mutation.isPending ? "Création..." : "Ajouter la base de données"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
