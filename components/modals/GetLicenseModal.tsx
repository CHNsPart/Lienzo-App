"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface GetLicenseModalProps {
  productId: string;
}

interface Product {
  id: string;
  versions: string;
  durations: string;
}

export default function GetLicenseModal({ productId }: GetLicenseModalProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [versions, setVersions] = useState<string[]>([]);
  const [durations, setDurations] = useState<number[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      // Fetch product details including versions and durations
      fetch(`/api/store`)
        .then(response => response.json())
        .then(products => {
          const product = products.find((p: Product) => p.id === productId);
          if (product) {
            // Parse versions
            const productVersions = JSON.parse(product.versions);
            setVersions(productVersions);
            if (productVersions.length > 0) {
              setSelectedVersion(productVersions[productVersions.length - 1]);
            }

            // Parse durations
            const productDurations = JSON.parse(product.durations);
            setDurations(productDurations);
            if (productDurations.length > 0) {
              setDuration(productDurations[0].toString());
            }
          }
        })
        .catch(error => {
          console.error('Error fetching product details:', error);
          toast({
            title: "Error",
            description: "Failed to load product details",
            variant: "destructive",
          });
        });
    }
  }, [open, productId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVersion) {
      toast({
        title: "Error",
        description: "Please select a product version",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/licenses/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
          duration: parseInt(duration),
          version: selectedVersion,
          message,
          companyName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit license request');
      }

      toast({
        title: "Success",
        description: "Your license request has been submitted successfully.",
      });
      setOpen(false);
      router.push("/dashboard");
    } catch (error) {
      console.error('License request error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit license request",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Get License</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request License</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((months) => (
                  <SelectItem key={months} value={months.toString()}>
                    {months} months
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="version">Version</Label>
            <Select 
              value={selectedVersion} 
              onValueChange={setSelectedVersion}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                {versions.map((version) => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!selectedVersion || !duration || !companyName}
          >
            Submit Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}