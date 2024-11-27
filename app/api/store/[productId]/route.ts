import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdmin(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        licenses: { select: { id: true }, take: 1 },
        licenseRequests: { select: { id: true }, take: 1 }
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.licenses.length > 0 || product.licenseRequests.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete product with existing licenses or requests" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}