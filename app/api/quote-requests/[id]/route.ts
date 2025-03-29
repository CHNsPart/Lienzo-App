// app/api/quote-requests/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { isAdmin } from "@/lib/auth";

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

    await prisma.quoteRequest.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Quote request deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete quote request:", error);
    return NextResponse.json({ 
      error: "Failed to delete quote request",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

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

    const quoteRequest = await prisma.quoteRequest.findUnique({
      where: { id },
    });

    if (!quoteRequest) {
      return NextResponse.json({ error: "Quote request not found" }, { status: 404 });
    }

    return NextResponse.json(quoteRequest, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch quote request:", error);
    return NextResponse.json({ 
      error: "Failed to fetch quote request",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}