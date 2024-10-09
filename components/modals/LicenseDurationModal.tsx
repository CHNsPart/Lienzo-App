// components/modals/LicenseDurationModal.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LicenseDurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (duration: number) => void;
  initialDuration: number | null;
}

export default function LicenseDurationModal({ isOpen, onClose, onSave, initialDuration }: LicenseDurationModalProps) {
  const [duration, setDuration] = useState(initialDuration || '');

  useEffect(() => {
    setDuration(initialDuration || '');
  }, [initialDuration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(Number(duration));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialDuration ? 'Edit' : 'Add'} License Duration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="duration">Duration (months)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              min="1"
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}