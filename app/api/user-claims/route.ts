import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser || !kindeUser.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch user from local database
    const dbUser = await prisma.user.findUnique({
      where: { id: kindeUser.id },
      select: { 
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    if (!dbUser) {
      // If user doesn't exist in local DB, you might want to create one
      // For now, we'll just return an error
      return NextResponse.json({ error: "User not found in local database" }, { status: 404 });
    }

    console.log("___ROLE___", dbUser.role);
    console.log("___EMAIL___", dbUser.email);
    console.log("___USER___", dbUser);

    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      role: dbUser.role
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}