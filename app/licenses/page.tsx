// app/licenses/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkActionBar } from '@/components/license-management/BulkActionBar';
import { LicenseFilters } from '@/components/license-management/LicenseFilters';
import { useToast } from "@/hooks/use-toast";
import LicenseCard from '@/components/dashboard/LicenseCard';
import { LicenseWithDetails, BulkAction, SelectedLicenses } from '@/types/license-management';
import { Role, Roles } from '@/lib/roles';
import { Product } from "@prisma/client";
import { LicenseFilters as FilterTypes } from '@/types/filters';
import { LICENSE_STATUS } from '@/lib/constants';

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<LicenseWithDetails[]>([]);
  const [filteredLicenses, setFilteredLicenses] = useState<LicenseWithDetails[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<SelectedLicenses>({});
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [userRole, setUserRole] = useState<Role>(Roles.USER);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/user-claims');
        const data = await response.json();
        setUserRole(data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
    fetchProducts();
    fetchLicenses();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/store');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    }
  };

  const fetchLicenses = async () => {
    try {
      const response = await fetch('/api/licenses');
      if (!response.ok) throw new Error('Failed to fetch licenses');
      const data = await response.json();
      setLicenses(data);
      setFilteredLicenses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch licenses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters: FilterTypes) => {
    let filtered = [...licenses];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(license => 
        license.key.toLowerCase().includes(searchTerm) ||
        license.product.name.toLowerCase().includes(searchTerm) ||
        license.owner.firstName.toLowerCase().includes(searchTerm) ||
        license.owner.lastName.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(license => 
        filters.status.includes(license.status)
      );
    }

    // Apply product filter
    if (filters.productId.length > 0) {
      filtered = filtered.filter(license => 
        filters.productId.includes(license.productId)
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      filtered = filtered.filter(license => {
        const licenseDate = new Date(license.createdAt);
        const fromDate = filters.dateRange?.from;
        const toDate = filters.dateRange?.to;
    
        if (fromDate && toDate) {
          return licenseDate >= fromDate && licenseDate <= toDate;
        } else if (fromDate) {
          return licenseDate >= fromDate;
        } else if (toDate) {
          return licenseDate <= toDate;
        }
        return true;
      });
    }

    setFilteredLicenses(filtered);
    setSelectedLicenses({});
  };

  const handleSelectLicense = (licenseId: string, checked: boolean) => {
    setSelectedLicenses(prev => ({
      ...prev,
      [licenseId]: checked
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = filteredLicenses.reduce((acc, license) => {
      acc[license.id] = checked;
      return acc;
    }, {} as SelectedLicenses);
    setSelectedLicenses(newSelected);
  };

  const handleBulkAction = async (action: BulkAction) => {
    setIsLoading(true);
    const selectedIds = Object.entries(selectedLicenses)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);

    try {
      const response = await fetch(`/api/licenses/bulk/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseIds: selectedIds })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to perform bulk action');
      }

      if (action === 'export') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'licenses-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const updatedLicenses = await response.json();
        setLicenses(updatedLicenses);
        setFilteredLicenses(updatedLicenses);
      }

      toast({
        title: "Success",
        description: `${action.charAt(0).toUpperCase() + action.slice(1)} completed successfully`,
      });
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to perform bulk action",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedLicenses({});
    }
  };

  const selectedCount = Object.values(selectedLicenses).filter(Boolean).length;
  const selectedLicenseStatuses = Object.entries(selectedLicenses)
    .filter(([_, isSelected]) => isSelected)
    .map(([id]) => {
      const license = licenses.find(l => l.id === id);
      return license ? license.status : '';
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">License Management</h2>
      
      <LicenseFilters
        products={products}
        onFilterChange={handleFilterChange}
      />

      <BulkActionBar
        selectedCount={selectedCount}
        selectedStatuses={selectedLicenseStatuses}
        onAction={handleBulkAction}
        userRole={userRole}
        disabled={isLoading}
      />

      <div className="flex items-center mb-4">
        <Checkbox
          id="selectAll"
          checked={selectedCount === filteredLicenses.length && filteredLicenses.length > 0}
          onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
        />
        <label htmlFor="selectAll" className="ml-2 text-sm">
          Select All ({filteredLicenses.length} items)
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredLicenses.map((license) => (
          <Card key={license.id} className="relative">
            <div className="absolute top-4 left-4 z-10">
              <Checkbox
                checked={selectedLicenses[license.id] || false}
                onCheckedChange={(checked: boolean) => 
                  handleSelectLicense(license.id, checked)
                }
              />
            </div>
            <div className="pl-12">
              <LicenseCard 
                license={license} 
                showOwner={userRole === Roles.ADMIN || userRole === Roles.MANAGER} 
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}