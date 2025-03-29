// app/api/licenses/request/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity, duration, version, message, companyName } = body;

    // Validate version exists in product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productVersions = JSON.parse(product.versions);
    if (!productVersions.includes(version)) {
      return NextResponse.json({ 
        error: "Invalid version selected" 
      }, { status: 400 });
    }

    const licenseRequest = await prisma.licenseRequest.create({
      data: {
        userId: user.id,
        productId,
        quantity,
        duration,
        version,
        message,
        companyName,
        status: "PENDING",
      },
    });

    return NextResponse.json(licenseRequest, { status: 201 });
  } catch (error) {
    console.error("Failed to create license request:", error);
    return NextResponse.json({ 
      error: "Failed to create license request",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}