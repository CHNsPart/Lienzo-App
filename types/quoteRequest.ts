export interface QuoteRequest {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  companyName: string | null;
  companySize: string | null;
  interests: string | null;
  createdAt: string;
  updatedAt: string;
}