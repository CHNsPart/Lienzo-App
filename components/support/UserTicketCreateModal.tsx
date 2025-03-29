"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TIME_SLOTS } from "@/lib/constants/support";

interface UserTicketCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: () => void;
  userData: {
    firstName: string;
    lastName: string;
  } | null;
}

export default function UserTicketCreateModal({
  isOpen,
  onClose,
  onTicketCreated,
  userData
}: UserTicketCreateModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [meetDate, setMeetDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [meetTime, setMeetTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  // Generate customer name from user data
  const customerName = userData ? `${userData.firstName} ${userData.lastName}` : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meetDate || !meetTime || !companyName || !companyAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(meetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast({
        title: "Invalid Date",
        description: "Please select a future date",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          companyName,
          companyAddress,
          meetDate: new Date(meetDate),
          meetTime,
          // Note: documentIds and supportUserIds are not included as they will be handled by the API
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create ticket');
      }
      
      toast({
        title: "Success",
        description: "Your support request has been submitted successfully",
      });
      
      // Reset form
      setCompanyName('');
      setCompanyAddress('');
      setMeetDate(format(new Date(), 'yyyy-MM-dd'));
      setMeetTime('');
      
      onTicketCreated();
      onClose();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create ticket",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Support Meeting</DialogTitle>
          <DialogDescription>
            Fill in the details to schedule a support meeting with our team
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="customerName">Your Name</Label>
            <Input
              id="customerName"
              value={customerName}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This is your profile name
            </p>
          </div>
          
          <div>
            <Label htmlFor="companyName">Company Name*</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="companyAddress">Company Address*</Label>
            <Input
              id="companyAddress"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="meetDate">Meeting Date*</Label>
            <Input
              type="date"
              id="meetDate"
              min={format(new Date(), 'yyyy-MM-dd')}
              value={meetDate}
              onChange={(e) => setMeetDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="meetTime">Meeting Time*</Label>
            <Select
              value={meetTime}
              onValueChange={setMeetTime}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time">
                  {meetTime ? format(new Date(`2000-01-01T${meetTime}`), 'hh:mm a') : (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      Select time
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((time) => (
                  <SelectItem
                    key={time}
                    value={time}
                    className="cursor-pointer"
                  >
                    {format(new Date(`2000-01-01T${time}`), 'hh:mm a')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}