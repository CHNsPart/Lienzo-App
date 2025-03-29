// app/api/user-claims/route.ts

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Roles } from "@/lib/roles";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser || !kindeUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user from local database
    let dbUser = await prisma.user.findUnique({
      where: { id: kindeUser.id },
      select: { 
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    // If user doesn't exist and this is the admin email, create them
    if (!dbUser && kindeUser.email === 'imchn24@gmail.com') {
      dbUser = await prisma.user.create({
        data: {
          id: kindeUser.id,
          email: kindeUser.email,
          firstName: kindeUser.given_name || 'Admin',
          lastName: kindeUser.family_name || 'User',
          role: Roles.ADMIN
        },
        select: {
          id: true,
          email: true,
          firstName: true, 
          lastName: true,
          role: true
        }
      });
    } 
    // If user doesn't exist, create with USER role
    else if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: kindeUser.id,
          email: kindeUser.email || '',
          firstName: kindeUser.given_name || 'Unknown',
          lastName: kindeUser.family_name || 'User',
          role: Roles.USER
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true
        }
      });
    }

    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      role: dbUser.role
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}