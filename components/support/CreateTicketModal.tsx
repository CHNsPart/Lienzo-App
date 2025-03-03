"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, FileText, Users, Loader2 } from "lucide-react";
import { format, isBefore, parse, startOfToday } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { TIME_SLOTS } from "@/lib/constants/support";
import { InstructionDocument } from "@/types/support";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: () => void;
}

interface SupportUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function CreateTicketModal({ isOpen, onClose, onTicketCreated }: CreateTicketModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [meetDate, setMeetDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [meetTime, setMeetTime] = useState('');
  const [documents, setDocuments] = useState<InstructionDocument[]>([]);
  const [supportUsers, setSupportUsers] = useState<SupportUser[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectedSupportUsers, setSelectedSupportUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    setIsFetchingData(true);
    try {
      const [docsResponse, usersResponse] = await Promise.all([
        fetch('/api/instructions'),
        fetch('/api/users')
      ]);

      if (docsResponse.ok && usersResponse.ok) {
        const [docsData, usersData] = await Promise.all([
          docsResponse.json(),
          usersResponse.json()
        ]);
        setDocuments(docsData);
        setSupportUsers(usersData.filter((user: any) => user.role === 'SUPPORT'));
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load required data",
        variant: "destructive",
      });
    } finally {
      setIsFetchingData(false);
    }
  };

  const validateDate = (dateStr: string): boolean => {
    const selectedDate = new Date(dateStr);
    return !isBefore(selectedDate, startOfToday());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      
    if (!validateDate(meetDate)) {
      toast({
        title: "Invalid Date",
        description: "Please select a future date",
        variant: "destructive",
      });
      return;
    }
  
    if (selectedSupportUsers.length === 0) {
      toast({
        title: "Support Team Required",
        description: "Please select at least one support team member",
        variant: "destructive",
      });
      return;
    }
  
    setIsLoading(true);
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
          documentIds: selectedDocuments,
          supportUserIds: selectedSupportUsers,
        }),
      });
  
      if (!response.ok) throw new Error('Failed to create ticket');
  
      toast({ 
        title: "Success", 
        description: "Support ticket created successfully" 
      });
      onTicketCreated();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Loading</DialogTitle>
            <DialogDescription>Fetching required data...</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>Enter ticket details below</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
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
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input
                  id="companyAddress"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="meetDate">Meeting Date</Label>
                <Input
                  type="date"
                  id="meetDate"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  value={meetDate}
                  onChange={(e) => setMeetDate(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Replace your existing time selection code with this */}
              <div>
                <Label>Meeting Time</Label>
                <Select 
                  value={meetTime} 
                  onValueChange={setMeetTime}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time">
                      {meetTime ? format(parse(meetTime, 'HH:mm', new Date()), 'hh:mm a') : (
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
                        {format(parse(time, 'HH:mm', new Date()), 'hh:mm a')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  Available Documents
                </Label>
                <ScrollArea className="h-[200px] border p-2 rounded-xl">
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <Card
                        key={doc.id}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedDocuments.includes(doc.id) && "border-primary"
                        )}
                        onClick={() => {
                          setSelectedDocuments(prev =>
                            prev.includes(doc.id)
                              ? prev.filter(id => id !== doc.id)
                              : [...prev, doc.id]
                          );
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{doc.title}</p>
                              <p className="text-sm text-gray-500">
                                {JSON.parse(doc.files).length} file(s)
                              </p>
                            </div>
                            {selectedDocuments.includes(doc.id) && (
                              <Badge>Selected</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  Support Team Members
                </Label>
                <ScrollArea className="h-[200px] border p-2 rounded-xl">
                  <div className="space-y-2">
                    {supportUsers.map((user) => (
                      <Card
                        key={user.id}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedSupportUsers.includes(user.id) && "border-primary"
                        )}
                        onClick={() => {
                          setSelectedSupportUsers(prev =>
                            prev.includes(user.id)
                              ? prev.filter(id => id !== user.id)
                              : [...prev, user.id]
                          );
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            {selectedSupportUsers.includes(user.id) && (
                              <Badge>Selected</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Ticket'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}