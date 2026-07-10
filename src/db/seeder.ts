import { db } from './index.js';
import * as schema from './schema.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

const randomUUID = () => crypto.randomUUID();

export async function runSeeder() {
  console.log('[Seeder] Running database seed...');
  
  const existingStats = await db.select().from(schema.dashboardStats).where(eq(schema.dashboardStats.id, 'main'));
  if (existingStats.length === 0) {
    await db.insert(schema.dashboardStats).values({
      id: 'main', activeEmployees: 0, totalDepartments: 0, openTickets: 0, monthlyRevenue: 0
    });
  }

  // Define modules and their permissions
  const modules = [
    'dashboard', 'organization', 'employee', 'customer', 'contract', 
    'asset', 'crm', 'sales', 'purchase', 'inventory', 'finance', 
    'helpdesk', 'kb', 'notification', 'settings', 'rbac', 'reference'
  ];

  const actions = ['read', 'write', 'delete'];

  // 1. Ensure all permissions exist
  for (const mod of modules) {
    for (const act of actions) {
      const permName = `${act}_${mod}`.toUpperCase();
      const existing = await db.select().from(schema.permissions).where(eq(schema.permissions.name, permName));
      if (existing.length === 0) {
        await db.insert(schema.permissions).values({
          id: randomUUID(),
          module: mod,
          action: act,
          name: permName,
          description: `Can ${act} ${mod}`,
          isSystem: true
        });
      }
    }
  }

  // 2. Ensure Role Group exists
  const roleGroups = await db.select().from(schema.roleGroups);
  let defaultGroupId = roleGroups[0]?.id;
  if (!defaultGroupId) {
    defaultGroupId = randomUUID();
    await db.insert(schema.roleGroups).values({
      id: defaultGroupId,
      name: 'System Defaults',
      description: 'Default System Roles',
      isSystem: true
    });
  }

  // 3. Define and create roles
  const rolesToCreate = ['SUPER_ADMIN', 'CEO', 'MANAGER', 'ENGINEER', 'HR', 'FINANCE', 'SALES', 'SUPPORT'];
  
  for (const roleName of rolesToCreate) {
    const existing = await db.select().from(schema.roles).where(eq(schema.roles.name, roleName));
    let roleId = existing[0]?.id;
    if (!roleId) {
      roleId = randomUUID();
      await db.insert(schema.roles).values({
        id: roleId,
        groupId: defaultGroupId,
        name: roleName,
        description: `${roleName} Role`,
        isSystem: true
      });
    }

    // 4. Assign permissions to roles (Super Admin gets all)
    if (roleName === 'SUPER_ADMIN') {
      const allPerms = await db.select().from(schema.permissions);
      const currentRolePerms = await db.select().from(schema.rolePermissions).where(eq(schema.rolePermissions.roleId, roleId));
      const currentPermIds = new Set(currentRolePerms.map(rp => rp.permissionId));
      
      for (const p of allPerms) {
        if (!currentPermIds.has(p.id)) {
          await db.insert(schema.rolePermissions).values({
            id: randomUUID(),
            roleId,
            permissionId: p.id
          });
        }
      }
    }
  }

  // 5. Ensure admin user exists with SUPER_ADMIN role
  const usersCount = await db.select().from(schema.users).where(eq(schema.users.username, 'admin'));
  let adminUserId = usersCount[0]?.id;
  
  if (!adminUserId) {
    const passwordHash = await bcrypt.hash('1234erP', 10);
    adminUserId = randomUUID();
    await db.insert(schema.users).values({
      id: adminUserId,
      username: 'admin',
      passwordHash,
      name: 'Administrator',
      email: 'admin@ichangeboss.com',
      role: 'SUPER_ADMIN',
      department: 'Management'
    });
  } else {
    // Force role to SUPER_ADMIN
    await db.update(schema.users).set({ role: 'SUPER_ADMIN' }).where(eq(schema.users.id, adminUserId));
  }

  // 6. Ensure userRoles mapping for admin user
  const superAdminRole = await db.select().from(schema.roles).where(eq(schema.roles.name, 'SUPER_ADMIN'));
  if (superAdminRole.length > 0) {
    const superAdminRoleId = superAdminRole[0].id;
    const existingMapping = await db.select().from(schema.userRoles)
      .where(eq(schema.userRoles.userId, adminUserId));
    
    const hasSuperAdmin = existingMapping.some(m => m.roleId === superAdminRoleId);
    if (!hasSuperAdmin) {
      await db.insert(schema.userRoles).values({
        id: randomUUID(),
        userId: adminUserId,
        roleId: superAdminRoleId
      });
    }
  }

  console.log('[Seeder] Database seed completed.');
}
