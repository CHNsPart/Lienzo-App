"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface DeleteProductModalProps {
  productId: string;
  productName: string;
}

export default function DeleteProductModal({ productId, productName }: DeleteProductModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/store/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete product");
      }

      toast({
        title: "Product deleted",
        description: `${productName} has been successfully deleted.`,
      });
      
      router.push("/store");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="icon"
        className="hover:bg-red-400"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="size-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription className="pt-4">
              Are you sure you want to delete <span className="font-medium text-foreground">{productName}</span>?
              <div className="mt-2 text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete the product
                and all of its associated data.
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}