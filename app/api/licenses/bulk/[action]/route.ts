// app/api/licenses/bulk/[action]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/auth";
import { LICENSE_STATUS } from "@/lib/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: { action: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { licenseIds } = await req.json();
    const { action } = params;
    const isAdmin = await isAdminOrManager(user);

    // For non-admin users, only allow export action
    if (!isAdmin && action !== 'export') {
      return NextResponse.json({ error: "Unauthorized for this action" }, { status: 403 });
    }

    // For non-admin users, verify they only access their own licenses
    if (!isAdmin) {
      const licenses = await prisma.license.findMany({
        where: { 
          id: { in: licenseIds },
          ownerId: user.id,
          deletedAt: null 
        }
      });

      if (licenses.length !== licenseIds.length) {
        return NextResponse.json({ error: "Unauthorized access to licenses" }, { status: 403 });
      }
    }

    const currentDate = new Date();

    switch (action) {
      case 'activate':
        await prisma.license.updateMany({
          where: { 
            id: { in: licenseIds },
            status: LICENSE_STATUS.PAYMENT_DONE,
            deletedAt: null
          },
          data: { 
            status: LICENSE_STATUS.ACTIVE,
            startDate: currentDate,
            expiryDate: new Date(currentDate.setMonth(currentDate.getMonth() + 12)) // Default to 12 months
          }
        });
        break;

      case 'delete':
        // Implement soft delete
        await prisma.license.updateMany({
          where: { 
            id: { in: licenseIds },
            deletedAt: null
          },
          data: { 
            deletedAt: currentDate,
          }
        });
        break;

      case 'export':
        const exportLicenses = await prisma.license.findMany({
          where: { 
            id: { in: licenseIds },
            ...(isAdmin ? {} : { ownerId: user.id }),
            deletedAt: null
          },
          include: {
            product: true,
            owner: {
              select: {
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        });

        const csv = generateCsv(exportLicenses);
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=licenses.csv'
          }
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    // Return updated licenses based on user role
    const updatedLicenses = await prisma.license.findMany({
      where: {
        ...(isAdmin ? {} : { ownerId: user.id }),
        deletedAt: null
      },
      include: { 
        product: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(updatedLicenses);
  } catch (error) {
    console.error('Bulk action error:', error);
    return NextResponse.json(
      { error: "Failed to perform bulk action", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

function generateCsv(licenses: any[]): string {
  const headers = [
    'License Key',
    'Product',
    'Owner Email',
    'Owner Name',
    'Status',
    'Version',
    'Start Date',
    'Expiry Date'
  ].join(',');

  const rows = licenses.map(license => [
    license.key,
    license.product.name,
    license.owner.email,
    `${license.owner.firstName} ${license.owner.lastName}`,
    license.status,
    license.version,
    new Date(license.startDate).toISOString(),
    new Date(license.expiryDate).toISOString()
  ].join(','));

  return [headers, ...rows].join('\n');
}