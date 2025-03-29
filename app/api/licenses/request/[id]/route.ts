// app/api/licenses/request/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/auth";
import dayjs from 'dayjs';
import { LICENSE_STATUS } from "@/lib/constants";

interface RequestBody {
  status: string;
  licenseKeys: string;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdminOrManager(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { status, licenseKeys }: RequestBody = await req.json();

    const licenseRequest = await prisma.licenseRequest.findUnique({
      where: { id },
      include: { 
        product: true, 
        user: true,
        licenses: true
      }
    });

    if (!licenseRequest) {
      return NextResponse.json({ error: "License request not found" }, { status: 404 });
    }

    if (licenseRequest.licenses.length > 0 && status === LICENSE_STATUS.ACTIVE) {
      return NextResponse.json({ 
        error: "Licenses already exist for this request" 
      }, { status: 400 });
    }

    let updatedRequest;

    if (status === LICENSE_STATUS.ACTIVE) {
      if (!licenseKeys) {
        return NextResponse.json({ 
          error: "License keys are required for active status" 
        }, { status: 400 });
      }

      const keys: string[] = licenseKeys.split(',').map((key: string) => key.trim());
      
      if (keys.length !== licenseRequest.quantity) {
        return NextResponse.json({ 
          error: "Invalid number of license keys", 
          message: `Expected ${licenseRequest.quantity} keys, but received ${keys.length}.`
        }, { status: 400 });
      }

      updatedRequest = await prisma.$transaction(async (tx) => {
        const startDate = new Date();
        const expiryDate = dayjs(startDate).add(licenseRequest.duration, 'month').toDate();

        await Promise.all(keys.map((key: string) => 
          tx.license.create({
            data: {
              key,
              productId: licenseRequest.productId,
              ownerId: licenseRequest.userId,
              version: licenseRequest.version,
              duration: licenseRequest.duration,
              startDate,
              expiryDate,
              status,
              requestId: licenseRequest.id
            }
          })
        ));

        return tx.licenseRequest.update({
          where: { id },
          data: { status },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            product: true,
            licenses: {
              include: {
                product: true
              }
            }
          }
        });
      });
    } else {
      updatedRequest = await prisma.licenseRequest.update({
        where: { id },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          product: true,
          licenses: {
            include: {
              product: true
            }
          }
        }
      });
    }

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

    const groupedRequests = allUserRequests.reduce((acc: any, request) => {
      if (!acc[request.productId]) {
        acc[request.productId] = {
          product: request.product,
          requests: []
        };
      }
      acc[request.productId].requests.push(request);
      return acc;
    }, {});

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