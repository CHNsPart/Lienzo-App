"use client";

import { useState, useMemo } from 'react';
import { ProductCategory, CategoryMap, DashboardStats, } from "@/types/dashboard";
import { LicenseWithDetails } from "@/types/license-management";
import HighlightedDetailsCard from "@/components/dashboard/HighlightedDetailsCard";
import dynamic from 'next/dynamic';
import CategoryCard from "@/components/dashboard/CategoryCard";
import { motion, AnimatePresence } from "framer-motion";
import { LICENSE_STATUS } from '@/lib/constants';
import { LicenseRequest } from '@prisma/client';

const LicenseCard = dynamic(() => import('@/components/dashboard/LicenseCard'), { ssr: false });

interface UserDashboardProps {
  licenses: LicenseWithDetails[];
  licenseRequests?: LicenseRequest[];
}

export function UserDashboard({ licenses, licenseRequests = [] }: UserDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const stats = useMemo<DashboardStats>(() => ({
    totalLicenses: licenses.length,
    activeLicenses: licenses.filter(l => 
      l.status === LICENSE_STATUS.ACTIVE && 
      new Date(l.expiryDate) > new Date()
    ).length,
    pending: licenseRequests.filter(r => r.status === LICENSE_STATUS.PENDING).length,
    expiredLicenses: licenses.filter(l => 
      l.status === LICENSE_STATUS.EXPIRED || 
      (l.status === LICENSE_STATUS.ACTIVE && new Date(l.expiryDate) <= new Date())
    ).length,
  }), [licenses, licenseRequests]);

  const categories = useMemo(() => {
    return licenses.reduce((acc: CategoryMap, license: LicenseWithDetails) => {
      const productId = license.product.id;
      if (!acc[productId]) {
        acc[productId] = {
          product: license.product,
          licenses: [],
          count: 0
        };
      }
      acc[productId].licenses.push(license);
      acc[productId].count += 1;
      return acc;
    }, {});
  }, [licenses]);

  const selectedLicenses = selectedCategory ? categories[selectedCategory].licenses : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <HighlightedDetailsCard title="Total Licenses" value={stats.totalLicenses} />
        <HighlightedDetailsCard title="Active Licenses" value={stats.activeLicenses} />
        <HighlightedDetailsCard title="Pending" value={stats.pending} />
        <HighlightedDetailsCard title="Expired" value={stats.expiredLicenses} />
      </div>

      {/* Product Categories */}
      <h2 className="text-xl font-semibold mb-4">Product Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(categories).map(([productId, category]) => (
          <CategoryCard
            key={productId}
            category={category}
            isSelected={selectedCategory === productId}
            onClick={() => setSelectedCategory(selectedCategory === productId ? null : productId)}
          />
        ))}
      </div>

      {/* Selected Category Licenses */}
      <AnimatePresence mode="wait">
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {categories[selectedCategory].product.name} Licenses
              </h2>
              <span className="text-sm text-gray-500">
                Showing {selectedLicenses.length} licenses
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedLicenses.map((license) => (
                <LicenseCard key={license.id} license={license} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}