"use client"

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Copy, CalendarDays, Clock } from "lucide-react";
import { License, Product } from "@prisma/client";
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LicenseCardProps {
  license: License & { product: Product };
}

export default function LicenseCard({ license }: LicenseCardProps) {
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const { toast } = useToast();

  const isExpired = new Date(license.expiryDate) <= new Date();
  const expiryDate = new Date(license.expiryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const startDate = new Date(license.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(license.key).then(() => {
      toast({
        title: "License key copied",
        description: "The key has been copied to your clipboard.",
      });
    }, (err) => {
      console.error('Copy failed:', err);
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive",
      });
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-6">
          <Badge 
            variant={isExpired ? "destructive" : "default"}
            className="px-2 py-1"
          >
            {isExpired ? "Expired" : "Active"}
          </Badge>
          <Badge 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            {license.duration} months
          </Badge>
        </div>

        <div className="space-y-4">
          {/* License Key Section */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500">License Key</span>
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
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy key</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
            <code className="text-sm font-mono">
              {isKeyVisible ? license.key : license.key.substring(0, 5) + "•".repeat(20)}
            </code>
          </div>

          {/* Dates Section */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays className="h-4 w-4" />
            <span>{startDate}</span>
            <span className="px-2">→</span>
            <span className={isExpired ? "text-red-500 font-medium" : ""}>
              {expiryDate}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}