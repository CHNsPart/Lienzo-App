import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { productId, quantity, duration, message, companyName } = body;

  try {
    const licenseRequest = await prisma.licenseRequest.create({
      data: {
        userId: user.id,
        productId,
        quantity,
        duration,
        message,
        companyName,
        status: "PENDING",
      },
    });

    return NextResponse.json(licenseRequest, { status: 201 });
  } catch (error) {
    console.error("Failed to create license request:", error);
    return NextResponse.json({ error: "Failed to create license request" }, { status: 500 });
  }
}