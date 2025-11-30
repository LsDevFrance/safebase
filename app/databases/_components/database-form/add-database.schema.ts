import { z } from "zod";

export const AddDatabaseSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.enum(["mysql", "postgresql"]).refine((val) => val !== undefined, {
    message: "Le type de base de données est requis",
  }),
  host: z.string().min(1, "L'hôte est requis"),
  port: z
    .string()
    .min(1, "Le port est requis")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0 && Number.isInteger(num);
      },
      { message: "Le port doit être un nombre entier positif" }
    ),
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
  database: z.string().min(1, "Le nom de la base de données est requis"),
});

export type AddDatabaseSchemaType = z.infer<typeof AddDatabaseSchema>;

export const UpdateDatabaseSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  name: z.string().min(1, "Le nom est requis").optional(),
  type: z.enum(["mysql", "postgresql"]).optional(),
  host: z.string().min(1, "L'hôte est requis").optional(),
  port: z
    .string()
    .min(1, "Le port est requis")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0 && Number.isInteger(num);
      },
      { message: "Le port doit être un nombre entier positif" }
    )
    .optional(),
  username: z.string().min(1, "Le nom d'utilisateur est requis").optional(),
  password: z.string().min(1, "Le mot de passe est requis").optional(),
  database: z
    .string()
    .min(1, "Le nom de la base de données est requis")
    .optional(),
});

export type UpdateDatabaseSchemaType = z.infer<typeof UpdateDatabaseSchema>;

export const DeleteDatabaseSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
});

export type DeleteDatabaseSchemaType = z.infer<typeof DeleteDatabaseSchema>;
