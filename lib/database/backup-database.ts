import { exec } from "child_process";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { join } from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const FILES_DIR = join(process.cwd(), "files");

export async function ensureFilesDirectory() {
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

  const pgDumpPath =
    process.env.PG_DUMP_PATH || "/opt/homebrew/opt/postgresql@17/bin/pg_dump";
  const command = `${pgDumpPath} -h ${host} -p ${port} -U ${username} -d ${database} -F c -f ${outputPath}`;

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

export type BackupDatabaseConfigType = {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type BackupResultType = {
  success: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
};

export async function backupDatabase(
  database: BackupDatabaseConfigType
): Promise<BackupResultType> {
  try {
    await ensureFilesDirectory();

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

    return { success: true, filePath, fileName };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
