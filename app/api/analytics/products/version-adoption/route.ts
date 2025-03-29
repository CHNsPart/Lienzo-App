// app/api/analytics/products/version-adoption/route.ts

import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/auth";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdminOrManager(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all active licenses with product information
    const licenses = await prisma.license.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null
      },
      include: {
        product: {
          select: {
            name: true
          }
        }
      }
    });

    // If no licenses found, return empty array
    if (!licenses.length) {
      return NextResponse.json([]);
    }

    // Create a map to count versions per product
    const versionMap = new Map<string, number>();
    const productNameMap = new Map<string, string>();

    licenses.forEach(license => {
      const key = `${license.product.name}-${license.version}`;
      versionMap.set(key, (versionMap.get(key) || 0) + 1);
      productNameMap.set(key, license.product.name);
    });

    // Convert to array and sort by count
    const formattedData = Array.from(versionMap.entries()).map(([key, count]) => {
      const [, version] = key.split('-');
      const productName = productNameMap.get(key) || 'Unknown Product';
      return {
        productName,
        version,
        displayName: `${productName} v${version}`,
        count,
      };
    }).sort((a, b) => b.count - a.count);

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching version adoption:', error);
    return NextResponse.json(
      { error: "Failed to fetch version adoption analytics" },
      { status: 500 }
    );
  }
}