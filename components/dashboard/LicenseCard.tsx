"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { License, Product } from "@prisma/client";
import { useToast } from '@/hooks/use-toast';

interface LicenseCardProps {
  license: License & { product: Product };
}

export default function LicenseCard({ license }: LicenseCardProps) {
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const { toast } = useToast();

  const toggleKeyVisibility = () => {
    setIsKeyVisible(!isKeyVisible);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(license.key).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "License key has been copied to your clipboard.",
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast({
        title: "Failed to copy",
        description: "Could not copy the license key. Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{license.product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">
          <span className="font-semibold">Status:</span>{" "}
          <span className={new Date(license.expiryDate) <= new Date() ? "text-red-500" : "text-green-500"}>
            {new Date(license.expiryDate) <= new Date() ? "Expired" : "Active"}
          </span>
        </p>
        <p className="mb-2">
          <span className="font-semibold">Key:</span>{" "}
          <span className="font-mono">
            {isKeyVisible ? license.key : license.key.substring(0, 5) + "..."}
          </span>
          <Button variant="outline" size="sm" className="ml-2" onClick={toggleKeyVisibility}>
            {isKeyVisible ? "Hide" : "Show"}
          </Button>
          <Button variant="outline" size="sm" className="ml-2" onClick={copyToClipboard}>
            Copy
          </Button>
        </p>
        <p className="mb-2">
          <span className="font-semibold">Start Date:</span>{" "}
          {new Date(license.startDate).toLocaleDateString()}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Expiry Date:</span>{" "}
          {new Date(license.expiryDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Duration:</span>{" "}
          {license.duration} months
        </p>
      </CardContent>
    </Card>
  );
}