// app/api/users/[userId]/role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { Roles } from "@/lib/roles";

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const currentUser = await getUser();

    if (!currentUser || !(await isAdmin(currentUser))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const { role } = await request.json();

    // Check if the role is valid
    if (!Object.values(Roles).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user role:", error);
    return NextResponse.json({ 
      error: "Failed to update user role", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}