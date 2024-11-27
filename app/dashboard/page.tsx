import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { License, LicenseRequest, Product, User } from "@prisma/client";
import { isAdminOrManager } from "@/lib/auth";
import { UserDashboard } from "@/components/dashboardViews/UserDashboard";
import { AdminDashboard } from "@/components/dashboardViews/AdminDashboard";
import { LicenseWithDetails } from "@/types/license-management";


type LicenseWithProduct = License & { product: Product };


async function syncUser(kindeUser: any): Promise<User | null> {
  const existingUser = await prisma.user.findUnique({
    where: { email: kindeUser.email },
  });

  if (!existingUser) {
    return prisma.user.create({
      data: {
        id: kindeUser.id,
        email: kindeUser.email || '',
        firstName: kindeUser.given_name || 'Unknown',
        lastName: kindeUser.family_name || 'User',
        role: 'USER',
      },
    });
  } else {
    return prisma.user.update({
      where: { email: kindeUser.email },
      data: {
        firstName: kindeUser.given_name || existingUser.firstName,
        lastName: kindeUser.family_name || existingUser.lastName,
      },
    });
  }
}

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser || !kindeUser.email) {
    redirect("/api/auth/login");
  }

  let user: User | null = null;
  let licenses: LicenseWithDetails[] = [];
  let licenseRequests: LicenseRequest[] = [];

  try {
    user = await syncUser(kindeUser);

    if (user) {
      licenses = await prisma.license.findMany({
        where: { 
          ownerId: user.id,
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
      });

      licenseRequests = await prisma.licenseRequest.findMany({
        where: {
          userId: user.id,
          status: 'PENDING'
        }
      });
    }
  } catch (error) {
      console.error('Error fetching data:', error);
  }

  const isAdminOrManagerUser = await isAdminOrManager(kindeUser);

  if (isAdminOrManagerUser) {
    return <AdminDashboard />;
  }

  return <UserDashboard licenses={licenses} licenseRequests={licenseRequests} />;
}