export const SUPPORT_TICKET_STATUS = {
  OPEN: 'OPEN',
  RESOLVED: 'RESOLVED',
  RESCHEDULED: 'RESCHEDULED'
} as const;

export const SUPPORT_FILTERS = {
  ALL: 'all',
  OPEN: 'open',
  RESOLVED: 'resolved',
  RESCHEDULED: 'rescheduled'
} as const;

export const ALLOWED_FILE_TYPES = [
  'application/pdf'
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
];