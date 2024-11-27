import { LICENSE_STATUS } from '@/lib/constants';
import { License, Product } from "@prisma/client";
import { ReactNode } from 'react';

export type LicenseStatus = typeof LICENSE_STATUS[keyof typeof LICENSE_STATUS];

export interface LicenseOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type LicenseWithDetails = License & {
  product: Product;
  owner: LicenseOwner;
};

export type BulkAction = 'activate' | 'delete' | 'export';

export interface BulkActionOption {
  value: BulkAction;
  label: string;
  variant?: 'default' | 'destructive';
  requiresAdmin?: boolean;
  allowedStates?: LicenseStatus[];
  icon?: ReactNode;
}

export type SelectedLicenses = {
  [key: string]: boolean;
};