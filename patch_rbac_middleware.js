import fs from 'fs';
let code = fs.readFileSync('src/middleware/rbacMiddleware.ts', 'utf8');

const oldMid = `export const requirePermission = (module: string, action: 'read' | 'write' | 'delete') => {
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
      const requiredPerm = \`\${action}_\${module}\`.toUpperCase();
      const perms = await db.select({
        code: permissions.code
      })
      .from(rolePermissions)
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, user.role));`;

const newMid = `import { getUserRoles, getUserPermissions } from './rbac-engine.js';

export const requirePermission = (module: string, action: 'read' | 'write' | 'delete') => {
  return async (req: any, res: any, next: any) => {
    try {
      const user = req.user;
      if (!user) return errorResponse(res, 'Unauthorized', 401);
      
      const roles = getUserRoles(user.id);
      
      // Super Admin bypass
      if (roles.includes('SUPER_ADMIN') || user.role === 'SUPER_ADMIN') return next();

      // Determine required permission string (e.g. read_sales)
      const requiredPerm = \`\${action}_\${module}\`.toUpperCase();
      
      const userPerms = getUserPermissions(user.id);
      
      const hasPermission = userPerms.includes(requiredPerm) || userPerms.includes(\`MANAGE_\${module.toUpperCase()}\`);

      if (!hasPermission) {
        console.warn(\`[RBAC] Access denied for \${user.username} trying to \${action} on \${module}\`);
        return errorResponse(res, \`Forbidden: Requires \${requiredPerm}\`, 403);
      }
      
      return next();`;

code = code.replace(oldMid, newMid);
fs.writeFileSync('src/middleware/rbacMiddleware.ts', code);
