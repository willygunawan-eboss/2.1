import { Router } from 'express';
import { db } from '../db';
import { roles, permissions, rolePermissions, userRoles, menuPermissions, dataScopes, roleDataScopes, approvalLevels, roleGroups } from '../db/schema';
import { eq } from 'drizzle-orm';
import { requirePermission, requireRole } from '../middleware/rbac';
import { refreshRBACCache, getUserPermissions, getUserRoles, getUserMenus, getUserScope } from '../middleware/rbac-engine.js';

import crypto from 'crypto';

const router = Router();
const randomUUID = () => crypto.randomUUID();
import { auditPermissions } from '../db/schema';
async function logAudit(action: string, entityType: string, entityId: string, details: any, userId: string) {
  await db.insert(auditPermissions).values({
    id: randomUUID(),
    action,
    entityType,
    entityId,
    details: JSON.stringify(details),
    performedBy: userId
  });
}


// Apply middleware
// router.use(requirePermission('VIEW_SETTINGS')); // e.g. Settings module

// --- Role Groups ---
router.get('/groups', async (req, res) => {
  const result = await db.select().from(roleGroups);
  res.json({ success: true, data: result });
});

// --- Roles ---
router.get('/roles', async (req, res) => {
  const result = await db.select().from(roles);
  res.json({ success: true, data: result });
});

router.post('/roles', requirePermission('CREATE_SETTINGS'), async (req, res) => {
  const { name, groupId, description } = req.body;
  const newRole = { id: randomUUID(), name, groupId, description };
  await db.insert(roles).values(newRole);
  res.json({ success: true, data: newRole });
});

// --- Permissions ---
router.get('/permissions', async (req, res) => {
  const result = await db.select().from(permissions);
  res.json({ success: true, data: result });
});

// --- Role Permissions ---
router.get('/role-permissions/:roleId', async (req, res) => {
  const result = await db.select().from(rolePermissions).where(eq(rolePermissions.roleId, req.params.roleId));
  res.json({ success: true, data: result });
});

router.post('/role-permissions', requirePermission('UPDATE_SETTINGS'), async (req, res) => {
  const { roleId, permissionIds } = req.body;
  db.transaction((tx) => {
    tx.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId)).run();
    for (const pId of permissionIds) {
      tx.insert(rolePermissions).values({ id: randomUUID(), roleId, permissionId: pId }).run();
    }
  });
  await refreshRBACCache();
  await logAudit('UPDATE_ROLE_PERMISSIONS', 'Role', roleId, { permissionIds }, (req as any).user.id);
  res.json({ success: true, message: 'Updated successfully' });
});

// --- User Roles ---
router.get('/user-roles/:userId', async (req, res) => {
  const result = await db.select().from(userRoles).where(eq(userRoles.userId, req.params.userId));
  res.json({ success: true, data: result });
});

router.post('/user-roles', requirePermission('UPDATE_SETTINGS'), async (req, res) => {
  const { userId, roleIds } = req.body;
  db.transaction((tx) => {
    tx.delete(userRoles).where(eq(userRoles.userId, userId)).run();
    for (const rId of roleIds) {
      tx.insert(userRoles).values({ id: randomUUID(), userId, roleId: rId }).run();
    }
  });
  await refreshRBACCache();
  res.json({ success: true, message: 'Updated successfully' });
});

// --- Menu Permissions ---
router.get('/menu-permissions/:roleId', async (req, res) => {
  const result = await db.select().from(menuPermissions).where(eq(menuPermissions.roleId, req.params.roleId));
  res.json({ success: true, data: result });
});

router.post('/menu-permissions', requirePermission('UPDATE_SETTINGS'), async (req, res) => {
  const { roleId, menus } = req.body;
  db.transaction((tx) => {
    tx.delete(menuPermissions).where(eq(menuPermissions.roleId, roleId)).run();
    for (const m of menus) {
      tx.insert(menuPermissions).values({ id: randomUUID(), roleId, menu: m }).run();
    }
  });
  await refreshRBACCache();
  res.json({ success: true, message: 'Updated successfully' });
});

// --- Data Scopes ---
router.get('/scopes', async (req, res) => {
  const result = await db.select().from(dataScopes);
  res.json({ success: true, data: result });
});

router.get('/role-scopes/:roleId', async (req, res) => {
  const result = await db.select().from(roleDataScopes).where(eq(roleDataScopes.roleId, req.params.roleId));
  res.json({ success: true, data: result });
});

router.post('/role-scopes', requirePermission('UPDATE_SETTINGS'), async (req, res) => {
  const { roleId, moduleScopes } = req.body; // [{module, scopeId}]
  db.transaction((tx) => {
    tx.delete(roleDataScopes).where(eq(roleDataScopes.roleId, roleId)).run();
    for (const ms of moduleScopes) {
      tx.insert(roleDataScopes).values({ id: randomUUID(), roleId, module: ms.module, scopeId: ms.scopeId }).run();
    }
  });
  await refreshRBACCache();
  res.json({ success: true, message: 'Updated successfully' });
});

// --- Approval Levels ---
router.get('/approvals', async (req, res) => {
  const result = await db.select().from(approvalLevels);
  res.json({ success: true, data: result });
});

router.post('/approvals', requirePermission('UPDATE_SETTINGS'), async (req, res) => {
  const { module, minAmount, maxAmount, roleId, levelOrder } = req.body;
  const newAppr = { id: randomUUID(), module, minAmount, maxAmount, roleId, levelOrder };
  await db.insert(approvalLevels).values(newAppr);
  await refreshRBACCache();
  res.json({ success: true, data: newAppr });
});

// Context route to get current user permissions for Frontend
router.get('/context', (req, res) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  
  res.json({
    success: true,
    data: {
      roles: getUserRoles(user.id),
      permissions: getUserPermissions(user.id),
      modules: [...new Set(getUserPermissions(user.id).map((p: string) => p.split('_')[1]?.toLowerCase()).filter(Boolean))],
      menus: getUserMenus(user.id),
      // To get scopes properly, we'd need to send all of them or fetch per module, 
      // let's just return the scopes object if we export it, but for now we'll rely on the backend.
      // Wait, frontend needs scopes too potentially.
    }
  });
});

export default router;
