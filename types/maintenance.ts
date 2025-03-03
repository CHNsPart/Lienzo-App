// types/maintenance.ts
export interface MaintenanceQuote {
  id: string;
  fullName: string;
  companyName: string | null;
  email: string;
  phoneNumber: string | null;
  companySize: string | null;
  needs: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}