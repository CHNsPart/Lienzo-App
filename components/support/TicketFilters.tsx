// components/support/TicketFilters.tsx
"use client";

import { SUPPORT_FILTERS } from "@/lib/constants/support";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TicketFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function TicketFilters({ 
  activeFilter, 
  onFilterChange 
}: TicketFiltersProps) {
  const filters = [
    { key: SUPPORT_FILTERS.ALL, label: 'All Tickets' },
    { key: SUPPORT_FILTERS.OPEN, label: 'Open' },
    { key: SUPPORT_FILTERS.RESOLVED, label: 'Resolved' },
    { key: SUPPORT_FILTERS.RESCHEDULED, label: 'Rescheduled' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <Badge
          key={filter.key}
          variant="outline"
          className={cn(
            "cursor-pointer hover:bg-lienzo/10 transition-colors duration-200",
            activeFilter === filter.key && "bg-lienzo/10 border-lienzo"
          )}
          onClick={() => onFilterChange(filter.key)}
        >
          {filter.label}
        </Badge>
      ))}
    </div>
  );
}