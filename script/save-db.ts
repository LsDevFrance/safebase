import { backupDatabase } from "@/lib/database/backup-database";
import prisma from "@/lib/prisma";

async function main() {
  try {
    console.log("Démarrage de la sauvegarde des bases de données...");

    const databases = await prisma.database.findMany();

    if (databases.length === 0) {
      console.log("Aucune base de données à sauvegarder.");
      return;
    }

    console.log(`Trouvé ${databases.length} base(s) de données à sauvegarder.`);

    const results = await Promise.allSettled(
      databases.map(async (database) => {
        console.log(`Sauvegarde de ${database.name}...`);
        const result = await backupDatabase(database);

        if (result.success) {
          await prisma.backup.create({
            data: {
              databaseId: database.id,
              name: result.fileName!,
              url: result.filePath!,
              error: false,
            },
          });
        } else {
          await prisma.backup.create({
            data: {
              databaseId: database.id,
              name: result.fileName || "backup-failed",
              url: result.filePath || "",
              error: true,
            },
          });
        }

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
