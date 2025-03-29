// import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
// import { Roles, hasRole, Role } from './roles';
// import prisma from "./prisma";

// export async function isAdmin(user: KindeUser<Record<string, any>> | null): Promise<boolean> {
//   if (!user || !user.id || !user.email) {
//     return false;
//   }

//   if (user.email === 'imchn24@gmail.com') {
//     return true;
//   }

//   const dbUser = await prisma.user.findUnique({
//     where: { id: user.id },
//     select: { role: true },
//   });

//   if (!dbUser || !dbUser.role) {
//     return false;
//   }

//   return hasRole(dbUser.role as Role, Roles.ADMIN);
// }

// export async function isAdminOrManager(user: KindeUser<Record<string, any>> | null): Promise<boolean> {
//   if (!user || !user.id || !user.email) {
//     return false;
//   }

//   const dbUser = await prisma.user.findUnique({
//     where: { id: user.id },
//     select: { role: true },
//   });

//   if (!dbUser) return false;

//   return ['ADMIN', 'MANAGER'].includes(dbUser.role);
// }

// lib/auth.ts
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { Roles, hasRole, Role } from './roles';
import prisma from "./prisma";

export async function isAdmin(user: KindeUser<Record<string, any>> | null): Promise<boolean> {
  if (!user || !user.id || !user.email) {
    return false;
  }

  if (user.email === 'imchn24@gmail.com') {
    // For the admin email, let's ensure the user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
    
    // If admin doesn't exist in the database yet, create them
    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          firstName: user.given_name || 'Admin',
          lastName: user.family_name || 'User',
          role: Roles.ADMIN,
        },
      });
    }
    
    return true;
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser || !dbUser.role) {
      return false;
    }

    return hasRole(dbUser.role as Role, Roles.ADMIN);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function isAdminOrManager(user: KindeUser<Record<string, any>> | null): Promise<boolean> {
  if (!user || !user.id || !user.email) {
    return false;
  }

  // Special case for admin email
  if (user.email === 'imchn24@gmail.com') {
    return true;
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser) {
      // If user doesn't exist in database, create them with default role
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          firstName: user.given_name || 'Unknown',
          lastName: user.family_name || 'User',
          role: Roles.USER,
        },
      });
      return false;
    }

    return ['ADMIN', 'MANAGER'].includes(dbUser.role);
  } catch (error) {
    console.error('Error checking admin/manager status:', error);
    return false;
  }
}