import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { Roles, hasRole, Role } from './roles';
import prisma from "@/lib/prisma";

export async function isAdmin(user: KindeUser<Record<string, any>> | null): Promise<boolean> {
  if (!user || !user.id || !user.email) {
    return false;
  }

  if (user.email === 'imchn24@gmail.com') {
    return true;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser || !dbUser.role) {
    return false;
  }

  return hasRole(dbUser.role as Role, Roles.ADMIN);
}

export async function isAdminOrManager(user: KindeUser<Record<string, any>> | null): Promise<boolean> {
  if (!user || !user.id || !user.email) {
    return false;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser) return false;

  return ['ADMIN', 'MANAGER'].includes(dbUser.role);
}