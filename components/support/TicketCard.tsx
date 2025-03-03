"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { File, User2, Building2, CalendarDays, Clock } from "lucide-react";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { SupportTicketDetails } from "@/types/support";
import { Roles } from "@/lib/roles";

interface TicketCardProps {
  ticket: SupportTicketDetails;
  onClick: (ticket: SupportTicketDetails) => void;
  userRole: string;
  userId: string;
}

export default function TicketCard({ 
  ticket, 
  onClick,
  userRole,
  userId
}: TicketCardProps) {

  const isAssignedSupport = ticket.supportUsers.some(su => su.user.id === userId);
  const canViewDetails = userRole === Roles.ADMIN || isAssignedSupport;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return "bg-yellow-100 hover:bg-yellow-50 text-yellow-800 border-yellow-200";
      case 'RESOLVED':
        return "bg-green-100 hover:bg-green-50 text-green-800 border-green-200";
      case 'RESCHEDULED':
        return "bg-blue-100 hover:bg-blue-50 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 hover:bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  const formatTime = (timeString: string) => {
    const time = parse(timeString, 'HH:mm', new Date());
    return format(time, 'h:mm a');
  };

  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-shadow duration-200",
        canViewDetails && "cursor-pointer"
      )}
      onClick={() => canViewDetails && onClick(ticket)}
    >
      <CardContent className="p-6">
        {/* Header with customer info and status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">{ticket.customerName}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Building2 className="w-4 h-4 mr-1" />
              {ticket.companyName}
            </div>
          </div>
          <Badge className={cn(getStatusColor(ticket.status))}>
            {ticket.status}
          </Badge>
        </div>

        {/* Meeting schedule information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm">
            <CalendarDays className="w-4 h-4 mr-2 text-gray-500" />
            { ticket.status === "RESCHEDULED" ?
              <div className="space-x-2">
                <span>
                  {format(new Date(ticket.rescheduledDate ?? ""), 'MMM dd, yyyy')}
                </span>
                <span className="px-1 py-0.5 font-bold text-xs rounded-md border border-blue-200 bg-blue-50 text-blue-800">R</span>
              </div>
              :
              format(new Date(ticket.meetDate), 'MMM dd, yyyy')
            } 
          </div>
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            { ticket.status === "RESCHEDULED" ? 
              <div className="space-x-2">
                <span>
                  {formatTime(ticket.rescheduledTime ?? "")} 
                </span>
                <span className="px-1 py-0.5 font-bold text-xs rounded-md border border-blue-200 bg-blue-50 text-blue-800">R</span>
              </div>
              : 
              formatTime(ticket.meetTime) 
            }
          </div>
        </div>

        {/* Footer with documents and support users */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm">
              <File className="w-4 h-4 mr-2 text-gray-500" />
              {ticket.documents.length} documents
            </div>
            <div className="flex items-center text-sm">
              <User2 className="w-4 h-4 mr-2 text-gray-500" />
              {ticket.supportUsers.length} assigned
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}