// app/api/maintenance/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function GET(
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

    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
    });

    if (!maintenance) {
      return NextResponse.json({ error: "Maintenance request not found" }, { status: 404 });
    }

    return NextResponse.json(maintenance);
  } catch (error) {
    console.error("Failed to fetch maintenance request:", error);
    return NextResponse.json({ 
      error: "Failed to fetch maintenance request", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

export async function PUT(
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
    const body = await req.json();

    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: {
        status: body.status,
        // Add any other fields that admins should be able to update
      },
    });

    return NextResponse.json(maintenance);
  } catch (error) {
    console.error("Failed to update maintenance request:", error);
    return NextResponse.json({ 
      error: "Failed to update maintenance request", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

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

    await prisma.maintenance.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Maintenance request deleted successfully" });
  } catch (error) {
    console.error("Failed to delete maintenance request:", error);
    return NextResponse.json({ 
      error: "Failed to delete maintenance request", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}