// app/api/instructions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants/support";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdmin(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await prisma.instructionDocument.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Failed to fetch instruction documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch instruction documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdmin(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const files = formData.getAll('files') as File[];

    if (!title || files.length === 0) {
      return NextResponse.json(
        { error: "Title and at least one file are required" },
        { status: 400 }
      );
    }

    // Validate files
    for (const file of files) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Only PDF files are allowed" },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "File size should not exceed 5MB" },
          { status: 400 }
        );
      }
    }

    // Process and store files
    const fileNames: string[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const fileName = `${Date.now()}-${file.name}`;
      // Store in public/uploads directory
      const fs = require('fs/promises');
      await fs.writeFile(`public/uploads/${fileName}`, buffer);
      fileNames.push(fileName);
    }

    const document = await prisma.instructionDocument.create({
      data: {
        title,
        files: JSON.stringify(fileNames)
      }
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Failed to create instruction document:", error);
    return NextResponse.json(
      { error: "Failed to create instruction document" },
      { status: 500 }
    );
  }
}