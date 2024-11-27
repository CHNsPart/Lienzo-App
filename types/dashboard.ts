import { License, LicenseRequest, Product } from "@prisma/client";
import { LicenseWithDetails } from "./license-management";

export type LicenseWithProduct = License & { 
  product: Product 
};

export type ProductCategory = {
  product: Product;
  licenses: LicenseWithDetails[];
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
  pending: number;
  expiredLicenses: number;
}