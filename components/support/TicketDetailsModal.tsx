"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DocumentSelect } from './DocumentSelect';
import { TeamSelect } from './TeamSelect';
import { InstructionDocument, SupportTicketDetails } from "@/types/support";
import type { TicketStatus } from "@/types/support";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { TIME_SLOTS, SUPPORT_TICKET_STATUS } from "@/lib/constants/support";
import { Roles } from "@/lib/roles";
import { Building2, Calendar, Clock, User2, MapPin, CalendarCheck } from "lucide-react";
import { DocumentCard } from './DocumentCard';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

interface TicketDetailsModalProps {
  ticket: SupportTicketDetails;
  onClose: () => void;
  userRole: string;
  userId: string;
  onTicketDeleted?: () => void;
  onTicketChange: () => void;
}

interface EditableFields {
  customerName: string;
  companyName: string;
  companyAddress: string;
  meetDate: string;
  meetTime: string;
}

export default function TicketDetailsModal({
  ticket,
  onClose,
  userRole,
  userId,
  onTicketDeleted,
  onTicketChange
}: TicketDetailsModalProps) {
  const isAdmin = userRole === Roles.ADMIN;
  const isSupport = userRole === Roles.SUPPORT;
  const isAdminOrSupport = isAdmin || isSupport;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [status, setStatus] = useState<TicketStatus>(ticket.status as TicketStatus);
  const [editFormData, setEditFormData] = useState<EditableFields>({
    customerName: ticket.customerName,
    companyName: ticket.companyName,
    companyAddress: ticket.companyAddress,
    meetDate: format(new Date(ticket.meetDate), 'yyyy-MM-dd'),
    meetTime: ticket.meetTime
  });
  const [rescheduleData, setRescheduleData] = useState({
    date: ticket.rescheduledDate ? format(new Date(ticket.rescheduledDate), 'yyyy-MM-dd') : '',
    time: ticket.rescheduledTime || ''
  });

  // Document and Team state
  const [selectedDocuments, setSelectedDocuments] = useState<InstructionDocument[]>(
    ticket.documents.map(d => d.document)
  );
  const [selectedTeamMembers, setSelectedTeamMembers] = useState(
    ticket.supportUsers.map(su => su.user)
  );
  const [availableDocuments, setAvailableDocuments] = useState<InstructionDocument[]>([]);
  const [availableTeamMembers, setAvailableTeamMembers] = useState<any[]>([]);

  const { toast } = useToast();

  const isAssignedSupport = ticket.supportUsers.some(su => su.user.id === userId);
  const canUpdateStatus = isAdmin || isAssignedSupport;

  useEffect(() => {
    if (isAdmin && isEditing) {
      // Only fetch when admin is editing
      const fetchData = async () => {
        try {
          const [docsResponse, usersResponse] = await Promise.all([
            fetch('/api/instructions'),
            fetch('/api/users')
          ]);

          if (docsResponse.ok) {
            const documents = await docsResponse.json();
            setAvailableDocuments(documents);
          }

          if (usersResponse.ok) {
            const users = await usersResponse.json();
            setAvailableTeamMembers(users.filter((user: any) => user.role === 'SUPPORT'));
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          toast({
            title: "Error",
            description: "Failed to load available documents and team members",
            variant: "destructive",
          });
        }
      };

      fetchData();
    }
  }, [isAdmin, isEditing, toast]);

  const handleDeleteTicket = async () => {
    try {
      const response = await fetch(`/api/support/tickets/${ticket.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete ticket');

      toast({
        title: "Success",
        description: "Ticket deleted successfully",
        variant: "default",
      });
      onTicketDeleted?.();
      onClose();
      onTicketChange();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ticket",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (newStatus: TicketStatus) => {
    setIsSubmitting(true);
    
    try {
      const updateData: { 
        status: TicketStatus;
        rescheduledDate?: string;
        rescheduledTime?: string;
      } = { status: newStatus };
      
      if (newStatus === SUPPORT_TICKET_STATUS.RESCHEDULED) {
        if (!rescheduleData.date || !rescheduleData.time) {
          throw new Error('Please select both date and time for rescheduling');
        }
        updateData.rescheduledDate = rescheduleData.date;
        updateData.rescheduledTime = rescheduleData.time;
      }
  
      const response = await fetch(`/api/support/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
  
      if (!response.ok) throw new Error('Failed to update status');
  
      const updatedTicket = await response.json();
      
      // Update local state
      setStatus(newStatus);
      if (updatedTicket.rescheduledDate) {
        setRescheduleData({
          date: format(new Date(updatedTicket.rescheduledDate), 'yyyy-MM-dd'),
          time: updatedTicket.rescheduledTime
        });
      }
  
      toast({
        title: "Success",
        description: `Status updated to ${newStatus}`,
      });

      onTicketChange();
  
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

  const handleSave = async () => {
    if (!isEditing || !isAdmin) return;
    setIsSubmitting(true);

    try {
      // Prepare document changes
      const currentDocIds = ticket.documents.map(d => d.document.id);
      const newDocIds = selectedDocuments.map(d => d.id);
      const documentsToAdd = newDocIds.filter(id => !currentDocIds.includes(id));
      const documentsToRemove = currentDocIds.filter(id => !newDocIds.includes(id));

      // Prepare team changes
      const currentTeamIds = ticket.supportUsers.map(su => su.user.id);
      const newTeamIds = selectedTeamMembers.map(m => m.id);
      const supportUsersToAdd = newTeamIds.filter(id => !currentTeamIds.includes(id));
      const supportUsersToRemove = currentTeamIds.filter(id => !newTeamIds.includes(id));

      const response = await fetch(`/api/support/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editFormData,
          documentsToAdd,
          documentsToRemove,
          supportUsersToAdd,
          supportUsersToRemove,
        }),
      });

      if (!response.ok) throw new Error('Failed to update ticket');

      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Ticket Details</DialogTitle>
            <div>
              {isAdmin && (
                <div className='flex items-center justify-center gap-2'>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                  >
                    {isEditing ? "Cancel Edit" : "Edit"}
                  </Button>
                  <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteTicket}
                    ticketId={ticket.id}
                  />
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            {isAdminOrSupport && (
              <>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="team">Support Team</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Customer Name</Label>
                  {isEditing ? (
                    <Input
                      value={editFormData.customerName}
                      onChange={(e) => setEditFormData(prev => ({
                        ...prev,
                        customerName: e.target.value
                      }))}
                    />
                  ) : (
                    <p className="text-lg font-medium">{ticket.customerName}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Company Name</Label>
                  {isEditing ? (
                    <Input
                      value={editFormData.companyName}
                      onChange={(e) => setEditFormData(prev => ({
                        ...prev,
                        companyName: e.target.value
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg font-medium">{ticket.companyName}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Company Address</Label>
                  {isEditing ? (
                    <Input
                      value={editFormData.companyAddress}
                      onChange={(e) => setEditFormData(prev => ({
                        ...prev,
                        companyAddress: e.target.value
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg font-medium">{ticket.companyAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Meeting Details */}
              <div className="space-y-6">
                {/* Status Section - Only for Admin/Support */}
                {isAdminOrSupport && (
                  <div>
                    <Label className="text-muted-foreground mb-2 block">Status</Label>
                    {ticket.status !== SUPPORT_TICKET_STATUS.RESOLVED ? (
                      <Select
                        value={status}
                        onValueChange={handleStatusUpdate}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='accent-lienzo'>
                          <SelectItem className='hover:bg-gray-100 cursor-pointer' value={SUPPORT_TICKET_STATUS.OPEN}>Open</SelectItem>
                          <SelectItem className='hover:bg-gray-100 cursor-pointer' value={SUPPORT_TICKET_STATUS.RESOLVED}>Resolved</SelectItem>
                          { status === SUPPORT_TICKET_STATUS.RESCHEDULED &&
                            <SelectItem className='hover:bg-gray-100 cursor-pointer' value={SUPPORT_TICKET_STATUS.RESCHEDULED}>Rescheduled</SelectItem>
                          }
                        </SelectContent>
                      </Select>
                      ) : (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {ticket.status}
                      </Badge>
                    )}
                  </div>
                )}

                {/* For regular users, just show status badge */}
                {!isAdminOrSupport && (
                  <div>
                    <Label className="text-muted-foreground mb-2 block">Status</Label>
                    <Badge className={
                      ticket.status === SUPPORT_TICKET_STATUS.OPEN
                        ? "bg-yellow-100 hover:bg-yellow-50 text-yellow-800 border-yellow-200"
                        : ticket.status === SUPPORT_TICKET_STATUS.RESOLVED
                        ? "bg-green-100 hover:bg-green-50 text-green-800 border-green-200"
                        : "bg-blue-100 hover:bg-blue-50 text-blue-800 border-blue-200"
                    }>
                      {ticket.status}
                    </Badge>
                  </div>
                )}

                {/* Original Meeting Time */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Original Meeting Time</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {isEditing ? (
                      <>
                        <Input
                          type="date"
                          value={editFormData.meetDate}
                          onChange={(e) => setEditFormData(prev => ({
                            ...prev,
                            meetDate: e.target.value
                          }))}
                        />
                        <Select
                          value={editFormData.meetTime}
                          onValueChange={(value) => setEditFormData(prev => ({
                            ...prev,
                            meetTime: value
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.map((time) => (
                              <SelectItem key={time} value={time}>
                                {format(new Date(`2000-01-01T${time}`), 'hh:mm a')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <div className="col-span-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-lg font-medium">
                            {format(new Date(ticket.meetDate), 'MMMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-lg font-medium">
                            {format(new Date(`2000-01-01T${ticket.meetTime}`), 'hh:mm a')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Add rescheduling button - ALL users can see this */}
                {status !== SUPPORT_TICKET_STATUS.RESOLVED && 
                  status !== SUPPORT_TICKET_STATUS.RESCHEDULED &&
                  !isRescheduling && (
                    <Button
                      className="mt-4"
                      variant="outline"
                      onClick={() => {
                        setIsRescheduling(true);
                        if (canUpdateStatus) {
                          setStatus(SUPPORT_TICKET_STATUS.RESCHEDULED);
                        }
                      }}
                    >
                      <CalendarCheck className="w-4 h-4 mr-2" />
                      Reschedule Meeting
                    </Button>
                  )}

                {/* Show Rescheduled Meeting Details when not editing */}
                {status === SUPPORT_TICKET_STATUS.RESCHEDULED && !isRescheduling && (
                  <div className="mt-4 p-4 bg-lienzo/5 rounded-lg border border-lienzo/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-lienzo">Rescheduled Meeting Time</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-lienzo/80 hover:bg-lienzo hover:text-white"
                        onClick={() => setIsRescheduling(true)}
                      >
                        <CalendarCheck className="h-4 w-4 mr-2" />
                        Change Time
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-lienzo" />
                        <span>
                          {format(new Date(rescheduleData.date), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-lienzo" />
                        <span>
                          {format(new Date(`2000-01-01T${rescheduleData.time}`), 'hh:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rescheduling Form */}
                {isRescheduling && (
                  <div className="mt-4 p-4 border border-lienzo/50 rounded-lg bg-white">
                    <h4 className="font-medium mb-4">Update Meeting Time</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        value={rescheduleData.date}
                        onChange={(e) => setRescheduleData(prev => ({
                          ...prev,
                          date: e.target.value
                        }))}
                        min={format(new Date(), 'yyyy-MM-dd')}
                      />
                      <Select
                        value={rescheduleData.time}
                        onValueChange={(value) => setRescheduleData(prev => ({
                          ...prev,
                          time: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem className='hover:bg-gray-100 cursor-pointer' key={time} value={time}>
                              {format(new Date(`2000-01-01T${time}`), 'hh:mm a')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsRescheduling(false);
                          setRescheduleData({
                            date: ticket.rescheduledDate ? format(new Date(ticket.rescheduledDate), 'yyyy-MM-dd') : '',
                            time: ticket.rescheduledTime || ''
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={async () => {
                          if (isAdminOrSupport) {
                            await handleStatusUpdate(SUPPORT_TICKET_STATUS.RESCHEDULED);
                          } else {
                            // For regular users, just request the reschedule
                            try {
                              console.log("Sending reschedule request to:", `/api/support/tickets/${ticket.id}/reschedule`);
                              
                              const response = await fetch(`/api/support/tickets/${ticket.id}/reschedule`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  rescheduledDate: rescheduleData.date,
                                  rescheduledTime: rescheduleData.time
                                }),
                              });
                              
                              if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.error || 'Failed to request reschedule');
                              }
                              
                              toast({
                                title: "Success",
                                description: "Your reschedule request has been submitted",
                              });
                              
                              onTicketChange();
                            } catch (error) {
                              console.error("Reschedule error:", error);
                              toast({
                                title: "Error",
                                description: error instanceof Error ? error.message : "Failed to request reschedule",
                                variant: "destructive",
                              });
                            }
                          }
                          setIsRescheduling(false);
                        }}
                      >
                        {isAdminOrSupport ? "Update Meeting Time" : "Request Reschedule"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab - Only for Admin/Support */}
          {isAdminOrSupport && (
            <TabsContent value="documents">
              {isEditing && isAdmin ? (
                <DocumentSelect
                  availableDocuments={availableDocuments}
                  selectedDocuments={selectedDocuments}
                  onDocumentsChange={setSelectedDocuments}
                />
              ) : (
                <div className="space-y-2">
                  {ticket.documents.length > 0 ? (
                    ticket.documents.map((doc) => (
                      <DocumentCard
                        key={doc.documentId}
                        title={doc.document.title}
                        fileNames={JSON.parse(doc.document.files)}
                      />
                    ))
                  ) : (
                    <p className="text-center py-4 text-gray-500">
                      No documents attached to this ticket.
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
          )}

          {/* Team Tab - Only for Admin/Support */}
          {isAdminOrSupport && (
            <TabsContent value="team">
              {isEditing && isAdmin ? (
                <TeamSelect
                  availableMembers={availableTeamMembers}
                  selectedMembers={selectedTeamMembers}
                  onMembersChange={setSelectedTeamMembers}
                />
              ) : (
                <div className="space-y-2">
                  {ticket.supportUsers.map((support) => (
                    <Card key={support.userId} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {support.user.firstName} {support.user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {support.user.email}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{support.user.role}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          {isEditing && isAdmin && (
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}