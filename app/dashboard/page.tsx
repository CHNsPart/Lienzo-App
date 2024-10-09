import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import HighlightedDetailsCard from "@/components/dashboard/HighlightedDetailsCard";
/* import dynamic from 'next/dynamic'; */
import prisma from "@/lib/prisma";
/* import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types"; */
import { License, Product, User } from "@prisma/client";

/* const LicenseCard = dynamic(() => import('@/components/dashboard/LicenseCard'), { ssr: false }); */

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
  let licenses: LicenseWithProduct[] = [];
  try {
    // Sync user data
    user = await syncUser(kindeUser);

    if (user) {
      licenses = await prisma.license.findMany({
        where: { ownerId: user.id },
        include: { product: true },
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  const totalLicenses = licenses.length;
  const activeLicenses = licenses.filter(l => new Date(l.expiryDate) > new Date()).length;
  const pendingRenewal = licenses.filter(l => {
    const daysUntilExpiry = Math.ceil((new Date(l.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length;
  const expiredLicenses = licenses.filter(l => new Date(l.expiryDate) <= new Date()).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <HighlightedDetailsCard title="Total Licenses" value={totalLicenses} />
        <HighlightedDetailsCard title="Active Licenses" value={activeLicenses} />
        <HighlightedDetailsCard title="Pending Renewal" value={pendingRenewal} />
        <HighlightedDetailsCard title="Expired" value={expiredLicenses} />
      </div>
      <h2 className="text-xl font-semibold mb-4">Your Licenses</h2>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {licenses.map((license) => (
          <LicenseCard key={license.id} license={license} />
        ))}
      </div> */}
    </div>
  );
}