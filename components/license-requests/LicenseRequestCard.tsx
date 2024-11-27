"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { LicenseRequest, License, User, Product } from "@prisma/client";
import { CheckCircle2, Tag, Calendar, Building2, Hash, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LicenseRequestCardProps {
  request: LicenseRequest & { 
    user: User; 
    product: Product; 
    licenses?: License[] 
  };
  onUpdate: (updatedRequest: LicenseRequest & { user: User; product: Product }) => void;
}

const statusOptions = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'PAYMENT_DONE', label: 'Payment Done', color: 'bg-green-100 text-green-800' },
  { value: 'ACTIVE', label: 'Active', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'EXPIRED', label: 'Expired', color: 'bg-red-100 text-red-800' },
] as const;

type StatusType = typeof statusOptions[number]['value'];

export default function LicenseRequestCard({ request, onUpdate }: LicenseRequestCardProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<StatusType>(request.status as StatusType);
  const [licenseKeys, setLicenseKeys] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsActivated(request.status === 'ACTIVE');
  }, [request.status]);

  const getStatusBadge = (statusValue: string) => {
    const statusOption = statusOptions.find(opt => opt.value === statusValue);
    return (
      <Badge className={cn(statusOption?.color, "font-bold hover:bg-transparent")}>
        {statusOption?.label}
      </Badge>
    );
  };

  const updateRequestStatus = async () => {
    if (isActivated) return;
    setIsSubmitting(true);

    try {
      if (status === 'ACTIVE' && !licenseKeys.trim()) {
        throw new Error('License keys are required for activation');
      }

      const response = await fetch(`/api/licenses/request/${request.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          licenseKeys: status === 'ACTIVE' ? licenseKeys : undefined 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update request');
      }

      const { updatedRequest } = await response.json();
      onUpdate(updatedRequest);

      toast({
        title: "Status Updated",
        description: `Request status updated to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl">
            {request.user.firstName} {request.user.lastName}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {request.user.email}
          </div>
        </div>
        {getStatusBadge(request.status)}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Building2 className="h-4 w-4" />
              <span>Company:</span>
              <span className="font-medium text-gray-900">{request.companyName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Tag className="h-4 w-4" />
              <span>Product Version:</span>
              <span className="font-medium text-gray-900">{request.version}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Hash className="h-4 w-4" />
              <span>Quantity:</span>
              <span className="font-medium text-gray-900">{request.quantity}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Duration:</span>
              <span className="font-medium text-gray-900">{request.duration} months</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Requested:</span>
              <span className="font-medium text-gray-900">
                {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {request.message && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500 mb-1">Message:</p>
            <p className="text-sm">{request.message}</p>
          </div>
        )}

        {!isActivated && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={(value: StatusType) => setStatus(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={updateRequestStatus}
                disabled={isSubmitting}
                className="ml-2"
              >
                {isSubmitting ? 'Updating...' : 'Update Status'}
              </Button>
            </div>

            {status === 'ACTIVE' && (
              <div className="space-y-2">
                <Input
                  placeholder={`Enter ${request.quantity} license key(s), comma-separated`}
                  value={licenseKeys}
                  onChange={(e) => setLicenseKeys(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Enter exactly {request.quantity} license key(s), separated by commas
                </p>
              </div>
            )}
          </div>
        )}

        {isActivated && request.licenses && request.licenses.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm text-gray-900">Active Licenses</h4>
            <div className="space-y-2">
              {request.licenses.map((license: License) => (
                <div 
                  key={license.id} 
                  className="p-3 bg-gray-50 rounded-md flex items-center justify-between"
                >
                  <div>
                    <p className="font-mono text-sm">{license.key}</p>
                    <p className="text-xs text-gray-500">
                      Expires: {new Date(license.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">v{license.version}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}