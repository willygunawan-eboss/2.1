import { Request, Response, NextFunction } from 'express';
import { getUserPermissions, getUserRoles, getUserScope } from './rbac-engine';

export const requirePermission = (permissionName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    // System Admins bypass permission checks
    const roles = getUserRoles(user.id);
    if (roles.includes('System Admin')) return next();

    const perms = getUserPermissions(user.id);
    if (!perms.includes(permissionName)) {
      return res.status(403).json({ success: false, message: `Forbidden: Requires ${permissionName}` });
    }
    next();
  };
};

export const requireAnyPermission = (permissionNames: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    // System Admins bypass permission checks
    const roles = getUserRoles(user.id);
    if (roles.includes('System Admin')) return next();

    const perms = getUserPermissions(user.id);
    const hasPerm = permissionNames.some(p => perms.includes(p));
    if (!hasPerm) {
      return res.status(403).json({ success: false, message: `Forbidden: Requires one of ${permissionNames.join(', ')}` });
    }
    next();
  };
};

export const requireRole = (roleName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    // System Admins bypass
    const roles = getUserRoles(user.id);
    if (roles.includes('System Admin') && roleName !== 'System Admin') return next();

    if (!roles.includes(roleName)) {
      return res.status(403).json({ success: false, message: `Forbidden: Requires role ${roleName}` });
    }
    next();
  };
};

// Data Scope middleware decorator to inject scope into request
export const injectDataScope = (moduleName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const roles = getUserRoles(user.id);
    let scopeLevel = getUserScope(user.id, moduleName);
    
    // System Admins get Global scope (100)
    if (roles.includes('System Admin')) {
      scopeLevel = 100;
    }

    (req as any).dataScope = { module: moduleName, level: scopeLevel };
    next();
  };
};
