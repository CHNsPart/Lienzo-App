import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdmin(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Get document to delete associated files
    const document = await prisma.instructionDocument.findUnique({
      where: { id }
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Delete associated files
    const files = JSON.parse(document.files);
    for (const fileName of files) {
      try {
        await fs.unlink(path.join(process.cwd(), 'public/uploads', fileName));
      } catch (error) {
        console.error(`Failed to delete file ${fileName}:`, error);
      }
    }

    // Delete document from database
    await prisma.instructionDocument.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete instruction document:", error);
    return NextResponse.json(
      { error: "Failed to delete instruction document" },
      { status: 500 }
    );
  }
}