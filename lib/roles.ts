export const Roles = {
  USER: 'USER',
  MANAGER: 'MANAGER',
  SUPPORT: 'SUPPORT',
  ADMIN: 'ADMIN'
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export const roleHierarchy: { [key in Role]: number } = {
  [Roles.USER]: 0,
  [Roles.MANAGER]: 1,
  [Roles.SUPPORT]: 2,
  [Roles.ADMIN]: 3
};

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}