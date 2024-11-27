export const LICENSE_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  PAYMENT_DONE: 'PAYMENT_DONE',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
} as const;

export type LicenseStatus = typeof LICENSE_STATUS[keyof typeof LICENSE_STATUS];

export function isValidStatusTransition(currentStatus: LicenseStatus, newStatus: LicenseStatus): boolean {
  const transitions: Record<LicenseStatus, LicenseStatus[]> = {
    'PENDING': ['IN_PROGRESS'],
    'IN_PROGRESS': ['PAYMENT_DONE'],
    'PAYMENT_DONE': ['ACTIVE'],
    'ACTIVE': ['EXPIRED'],
    'EXPIRED': []
  };

  return transitions[currentStatus]?.includes(newStatus) || false;
}