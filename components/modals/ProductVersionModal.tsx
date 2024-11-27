"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (version: string) => void;
  initialVersion: string | null;
  productId: string;
}

export default function ProductVersionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialVersion,
  productId 
}: ProductVersionModalProps) {
  const [version, setVersion] = useState(initialVersion || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (version.trim()) {
      onSave(version.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialVersion ? 'Edit Version' : 'Add New Version'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="version">Version (e.g., 1.0.0)</Label>
            <Input
              id="version"
              type="text"
              pattern="^\d+\.\d+\.\d+$"
              title="Please use semantic versioning (e.g., 1.0.0)"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              required
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}