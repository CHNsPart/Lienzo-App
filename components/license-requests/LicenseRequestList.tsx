"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import LicenseRequestCard from './LicenseRequestCard';
import { LicenseRequest, Product, User } from "@prisma/client";

interface GroupedRequests {
  [productId: string]: {
    product: Product;
    users: {
      [userId: string]: {
        user: User;
        requests: LicenseRequest[];
      };
    };
  };
}

interface LicenseRequestListProps {
  licenseRequests: (LicenseRequest & { user: User; product: Product })[];
}

export default function LicenseRequestList({ licenseRequests }: LicenseRequestListProps) {
  const [groupedRequests, setGroupedRequests] = useState<GroupedRequests>({});
  const [openProducts, setOpenProducts] = useState<Set<string>>(new Set());
  const [openUsers, setOpenUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const grouped = licenseRequests.reduce<GroupedRequests>((acc, request) => {
      if (!acc[request.productId]) {
        acc[request.productId] = { product: request.product, users: {} };
      }
      if (!acc[request.productId].users[request.userId]) {
        acc[request.productId].users[request.userId] = { user: request.user, requests: [] };
      }
      acc[request.productId].users[request.userId].requests.push(request);
      return acc;
    }, {});
    setGroupedRequests(grouped);
  }, [licenseRequests]);

  const toggleProduct = (productId: string) => {
    setOpenProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleUser = (userId: string) => {
    setOpenUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const updateRequest = (updatedRequest: LicenseRequest & { user: User; product: Product }) => {
    setGroupedRequests(prev => {
      const newGrouped = { ...prev };
      const productGroup = newGrouped[updatedRequest.productId];
      if (productGroup) {
        const userGroup = productGroup.users[updatedRequest.userId];
        if (userGroup) {
          userGroup.requests = userGroup.requests.map(req =>
            req.id === updatedRequest.id ? updatedRequest : req
          );
        }
      }
      return newGrouped;
    });
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedRequests).map(([productId, { product, users }]) => (
        <Collapsible
          key={productId}
          open={openProducts.has(productId)}
          onOpenChange={() => toggleProduct(productId)}
        >
          <Card>
            <CardHeader>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex justify-between items-center">
                  <CardTitle>{product.name}</CardTitle>
                  {openProducts.has(productId) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(users).map(([userId, { user, requests }]) => (
                    <Collapsible
                      key={userId}
                      open={openUsers.has(userId)}
                      onOpenChange={() => toggleUser(userId)}
                    >
                      <Card>
                        <CardHeader>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full flex justify-between items-center">
                              <CardTitle>{`${user.firstName} ${user.lastName}`}</CardTitle>
                              {openUsers.has(userId) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                          </CollapsibleTrigger>
                        </CardHeader>
                        <CollapsibleContent>
                          <CardContent>
                            {requests.map(request => (
                              <LicenseRequestCard
                                key={request.id}
                                request={request as LicenseRequest & { user: User; product: Product }}
                                onUpdate={()=>updateRequest}
                              />
                            ))}
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}