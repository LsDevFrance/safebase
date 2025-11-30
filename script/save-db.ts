import prisma from "@/lib/prisma";
import { exec } from "child_process";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { join } from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const FILES_DIR = join(process.cwd(), "files");

async function ensureFilesDirectory() {
  if (!existsSync(FILES_DIR)) {
    await mkdir(FILES_DIR, { recursive: true });
  }
}

async function dumpPostgreSQL(
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
  outputPath: string
): Promise<void> {
  const env = {
    ...process.env,
    PGPASSWORD: password,
  };

  const command = `pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -F c -f ${outputPath}`;

  await execAsync(command, { env });
}

async function dumpMySQL(
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
  outputPath: string
): Promise<void> {
  const command = `mysqldump -h ${host} -P ${port} -u ${username} -p${password} ${database} > ${outputPath}`;

  await execAsync(command);
}

async function saveDatabase(database: {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${database.name}-${timestamp}.dump`;
    const filePath = join(FILES_DIR, fileName);

    if (database.type === "postgresql") {
      await dumpPostgreSQL(
        database.host,
        database.port,
        database.username,
        database.password,
        database.database,
        filePath
      );
    } else if (database.type === "mysql") {
      await dumpMySQL(
        database.host,
        database.port,
        database.username,
        database.password,
        database.database,
        filePath
      );
    } else {
      return {
        success: false,
        error: `Type de base de données non supporté: ${database.type}`,
      };
    }

    return { success: true, filePath };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

async function main() {
  try {
    console.log("Démarrage de la sauvegarde des bases de données...");

    await ensureFilesDirectory();

    const databases = await prisma.database.findMany();

    if (databases.length === 0) {
      console.log("Aucune base de données à sauvegarder.");
      return;
    }

    console.log(`Trouvé ${databases.length} base(s) de données à sauvegarder.`);

    const results = await Promise.allSettled(
      databases.map(async (database) => {
        console.log(`Sauvegarde de ${database.name}...`);
        const result = await saveDatabase(database);
        return { database, result };
      })
    );

    let successCount = 0;
    let errorCount = 0;

    for (const outcome of results) {
      if (outcome.status === "fulfilled") {
        const { database, result } = outcome.value;
        if (result.success) {
          console.log(
            `✓ ${database.name} sauvegardée avec succès: ${result.filePath}`
          );
          successCount++;
        } else {
          console.error(
            `✗ Erreur lors de la sauvegarde de ${database.name}: ${result.error}`
          );
          errorCount++;
        }
      } else {
        console.error(`✗ Erreur lors de la sauvegarde: ${outcome.reason}`);
        errorCount++;
      }
    }

    console.log("\n=== Résumé ===");
    console.log(`Succès: ${successCount}`);
    console.log(`Erreurs: ${errorCount}`);
    console.log(`Total: ${databases.length}`);
  } catch (error) {
    console.error("Erreur fatale:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
