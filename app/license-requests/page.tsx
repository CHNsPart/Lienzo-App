// app/license-requests/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/auth";
import LicenseRequestList from "@/components/license-requests/LicenseRequestList";

export default async function LicenseRequestsPage() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdminOrManager(user))) {
      redirect("/dashboard");
    }

    const licenseRequests = await prisma.licenseRequest.findMany({
      include: { 
        user: true,
        product: true 
      },
      orderBy: { createdAt: 'desc' }
    });

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">License Requests</h1>
        
        {licenseRequests.length > 0 ? (
          <LicenseRequestList licenseRequests={licenseRequests} />
        ) : (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
            <p className="text-gray-600">No license requests found.</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching license requests:", error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">License Requests</h1>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-500">Error loading license requests. Please try again later.</p>
        </div>
      </div>
    );
  }
}