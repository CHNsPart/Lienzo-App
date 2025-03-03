import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/auth";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !(await isAdminOrManager(user))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const productRequests = await prisma.licenseRequest.groupBy({
      by: ['productId'],
      _count: {
        _all: true
      }
    });

    const productsWithNames = await Promise.all(
      productRequests.map(async (request) => {
        const product = await prisma.product.findUnique({
          where: { id: request.productId },
          select: { name: true }
        });

        return {
          productId: request.productId,
          productName: product?.name || 'Unknown Product',
          requestCount: request._count._all
        };
      })
    );

    const sortedData = productsWithNames.sort((a, b) => b.requestCount - a.requestCount);

    return NextResponse.json(sortedData);
  } catch (error) {
    console.error('Error fetching most requested products:', error);
    return NextResponse.json(
      { error: "Failed to fetch product analytics" },
      { status: 500 }
    );
  }
}