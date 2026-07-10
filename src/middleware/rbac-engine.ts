import { db } from '../db';
import { roles, permissions, rolePermissions, userRoles, menuPermissions, dataScopes, roleDataScopes, approvalLevels } from '../db/schema';
import { eq, inArray } from 'drizzle-orm';

// In-memory cache for RBAC
let rbacCache: {
  userPermissions: Record<string, string[]>; // userId -> list of permission names (e.g. VIEW_DASHBOARD)
  userRolesList: Record<string, string[]>; // userId -> list of role names
  userMenus: Record<string, string[]>; // userId -> list of menu names
  userScopes: Record<string, Record<string, number>>; // userId -> module -> scope level
  approvalMatrix: Record<string, any[]>; // module -> levels
} = {
  userPermissions: {},
  userRolesList: {},
  userMenus: {},
  userScopes: {},
  approvalMatrix: {}
};

export async function refreshRBACCache() {
  console.log('[RBAC] Refreshing cache...');
  const newCache = {
    userPermissions: {},
    userRolesList: {},
    userMenus: {},
    userScopes: {},
    approvalMatrix: {}
  };

  // 1. Fetch all user roles
  const allUserRoles = await db.select({
    userId: userRoles.userId,
    roleId: roles.id,
    roleName: roles.name
  }).from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(roles.isActive, true));

  // 2. Fetch all role permissions
  const allRolePerms = await db.select({
    roleId: rolePermissions.roleId,
    permName: permissions.name
  }).from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id));

  // 3. Fetch all menu permissions
  const allMenuPerms = await db.select({
    roleId: menuPermissions.roleId,
    menu: menuPermissions.menu
  }).from(menuPermissions);

  // 4. Fetch all data scopes
  const allRoleScopes = await db.select({
    roleId: roleDataScopes.roleId,
    module: roleDataScopes.module,
    level: dataScopes.level
  }).from(roleDataScopes)
    .innerJoin(dataScopes, eq(roleDataScopes.scopeId, dataScopes.id));

  // 5. Build user cache
  for (const ur of allUserRoles) {
    const uId = ur.userId;
    if (!newCache.userRolesList[uId]) newCache.userRolesList[uId] = [];
    if (!newCache.userPermissions[uId]) newCache.userPermissions[uId] = [];
    if (!newCache.userMenus[uId]) newCache.userMenus[uId] = [];
    if (!newCache.userScopes[uId]) newCache.userScopes[uId] = {};

    newCache.userRolesList[uId].push(ur.roleName);

    // add permissions
    allRolePerms.filter(rp => rp.roleId === ur.roleId).forEach(rp => {
      if (!newCache.userPermissions[uId].includes(rp.permName)) {
        newCache.userPermissions[uId].push(rp.permName);
      }
    });

    // add menus
    allMenuPerms.filter(mp => mp.roleId === ur.roleId).forEach(mp => {
      if (!newCache.userMenus[uId].includes(mp.menu)) {
        newCache.userMenus[uId].push(mp.menu);
      }
    });

    // add scopes (take max level)
    allRoleScopes.filter(rs => rs.roleId === ur.roleId).forEach(rs => {
      const currentLevel = newCache.userScopes[uId][rs.module] || 0;
      if (rs.level > currentLevel) {
        newCache.userScopes[uId][rs.module] = rs.level;
      }
    });
  }

  // 6. Build Approval Matrix
  const allApprovals = await db.select({
    id: approvalLevels.id,
    module: approvalLevels.module,
    minAmount: approvalLevels.minAmount,
    maxAmount: approvalLevels.maxAmount,
    roleId: approvalLevels.roleId,
    roleName: roles.name,
    levelOrder: approvalLevels.levelOrder
  }).from(approvalLevels)
    .innerJoin(roles, eq(approvalLevels.roleId, roles.id));

  for (const ap of allApprovals) {
    if (!newCache.approvalMatrix[ap.module]) newCache.approvalMatrix[ap.module] = [];
    newCache.approvalMatrix[ap.module].push(ap);
  }
  
  for (const mod in newCache.approvalMatrix) {
    newCache.approvalMatrix[mod].sort((a, b) => a.levelOrder - b.levelOrder);
  }

  rbacCache = newCache;
  console.log('[RBAC] Cache refreshed successfully.');
}

export function getUserPermissions(userId: string): string[] {
  return rbacCache.userPermissions[userId] || [];
}

export function getUserRoles(userId: string): string[] {
  return rbacCache.userRolesList[userId] || [];
}

export function getUserMenus(userId: string): string[] {
  return rbacCache.userMenus[userId] || [];
}

export function getUserScope(userId: string, module: string): number {
  return rbacCache.userScopes[userId]?.[module] || 0;
}

export function getApprovalMatrix(module: string): any[] {
  return rbacCache.approvalMatrix[module] || [];
}

// Ensure cache is loaded initially (call this on server start)
export async function initRBAC() {
  await refreshRBACCache();
}
