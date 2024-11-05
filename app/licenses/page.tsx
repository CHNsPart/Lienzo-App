import React from 'react'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import dynamic from 'next/dynamic';
import prisma from "@/lib/prisma";
import { License, Product, User } from "@prisma/client";

const LicenseCard = dynamic(() => import('@/components/dashboard/LicenseCard'), { ssr: false });

type LicenseWithProduct = License & { product: Product };

async function getUserLicenses(userId: string): Promise<LicenseWithProduct[]> {
  return prisma.license.findMany({
    where: { ownerId: userId },
    include: { product: true },
  });
}

export default async function LicensesPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return <div>Please log in to view your licenses.</div>;
  }

  const licenses = await getUserLicenses(user.id);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Your Licenses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {licenses.map((license) => (
          <LicenseCard key={license.id} license={license} />
        ))}
      </div>
    </div>
  )
}