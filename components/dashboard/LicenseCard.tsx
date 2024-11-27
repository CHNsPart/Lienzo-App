// components/dashboard/LicenseCard.tsx

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Copy, CalendarDays, Clock, Tag, User, Box } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { LicenseWithDetails } from "@/types/license-management";
import { LICENSE_STATUS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LicenseCardProps {
  license: LicenseWithDetails;
  showOwner?: boolean;
}

const LicenseCard = ({ license, showOwner = false }: LicenseCardProps) => {
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const { toast } = useToast();
  
  // Only show license key actions if the license is active and not expired
  const isExpired = new Date(license.expiryDate) <= new Date();
  const canShowKey = license.status === LICENSE_STATUS.ACTIVE && !isExpired;

  // Style and text mapping for different statuses
  const getStatusBadge = (statusValue: string, isDeleted: boolean) => {
    if (isDeleted) return "bg-red-100 text-red-800";
    
    const statusStyles: Record<string, string> = {
      [LICENSE_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
      [LICENSE_STATUS.IN_PROGRESS]: "bg-blue-100 text-blue-800",
      [LICENSE_STATUS.PAYMENT_DONE]: "bg-green-100 text-green-800",
      [LICENSE_STATUS.ACTIVE]: "bg-gray-100 text-gray-800",
      [LICENSE_STATUS.EXPIRED]: "bg-red-100 text-red-800",
    };

    return statusStyles[statusValue] || "bg-gray-100 text-gray-800";
  };

  const copyToClipboard = async () => {
    if (!canShowKey) return;
    
    try {
      await navigator.clipboard.writeText(license.key);
      toast({
        title: "License key copied",
        description: "The key has been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Copy failed:', err);
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="pt-6">
        {/* Status and metadata section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge 
                className={cn(
                  getStatusBadge(license.status, !!license.deletedAt),
                  "font-bold hover:bg-transparent"
                )}
              >
                {license.deletedAt ? "DELETED" : license.status}
              </Badge>
            <Badge 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Box className="h-3 w-3" />
              {license.product.name}
            </Badge>
            </div>
            {/* Always show product name */}
            {showOwner && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1"
              >
                <User className="h-3 w-3" />
                {license.owner.firstName} {license.owner.lastName}
              </Badge>
            )}
          </div>
          <Badge 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            {license.duration} months
          </Badge>
        </div>

        {/* License key section */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg h-[72px] flex flex-col justify-center"> {/* Fixed height */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500">License Key</span>
              {canShowKey && (
                <TooltipProvider>
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => setIsKeyVisible(!isKeyVisible)}
                        >
                          {isKeyVisible ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isKeyVisible ? "Hide key" : "Show key"}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={copyToClipboard}
                          disabled={!canShowKey}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy key</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              )}
            </div>
            <code className="text-sm font-mono text-gray-600">
              {canShowKey 
                ? (isKeyVisible ? license.key : license.key.substring(0, 5) + "•".repeat(20))
                : "Available after activation"}
            </code>
          </div>

          {/* Dates and version section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays className="h-4 w-4" />
              <span>{new Date(license.startDate).toLocaleDateString()}</span>
              <span className="px-2">→</span>
              <span className={isExpired ? "text-red-500 font-medium" : ""}>
                {new Date(license.expiryDate).toLocaleDateString()}
              </span>
            </div>
            <Badge 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Tag className="h-3 w-3" />
              v{license.version}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LicenseCard;