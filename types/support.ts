// types/support.ts

export const TICKET_STATUS = {
  OPEN: 'OPEN',
  RESOLVED: 'RESOLVED',
  RESCHEDULED: 'RESCHEDULED'
} as const;

export type TicketStatus = typeof TICKET_STATUS[keyof typeof TICKET_STATUS];

export interface InstructionDocument {
  id: string;
  title: string;
  files: string;
  createdAt: Date;
  updatedAt: Date;
  tickets?: TicketsOnDocuments[];
}

export interface SupportTicket {
  id: string;
  customerName: string;
  companyName: string;
  companyAddress: string;
  meetDate: Date;
  meetTime: string;
  status: TicketStatus;
  documents?: TicketsOnDocuments[];
  supportUsers?: TicketsOnUsers[];
  createdAt: Date;
  updatedAt: Date;
  rescheduledDate?: Date | null;
  rescheduledTime?: string | null;
}

export interface TicketsOnDocuments {
  ticket: SupportTicket;
  ticketId: string;
  document: InstructionDocument;
  documentId: string;
  assignedAt: Date;
}

export interface TicketsOnUsers {
  ticket: SupportTicket;
  ticketId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  userId: string;
  assignedAt: Date;
}

export interface EditFormData {
  customerName: string;
  companyName: string;
  companyAddress: string;
  meetDate: string;
  meetTime: string;
  documentIds: string[];
  supportUserIds: string[];
}

export interface SupportTicketDetails extends SupportTicket {
  documents: (TicketsOnDocuments & {
    document: InstructionDocument;
  })[];
  supportUsers: (TicketsOnUsers & {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
  })[];
}

export interface TicketFilters {
  status?: TicketStatus;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  supportUserId?: string;
}

export interface DocumentFormData {
  title: string;
  files: File[];
}

export interface TicketFormData {
  customerName: string;
  companyName: string;
  companyAddress: string;
  meetDate: Date;
  meetTime: string;
  documentIds: string[];
  supportUserIds: string[];
}

export interface TicketUpdateData {
  // Basic info updates
  customerName?: string;
  companyName?: string;
  companyAddress?: string;
  meetDate?: Date | string;
  meetTime?: string;
  status?: TicketStatus;
  
  // Document updates
  documentsToAdd?: string[];
  documentsToRemove?: string[];
  
  // Team updates
  supportUsersToAdd?: string[];
  supportUsersToRemove?: string[];
  
  // Rescheduling
  rescheduledDate?: Date | string | null;
  rescheduledTime?: string | null;
}

export interface DocumentUpdate {
  added: InstructionDocument[];
  removed: string[];
  current: InstructionDocument[];
}

export interface TeamUpdate {
  added: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }[];
  removed: string[];
  current: TicketsOnUsers[];
}