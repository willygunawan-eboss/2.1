import { db } from '../db/index.js';
import { errorResponse } from '../utils/apiResponse.js';
import { getUserRoles, getUserPermissions } from './rbac-engine.js';

export const requirePermission = (module: string, action: 'read' | 'write' | 'delete') => {
  return async (req: any, res: any, next: any) => {
    try {
      const user = req.user;
      if (!user) return errorResponse(res, 'Unauthorized', 401);
      
      const roles = getUserRoles(user.id);
      
      // Super Admin bypass
      if (roles.includes('SUPER_ADMIN') || user.role === 'SUPER_ADMIN') return next();

      // Determine required permission string (e.g. read_sales)
      const requiredPerm = `${action}_${module}`.toUpperCase();
      
      const userPerms = getUserPermissions(user.id);
      
      const hasPermission = userPerms.includes(requiredPerm) || userPerms.includes(`MANAGE_${module.toUpperCase()}`);

      if (!hasPermission) {
        console.warn(`[RBAC] Access denied for ${user.username || user.email} trying to ${action} on ${module}`);
        return errorResponse(res, `Forbidden: Requires ${requiredPerm}`, 403);
      }
      
      return next();
    } catch (e) {
      console.error('[RBAC Error]', e);
      return errorResponse(res, 'RBAC Error', 500, String(e));
    }
  };
};
