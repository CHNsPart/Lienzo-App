// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  console.log("Fetching users");
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      console.log("No authenticated user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdminUser = await isAdmin(user);
    console.log("Is admin user:", isAdminUser);

    if (!isAdminUser) {
      console.log("User is not an admin");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        newUser: true,
        phoneNumber: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            licenseRequests: true,
            licenses: true,
            permissions: true,
          }
        }
      },
    });

    console.log("Fetched users count:", users.length);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}