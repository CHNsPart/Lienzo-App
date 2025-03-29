// app/api/quote-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { isAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phoneNumber, companyName, companySize, interests } = body;

    // Basic server-side validation
    if (!fullName || !email) {
      return NextResponse.json({ error: "Full name and email are required" }, { status: 400 });
    }

    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        fullName,
        email,
        phoneNumber,
        companyName,
        companySize,
        interests: interests.join(', '),
      },
    });

    return NextResponse.json(quoteRequest, { status: 201 });
  } catch (error) {
    console.error("Failed to create quote request:", error);
    return NextResponse.json({ 
      error: "Failed to create quote request",
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdmin(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quoteRequests = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(quoteRequests, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch quote requests:", error);
    return NextResponse.json({ 
      error: "Failed to fetch quote requests",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}