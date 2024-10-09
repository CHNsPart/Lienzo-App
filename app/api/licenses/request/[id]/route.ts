import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/auth";
import dayjs from 'dayjs';
import { LicenseRequest, Product } from "@prisma/client";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !(await isAdminOrManager(user))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { status, licenseKeys } = await req.json();

  try {
    const licenseRequest = await prisma.licenseRequest.findUnique({
      where: { id },
      include: { product: true, user: true }
    });

    if (!licenseRequest) {
      return NextResponse.json({ error: "License request not found" }, { status: 404 });
    }

    const updateData: {
      status: string;
      licenses?: {
        create: {
          key: string;
          productId: string;
          ownerId: string;
          duration: number;
          startDate: Date;
          expiryDate: Date;
        }[];
      };
    } = { status };

    if (status === 'ACTIVE') {
      if (!licenseKeys) {
        return NextResponse.json({ error: "License keys are required for active status" }, { status: 400 });
      }

      const keys = licenseKeys.split(',').map((key: string) => key.trim());
      
      if (keys.length !== licenseRequest.quantity) {
        return NextResponse.json({ 
          error: "Invalid number of license keys", 
          message: `Expected ${licenseRequest.quantity} keys, but received ${keys.length}.`
        }, { status: 400 });
      }

      const startDate = new Date();
      const expiryDate = dayjs(startDate).add(licenseRequest.duration, 'month').toDate();

      // Create licenses
      updateData.licenses = {
        create: keys.map((key: string) => ({
          key,
          productId: licenseRequest.productId,
          ownerId: licenseRequest.userId,
          duration: licenseRequest.duration,
          startDate,
          expiryDate
        }))
      };
    }

    // Update the license request
    const updatedRequest = await prisma.licenseRequest.update({
      where: { id },
      data: updateData,
    });

    // Fetch all license requests for this user, including expired ones
    const allUserRequests = await prisma.licenseRequest.findMany({
      where: { userId: licenseRequest.userId },
      include: { 
        user: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        product: true,
        licenses: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group requests by product
    const groupedRequests = allUserRequests.reduce((acc, request) => {
      if (!acc[request.productId]) {
        acc[request.productId] = {
          product: request.product,
          requests: []
        };
      }
      acc[request.productId].requests.push(request);
      return acc;
    }, {} as Record<string, { product: Product; requests: LicenseRequest[] }>);

    return NextResponse.json({
      updatedRequest,
      groupedRequests: Object.values(groupedRequests)
    });
  } catch (error) {
    console.error("Failed to update license request:", error);
    return NextResponse.json({ 
      error: "Failed to update license request",
      message: error instanceof Error ? error.message : "An unexpected error occurred."
    }, { status: 500 });
  }
}