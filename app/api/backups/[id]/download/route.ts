import prisma from "@/lib/prisma";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const backup = await prisma.backup.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        url: true,
        error: true,
      },
    });

    if (!backup) {
      return NextResponse.json(
        { error: "Backup introuvable" },
        { status: 404 }
      );
    }

    if (backup.error) {
      return NextResponse.json(
        { error: "Ce backup contient des erreurs et ne peut pas être téléchargé" },
        { status: 400 }
      );
    }

    if (!existsSync(backup.url)) {
      return NextResponse.json(
        { error: "Fichier de backup introuvable sur le serveur" },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(backup.url);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${backup.name}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement du backup:", error);
    return NextResponse.json(
      { error: "Erreur lors du téléchargement du backup" },
      { status: 500 }
    );
  }
}
