import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/auth";
import LicenseRequestList from "@/components/license-requests/LicenseRequestList";

export default async function LicenseRequestsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !(await isAdminOrManager(user))) {
    redirect("/dashboard");
  }

  const licenseRequests = await prisma.licenseRequest.findMany({
    include: { 
      user: { select: { firstName: true, lastName: true, email: true } },
      product: true 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">License Requests</h1>
      <LicenseRequestList licenseRequests={licenseRequests} />
    </div>
  );
}