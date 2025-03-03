"use client"

import { AnalyticsLayout, AnalyticsCard } from "@/components/analytics/AnalyticsLayout";
import { MostRequestedProducts } from "../analytics/product/MostRequestedProducts";
import { VersionAdoptionChart } from "../analytics/product/VersionAdoptionChart";
import { CompanyDistributionChart } from "../analytics/product/CompanyDistributionChart";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-[400px]">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

export function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      </div>
      
      <AnalyticsLayout>
        <AnalyticsCard 
          title="Most Requested Products"
          description="Top products by request volume"
          className="col-span-12"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <MostRequestedProducts />
          </Suspense>
        </AnalyticsCard>

        <AnalyticsCard 
          title="Company Distribution"
          description="Analysis of company engagement and product usage"
          className="col-span-4"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <CompanyDistributionChart />
          </Suspense>
        </AnalyticsCard>

        <AnalyticsCard 
          title="Version Adoption"
          description="Product version distribution across licenses"
          className="col-span-8"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <VersionAdoptionChart />
          </Suspense>
        </AnalyticsCard>

      </AnalyticsLayout>
    </div>
  );
}