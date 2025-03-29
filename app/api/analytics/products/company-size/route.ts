// app/api/analytics/products/company-size/route.ts

import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/auth";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdminOrManager(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.licenseRequest.findMany({
      select: {
        companyName: true,
        quantity: true,
        product: {
          select: {
            name: true
          }
        }
      }
    });

    // If no requests found, return empty array
    if (!requests.length) {
      return NextResponse.json([]);
    }

    // Create a map for company analytics
    const companyMap = new Map<string, {
      companyName: string;
      totalLicenses: number;
      products: Set<string>;
    }>();

    // Process requests and aggregate data
    requests.forEach(request => {
      if (!request.companyName) return;

      const existingData = companyMap.get(request.companyName) || {
        companyName: request.companyName,
        totalLicenses: 0,
        products: new Set<string>()
      };

      existingData.totalLicenses += request.quantity;
      if (request.product?.name) {
        existingData.products.add(request.product.name);
      }

      companyMap.set(request.companyName, existingData);
    });

    // Convert to array and format data
    const formattedData = Array.from(companyMap.values())
      .map(company => ({
        name: company.companyName,
        size: 'medium', // Default size if not specified
        licenses: company.totalLicenses,
        products: company.products.size,
        score: (company.totalLicenses * 0.6) + (company.products.size * 0.4) // Weighted score
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Get top 8 companies

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching company analytics:', error);
    return NextResponse.json(
      { error: "Failed to fetch company analytics" },
      { status: 500 }
    );
  }
}