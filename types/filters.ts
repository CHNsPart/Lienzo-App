import { DateRange as CalendarDateRange } from "react-day-picker";

export interface FilterOption {
  label: string;
  value: string;
}

export interface LicenseFilters {
  search: string;
  status: string[];
  productId: string[];
  dateRange: CalendarDateRange | undefined;
}