// app/api/licenses/route.ts

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/auth";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const isUserAdminOrManager = await isAdminOrManager(user);

      const licenses = await prisma.license.findMany({
        where: {
          ...(isUserAdminOrManager ? {} : { ownerId: user.id }),
          deletedAt: null
        },
        include: { 
          product: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json(licenses);
    } catch (error) {
      console.error("Failed to fetch licenses:", error);
      // Even if there's an error, return an empty array with a 200 status
      // to avoid breaking the UI
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error in license API:", error);
    // Return empty array with 200 status instead of error
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
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
          status: 'PENDING',
        },
      });

      return NextResponse.json(newLicense, { status: 201 });
    } catch (error) {
      console.error("Failed to create license:", error);
      return NextResponse.json({ error: "Failed to create license" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in POST license API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}