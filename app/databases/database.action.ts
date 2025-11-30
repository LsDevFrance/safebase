"use server";

import { testDatabaseConnection } from "@/lib/database/test-connection";
import prisma from "@/lib/prisma";
import type {
  AddDatabaseSchemaType,
  DeleteDatabaseSchemaType,
  UpdateDatabaseSchemaType,
} from "./_components/database-form/add-database.schema";
import {
  AddDatabaseSchema,
  DeleteDatabaseSchema,
  UpdateDatabaseSchema,
} from "./_components/database-form/add-database.schema";

export async function createDatabaseAction(
  data: AddDatabaseSchemaType
): Promise<{ success: true }> {
  const validatedData = AddDatabaseSchema.parse(data);

  await prisma.database.create({
    data: {
      name: validatedData.name,
      type: validatedData.type,
      host: validatedData.host,
      port: Number(validatedData.port),
      username: validatedData.username,
      password: validatedData.password,
      database: validatedData.database,
    },
  });

  return { success: true };
}

export async function updateDatabaseAction(
  data: UpdateDatabaseSchemaType
): Promise<{ success: true }> {
  const validatedData = UpdateDatabaseSchema.parse(data);
  const { id, ...updateData } = validatedData;

  const database = await prisma.database.findUnique({
    where: {
      id,
    },
  });

  if (!database) {
    throw new Error("La base de données n'existe pas");
  }

  const dataToUpdate: {
    name?: string;
    type?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
  } = {};

  if (updateData.name !== undefined) {
    dataToUpdate.name = updateData.name;
  }
  if (updateData.type !== undefined) {
    dataToUpdate.type = updateData.type;
  }
  if (updateData.host !== undefined) {
    dataToUpdate.host = updateData.host;
  }
  if (updateData.port !== undefined) {
    dataToUpdate.port = Number(updateData.port);
  }
  if (updateData.username !== undefined) {
    dataToUpdate.username = updateData.username;
  }
  if (updateData.password !== undefined) {
    dataToUpdate.password = updateData.password;
  }
  if (updateData.database !== undefined) {
    dataToUpdate.database = updateData.database;
  }

  await prisma.database.update({
    where: {
      id,
    },
    data: dataToUpdate,
  });

  return { success: true };
}

export async function deleteDatabaseAction(
  data: DeleteDatabaseSchemaType
): Promise<{ success: true }> {
  const validatedData = DeleteDatabaseSchema.parse(data);

  const database = await prisma.database.findUnique({
    where: {
      id: validatedData.id,
    },
  });

  if (!database) {
    throw new Error("La base de données n'existe pas");
  }

  await prisma.database.delete({
    where: {
      id: validatedData.id,
    },
  });

  return { success: true };
}

export async function testConnectionAction(
  databaseId: string
): Promise<{ success: boolean; error?: string }> {
  const database = await prisma.database.findUnique({
    where: {
      id: databaseId,
    },
  });

  if (!database) {
    return { success: false, error: "Base de données non trouvée" };
  }

  return await testDatabaseConnection({
    type: database.type as "mysql" | "postgresql",
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.database,
  });
}
