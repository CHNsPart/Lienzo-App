import { License as PrismaLicense } from "@prisma/client";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  features: string;
  image: Buffer | null;
  durations: string;
}

export interface LicenseRequest {
  id: string;
  userId: string;
  user: User;
  productId: string;
  product: Product;
  quantity: number;
  duration: number;
  message: string | null;
  companyName: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  licenses?: License[];
}

// Re-export the License type from Prisma
export type License = PrismaLicense;