import { createConnection } from "mysql2/promise";
import { Client } from "pg";

type DatabaseConfig = {
  type: "mysql" | "postgresql";
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export async function testDatabaseConnection(
  config: DatabaseConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    if (config.type === "mysql") {
      const connection = await createConnection({
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
        database: config.database,
        connectTimeout: 5000,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      await connection.ping();
      await connection.end();

      return { success: true };
    } else if (config.type === "postgresql") {
      const client = new Client({
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
        database: config.database,
        connectionTimeoutMillis: 5000,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      await client.connect();
      await client.query("SELECT 1");
      await client.end();

      return { success: true };
    }

    return { success: false, error: "Type de base de données non supporté" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur de connexion",
    };
  }
}
