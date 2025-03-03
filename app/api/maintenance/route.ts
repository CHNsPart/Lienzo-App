// app/api/maintenance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, companyName, phoneNumber, companySize, needs, description } = body;

    // Basic validation
    if (!fullName || !email || !needs || !description) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const maintenance = await prisma.maintenance.create({
      data: {
        fullName,
        email,
        companyName,
        phoneNumber,
        companySize,
        needs: JSON.stringify(needs),
        description,
      },
    });

    return NextResponse.json(maintenance, { status: 201 });
  } catch (error) {
    console.error("Failed to create maintenance request:", error);
    return NextResponse.json({ 
      error: "Failed to create maintenance request",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !(await isAdmin(user))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const maintenanceRequests = await prisma.maintenance.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(maintenanceRequests);
  } catch (error) {
    console.error("Failed to fetch maintenance requests:", error);
    return NextResponse.json({ error: "Failed to fetch maintenance requests" }, { status: 500 });
  }
}