import { db } from '../db/index.js';
import { rolePermissions, permissions } from '../db/schema.js';
import { eq, inArray, and } from 'drizzle-orm';
import { errorResponse } from '../utils/apiResponse.js';

export const requirePermission = (module: string, action: 'read' | 'write' | 'delete') => {
  return async (req: any, res: any, next: any) => {
    try {
      const user = req.user;
      if (!user) return errorResponse(res, 'Unauthorized', 401);
      
      // Super Admin bypass
      if (user.role === 'superadmin') return next();

      if (!user.role) {
        return errorResponse(res, 'Forbidden: No role assigned', 403);
      }

      // Determine required permission string (e.g. read_sales)
      const requiredPerm = `${action}_${module}`.toUpperCase();

      const perms = await db.select({
        code: permissions.code
      })
      .from(rolePermissions)
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, user.role));

      const hasPermission = perms.some(p => p.code === requiredPerm || p.code === `MANAGE_${module.toUpperCase()}` || p.code === 'ADMIN');

      if (!hasPermission) {
        console.warn(`[RBAC] Access denied for ${user.email} (Role: ${user.role}) trying to ${action} on ${module}`);
        return errorResponse(res, `Forbidden: Requires ${requiredPerm}`, 403);
      }
      
      return next();
    } catch (e) {
      console.error('[RBAC Error]', e);
      return errorResponse(res, 'RBAC Error', 500, String(e));
    }
  };
};
