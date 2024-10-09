import prisma from "@/lib/prisma";
import { getFromCache, setInCache } from './cache';

export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  const cacheKey = `permission:${userId}:${permissionName}`;
  const cachedResult = getFromCache<boolean>(cacheKey);

  if (cachedResult !== undefined) {
    return cachedResult;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      permissions: {
        include: { permission: true }
      }
    }
  });

  if (!user) return false;

  // Check user-specific permissions
  if (user.permissions.some(up => up.permission.name === permissionName)) {
    setInCache(cacheKey, true);
    return true;
  }

  // Check role-based permissions
  const rolePermission = await prisma.rolePermission.findFirst({
    where: {
      role: user.role,
      permission: { name: permissionName }
    }
  });

  const result = !!rolePermission;
  setInCache(cacheKey, result);
  return result;
}