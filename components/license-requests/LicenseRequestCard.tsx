"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { LicenseRequest, License, User, Product } from "@prisma/client";
import { CheckCircle2 } from 'lucide-react';

interface LicenseRequestCardProps {
  request: LicenseRequest & { user: User; product: Product; licenses?: License[] };
  onUpdate: (updatedRequest: LicenseRequest & { user: User; product: Product }) => void;
}

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'PAYMENT_DONE', label: 'Payment Done' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'EXPIRED', label: 'Expired' },
] as const;

type StatusType = typeof statusOptions[number]['value'];

export default function LicenseRequestCard({ request, onUpdate }: LicenseRequestCardProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<StatusType>(request.status as StatusType);
  const [licenseKeys, setLicenseKeys] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);

  useEffect(() => {
    const activated = request.status === 'ACTIVE';
    setIsActivated(activated);
    console.log('Is Activated:', activated, 'Status:', request.status, 'Licenses:', request.licenses);
  }, [request]);

  const updateRequestStatus = async () => {
    if (isActivated) return; // Prevent updates for activated requests

    try {
      const response = await fetch(`/api/licenses/request/${request.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, licenseKeys: status === 'ACTIVE' ? licenseKeys : undefined }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update request');
      }

      const { updatedRequest } = await response.json();
      onUpdate(updatedRequest);

      toast({
        title: "Request Updated",
        description: `Request status updated to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{request.user.firstName} {request.user.lastName}</h3>
          <Badge>{request.status}</Badge>
        </div>
        <p>Email: {request.user.email}</p>
        <p>Product: {request.product.name}</p>
        <p>Quantity: {request.quantity}</p>
        <p>Duration: {request.duration} months</p>
        <p>Company: {request.companyName}</p>
        {request.message && <p>Message: {request.message}</p>}
        <p>Requested on: {new Date(request.createdAt).toLocaleDateString()}</p>
        
        {!isActivated && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
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
                size="icon" 
                variant="outline" 
                className="rounded-full" 
                onClick={updateRequestStatus}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
            
            {status === 'ACTIVE' && (
              <Input 
                type="text" 
                placeholder={`${request.quantity} License Key(s) (comma-separated)`}
                value={licenseKeys}
                onChange={(e) => setLicenseKeys(e.target.value)}
              />
            )}
          </div>
        )}

        {isActivated && request.licenses && request.licenses.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Activated Licenses:</h4>
            {request.licenses.map((license: License) => (
              <p key={license.id}>Key: {license.key} (Expires: {new Date(license.expiryDate).toLocaleDateString()})</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}