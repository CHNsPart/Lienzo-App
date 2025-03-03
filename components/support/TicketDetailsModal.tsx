// "use client";

// import { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
// import { 
//   Calendar, Clock, Building2, MapPin, Download, FileText, 
//   Users, CalendarCheck, FilePenLine, Trash2, X, 
//   Headset
// } from "lucide-react";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import { SupportTicketDetails, TicketStatus } from "@/types/support";
// import { SUPPORT_TICKET_STATUS, TIME_SLOTS } from "@/lib/constants/support";
// import { useToast } from "@/hooks/use-toast";
// import { Roles } from "@/lib/roles";

// interface TicketDetailsModalProps {
//   ticket: SupportTicketDetails;
//   onClose: () => void;
//   userRole: string;
//   userId: string;
//   onTicketDeleted?: () => void;
// }

// export default function TicketDetailsModal({ 
//   ticket, 
//   onClose,
//   userRole,
//   userId,
//   onTicketDeleted
// }: TicketDetailsModalProps) {
//   const [isRescheduling, setIsRescheduling] = useState(false);
//   const [newDate, setNewDate] = useState(ticket.rescheduledDate || '');
//   const [newTime, setNewTime] = useState(ticket.rescheduledTime || '');
//   const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     customerName: ticket.customerName,
//     companyName: ticket.companyName,
//     companyAddress: ticket.companyAddress,
//     meetDate: format(new Date(ticket.meetDate), 'yyyy-MM-dd'),
//     meetTime: ticket.meetTime
//   });

//   const { toast } = useToast();

//   const isAdmin = userRole === Roles.ADMIN;
//   const isAssignedSupport = ticket.supportUsers.some(su => su.user.id === userId);
//   const canUpdateStatus = isAdmin || isAssignedSupport;

//   const formatTimeToAMPM = (time: string) => {
//     const [hours, minutes] = time.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const hour12 = hour % 12 || 12;
//     return `${hour12}:${minutes} ${ampm}`;
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case SUPPORT_TICKET_STATUS.OPEN:
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case SUPPORT_TICKET_STATUS.RESOLVED:
//         return "bg-green-100 text-green-800 border-green-200";
//       case SUPPORT_TICKET_STATUS.RESCHEDULED:
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const handleStatusChange = async (newStatus: TicketStatus) => {
//     if (!canUpdateStatus) return;
//     setIsUpdatingStatus(true);

//     try {
//       const response = await fetch(`/api/support/tickets/${ticket.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!response.ok) throw new Error('Failed to update status');

//       toast({
//         title: "Success",
//         description: "Ticket status updated successfully",
//       });
//       onClose();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update ticket status",
//         variant: "destructive",
//       });
//     } finally {
//       setIsUpdatingStatus(false);
//     }
//   };

//   const handleEdit = async () => {
//     if (!isAdmin) return;

//     try {
//       const response = await fetch(`/api/support/tickets/${ticket.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(editFormData),
//       });

//       if (!response.ok) throw new Error('Failed to update ticket');

//       toast({
//         title: "Success",
//         description: "Ticket updated successfully",
//       });
//       setIsEditing(false);
//       onClose();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update ticket",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const response = await fetch(`/api/support/tickets/${ticket.id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) throw new Error('Failed to delete ticket');

//       toast({
//         title: "Success",
//         description: "Ticket deleted successfully",
//       });
//       onTicketDeleted?.();
//       onClose();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete ticket",
//         variant: "destructive",
//       });
//     }
//     setShowDeleteConfirm(false);
//   };

//   const handleReschedule = async () => {
//     if (!canUpdateStatus) return;

//     if (!newDate || !newTime) {
//       toast({
//         title: "Error",
//         description: "Please select both date and time",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const response = await fetch(`/api/support/tickets/${ticket.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           status: SUPPORT_TICKET_STATUS.RESCHEDULED,
//           rescheduledDate: newDate,
//           rescheduledTime: newTime
//         }),
//       });

//       if (!response.ok) throw new Error('Failed to reschedule ticket');

//       toast({
//         title: "Success",
//         description: "Ticket rescheduled successfully",
//       });
//       onClose();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to reschedule ticket",
//         variant: "destructive",
//       });
//     }
//   };

//   const renderField = (label: string, name: keyof typeof editFormData, type: string = 'text') => {
//     if (isEditing) {
//       return (
//         <div>
//           <Label className='text-muted-foreground'>{label}</Label>
//           {type === 'date' ? (
//             <Input
//               type="date"
//               value={editFormData[name]}
//               onChange={(e) => setEditFormData(prev => ({ ...prev, [name]: e.target.value }))}
//             />
//           ) : type === 'time' ? (
//             <Select
//               value={editFormData[name]}
//               onValueChange={(value) => setEditFormData(prev => ({ ...prev, [name]: value }))}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select time" />
//               </SelectTrigger>
//               <SelectContent>
//                 {TIME_SLOTS.map((time) => (
//                   <SelectItem key={time} value={time}>
//                     {formatTimeToAMPM(time)}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           ) : (
//             <Input
//               value={editFormData[name]}
//               onChange={(e) => setEditFormData(prev => ({ ...prev, [name]: e.target.value }))}
//             />
//           )}
//         </div>
//       );
//     }
    
//     return (
//       <div>
//         <Label className='text-muted-foreground'>{label}</Label>
//         <div className="text-lg font-medium">
//           {type === 'time' 
//             ? formatTimeToAMPM(editFormData[name])
//             : type === 'date'
//               ? format(new Date(editFormData[name]), 'MMM dd, yyyy')
//               : editFormData[name]
//           }
//         </div>
//       </div>
//     );
//   };

//   const handleDownload = async (fileName: string) => {
//     try {
//       const response = await fetch(`/uploads/${fileName}`);
//       if (!response.ok) throw new Error('Failed to download file');
      
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = fileName;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//       toast({
//         title: "Error",
//         description: "Failed to download file. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <>
//       <Dialog open={true} onOpenChange={onClose}>
//         <DialogContent className="max-w-[800px]">
//           <DialogHeader>
//             <div className="flex items-center justify-between">
//               <DialogTitle>Ticket Details</DialogTitle>
//               <div className="flex items-center gap-2">
//                 {isAdmin && (
//                   <>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="border-none"
//                       onClick={() => setIsEditing(!isEditing)}
//                     >
//                       {isEditing ? (
//                         <X className="h-4 w-4" />
//                       ) : (
//                         <FilePenLine className="h-4 w-4" />
//                       )}
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="border-none text-red-600 hover:text-red-700"
//                       onClick={() => setShowDeleteConfirm(true)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </>
//                 )}
//                 {canUpdateStatus && ticket.status !== SUPPORT_TICKET_STATUS.RESCHEDULED && (
//                   <Select 
//                     defaultValue={ticket.status}
//                     onValueChange={(value: TicketStatus) => handleStatusChange(value)}
//                     disabled={isUpdatingStatus}
//                   >
//                     <SelectTrigger className="w-[180px]">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value={SUPPORT_TICKET_STATUS.OPEN}>Open</SelectItem>
//                       <SelectItem value={SUPPORT_TICKET_STATUS.RESOLVED}>Resolved</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 )}
//                 {!canUpdateStatus && (
//                   <Badge className={cn(getStatusColor(ticket.status))}>
//                     {ticket.status}
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           </DialogHeader>

//           <Tabs defaultValue="details">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="details">Details</TabsTrigger>
//               <TabsTrigger value="documents">Documents</TabsTrigger>
//               <TabsTrigger value="team">Support Team</TabsTrigger>
//             </TabsList>

//             <TabsContent value="details">
//               <Card>
//                 <CardContent className="space-y-6 pt-6">
//                   <div className="grid grid-cols-2 gap-6">
//                     {renderField('Customer Name', 'customerName')}
//                     {renderField('Company Name', 'companyName')}
//                     <div className="col-span-2">
//                       {renderField('Company Address', 'companyAddress')}
//                     </div>
//                   </div>

//                   <div className="border-t pt-6">
//                     <h3 className="font-medium mb-4 text-lienzo flex items-center gap-2"><Headset className='size-4' /> Support Schedule</h3>
//                     <div className="grid grid-cols-2 gap-4">
//                       {renderField('Meeting Date', 'meetDate', 'date')}
//                       {renderField('Meeting Time', 'meetTime', 'time')}
//                     </div>

//                     {ticket.status === SUPPORT_TICKET_STATUS.RESCHEDULED && (
//                       <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//                         <h4 className="font-medium text-blue-700 mb-2">Rescheduled to:</h4>
//                         <div className="grid grid-cols-2 gap-4 text-blue-600">
//                           <div className="flex items-center">
//                             <Calendar className="w-4 h-4 mr-2" />
//                             {format(new Date(ticket.rescheduledDate!), 'MMM dd, yyyy')}
//                           </div>
//                           <div className="flex items-center">
//                             <Clock className="w-4 h-4 mr-2" />
//                             {formatTimeToAMPM(ticket.rescheduledTime!)}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {canUpdateStatus && 
//                      ticket.status !== SUPPORT_TICKET_STATUS.RESOLVED && 
//                      !isRescheduling && (
//                       <Button
//                         className="mt-4"
//                         variant="outline"
//                         onClick={() => setIsRescheduling(true)}
//                       >
//                         <CalendarCheck className="w-4 h-4 mr-2" />
//                         Reschedule Meeting
//                       </Button>
//                     )}

//                     {isRescheduling && (
//                       <div className="mt-4 p-4 border rounded-lg">
//                         <h4 className="font-medium mb-4">Reschedule Meeting</h4>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <Label>New Date</Label>
//                             <Input
//                               type="date"
//                               value={newDate.toString()}
//                               onChange={(e) => setNewDate(e.target.value)}
//                               min={format(new Date(), 'yyyy-MM-dd')}
//                             />
//                           </div>
//                           <div>
//                             <Label>New Time</Label>
//                             <Select
//                               value={newTime}
//                               onValueChange={setNewTime}
//                             >
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select time" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {TIME_SLOTS.map((time) => (
//                                   <SelectItem key={time} value={time}>
//                                     {formatTimeToAMPM(time)}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           </div>
//                         </div>
//                         <div className="flex gap-2 mt-4">
//                           <Button
//                             variant="outline"
//                             onClick={() => setIsRescheduling(false)}
//                           >
//                             Cancel
//                           </Button>
//                           <Button onClick={handleReschedule}>
//                             Confirm Reschedule
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {isEditing && (
//                     <div className="flex justify-end gap-2">
//                       <Button variant="outline" onClick={() => setIsEditing(false)}>
//                         Cancel
//                       </Button>
//                       <Button onClick={handleEdit}>
//                         Save Changes
//                       </Button>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="documents">
//               <Card>
//                 <CardContent className="pt-6">
//                   {ticket.documents.length === 0 ? (
//                     <div className="text-center py-8 text-gray-500">
//                       No documents attached to this ticket.
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {ticket.documents.map((doc) => {
//                         const files = JSON.parse(doc.document.files) as string[];
//                         return (
//                           <div
//                             key={doc.documentId}
//                             className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
//                           >
//                             <div className="flex items-center">
//                               <FileText className="w-5 h-5 mr-3 text-gray-500" />
//                               <div>
//                                 <div className="font-medium">{doc.document.title}</div>
//                                 <div className="text-sm text-gray-500">
//                                   {files.length} {files.length === 1 ? 'file' : 'files'}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex gap-2">
//                               {files.map((file, index) => (
//                                 <Button
//                                   key={index}
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => handleDownload(file)}
//                                   className="flex items-center gap-2"
//                                 >
//                                   <Download className="h-4 w-4" />
//                                   Download PDF {files.length > 1 ? index + 1 : ''}
//                                 </Button>
//                               ))}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="team">
//               <Card>
//                 <CardContent className="pt-6">
//                   {ticket.supportUsers.length === 0 ? (
//                     <div className="text-center py-8 text-gray-500">
//                       No support team members assigned.
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {ticket.supportUsers.map((support) => (
//                         <div
//                           key={support.userId}
//                           className="flex items-center justify-between p-4 border rounded-lg"
//                         >
//                           <div className="flex items-center">
//                             <Users className="w-5 h-5 mr-3 text-gray-500" />
//                             <div>
//                               <div className="font-medium">
//                                 {support.user.firstName} {support.user.lastName}
//                               </div>
//                               <div className="text-sm text-gray-500">
//                                 {support.user.email}
//                               </div>
//                             </div>
//                           </div>
//                           <Badge variant="outline">
//                             {support.user.role}
//                           </Badge>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </DialogContent>
//       </Dialog>

//       <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the ticket
//               and all associated data.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }

"use client";

// components/support/TicketDetailsModal.tsx
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
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="team">Support Team</TabsTrigger>
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
                {/* Status Section */}
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
                
                {/* Add rescheduling button */}
                {canUpdateStatus && 
                  status !== SUPPORT_TICKET_STATUS.RESOLVED && 
                  status !== SUPPORT_TICKET_STATUS.RESCHEDULED &&
                  !isRescheduling && (
                    <Button
                      className="mt-4"
                      variant="outline"
                      onClick={() => {
                        setIsRescheduling(true);
                        setStatus(SUPPORT_TICKET_STATUS.RESCHEDULED);
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
                      {canUpdateStatus && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-lienzo/80 hover:bg-lienzo hover:text-white"
                          onClick={() => setIsRescheduling(true)}
                        >
                          <CalendarCheck className="h-4 w-4 mr-2" />
                          Change Time
                        </Button>
                      )}
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
                          await handleStatusUpdate(SUPPORT_TICKET_STATUS.RESCHEDULED);
                          setIsRescheduling(false);
                          // Update local ticket data
                          ticket.rescheduledDate = new Date(rescheduleData.date);
                          ticket.rescheduledTime = rescheduleData.time;
                        }}
                      >
                        Update Meeting Time
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            {isEditing && isAdmin ? (
              <DocumentSelect
                availableDocuments={availableDocuments}
                selectedDocuments={selectedDocuments}
                onDocumentsChange={setSelectedDocuments}
              />
            ) : (
              <div className="space-y-2">
                {ticket.documents.map((doc) => (
                  <DocumentCard
                    key={doc.documentId}
                    title={doc.document.title}
                    fileName={JSON.parse(doc.document.files)[0]}
                  />
                ))}
              </div>
            )}
          </TabsContent>

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