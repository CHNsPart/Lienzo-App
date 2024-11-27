"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface LicenseFiltersProps {
  products: { id: string; name: string }[];
  onFilterChange: (filters: any) => void;
}

export function LicenseFilters({ products, onFilterChange }: LicenseFiltersProps) {
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();


  const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
    { label: "Expired", value: "EXPIRED" },
    { label: "Pending", value: "PENDING" },
  ];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    applyFilters({ search: value });
  };

  const toggleStatus = (status: string) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(updated);
    applyFilters({ status: updated });
  };

  const toggleProduct = (productId: string) => {
    const updated = selectedProducts.includes(productId)
      ? selectedProducts.filter((p) => p !== productId)
      : [...selectedProducts, productId];
    setSelectedProducts(updated);
    applyFilters({ productId: updated });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    applyFilters({ dateRange: range });
  };

  const applyFilters = (updates: Partial<any>) => {
    onFilterChange({
      search,
      status: selectedStatuses,
      productId: selectedProducts,
      dateRange,
      ...updates,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedStatuses([]);
    setSelectedProducts([]);
    setDateRange(undefined);
    onFilterChange({
      search: "",
      status: [],
      productId: [],
      dateRange: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search licenses..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-xs"
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                "Date Range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          onClick={clearFilters}
          className="text-red-500 hover:text-red-700"
        >
          Clear Filters
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <Badge
            key={status.value}
            variant={selectedStatuses.includes(status.value) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleStatus(status.value)}
          >
            {status.label}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {products.map((product) => (
          <Badge
            key={product.id}
            variant={selectedProducts.includes(product.id) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleProduct(product.id)}
          >
            {product.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}