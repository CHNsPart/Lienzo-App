import { License, Product } from "@prisma/client";

export type LicenseWithProduct = License & { 
  product: Product 
};

export type ProductCategory = {
  product: Product;
  licenses: LicenseWithProduct[];
  count: number;
};

export type CategoryMap = {
  [key: string]: ProductCategory;
};

export interface CategoryCardProps {
  category: ProductCategory;
  isSelected: boolean;
  onClick: () => void;
}

export interface DashboardStats {
  totalLicenses: number;
  activeLicenses: number;
  pendingRenewal: number;
  expiredLicenses: number;
}