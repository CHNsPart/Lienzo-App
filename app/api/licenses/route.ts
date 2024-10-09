import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const licenses = await prisma.license.findMany({
      where: { ownerId: user.id },
      include: { product: true },
    });

    return NextResponse.json(licenses);
  } catch (error) {
    console.error("Failed to fetch licenses:", error);
    return NextResponse.json({ error: "Failed to fetch licenses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    const newLicense = await prisma.license.create({
      data: {
        ...body,
        ownerId: user.id,
      },
    });

    return NextResponse.json(newLicense, { status: 201 });
  } catch (error) {
    console.error("Failed to create license:", error);
    return NextResponse.json({ error: "Failed to create license" }, { status: 500 });
  }
}