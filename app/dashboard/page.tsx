import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import HighlightedDetailsCard from "@/components/dashboard/HighlightedDetailsCard";

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser || !kindeUser.email) {
    redirect("/api/auth/login");
  }

  // Since we can't use the database, we'll use placeholder data
  const totalLicenses = 0;
  const activeLicenses = 0;
  const pendingRenewal = 0;
  const expiredLicenses = 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p>Welcome, {kindeUser.given_name || kindeUser.email}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <HighlightedDetailsCard title="Total Licenses" value={totalLicenses} />
        <HighlightedDetailsCard title="Active Licenses" value={activeLicenses} />
        <HighlightedDetailsCard title="Pending Renewal" value={pendingRenewal} />
        <HighlightedDetailsCard title="Expired" value={expiredLicenses} />
      </div>
      <h2 className="text-xl font-semibold mb-4">Your Licenses</h2>
      <p>License information is not available in this environment.</p>
    </div>
  );
}