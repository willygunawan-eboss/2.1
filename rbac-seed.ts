import { db } from './src/db';
import { roleGroups, roles, permissions, dataScopes, menuPermissions, rolePermissions, userRoles, users } from './src/db/schema';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

function uuidv4() {
  return crypto.randomUUID();
}

async function seedRBAC() {
  console.log('Seeding RBAC Engine...');

  // 1. Data Scopes
  const scopes = [
    { name: 'Self', level: 10, description: 'Own data only' },
    { name: 'Department', level: 20, description: 'Department data' },
    { name: 'Division', level: 30, description: 'Division data' },
    { name: 'Branch', level: 40, description: 'Branch data' },
    { name: 'Company', level: 50, description: 'Company data' },
    { name: 'Global', level: 100, description: 'All data' },
  ];

  for (const s of scopes) {
    const exists = await db.select().from(dataScopes).where(eq(dataScopes.name, s.name));
    if (exists.length === 0) {
      await db.insert(dataScopes).values({ id: uuidv4(), ...s });
    }
  }

  // 2. Role Groups
  const groups = ['System', 'Executive', 'Management', 'Operations', 'Support', 'Customer', 'Vendor'];
  for (const g of groups) {
    const exists = await db.select().from(roleGroups).where(eq(roleGroups.name, g));
    if (exists.length === 0) {
      await db.insert(roleGroups).values({ id: uuidv4(), name: g });
    }
  }

  const roleGroupsList = await db.select().from(roleGroups);
  const getGroupId = (name: string) => roleGroupsList.find(g => g.name === name)?.id;

  // 3. Roles
  const rolesToCreate = [
    { name: 'CEO', group: 'Executive' },
    { name: 'COO', group: 'Executive' },
    { name: 'CFO', group: 'Executive' },
    { name: 'CTO', group: 'Executive' },
    { name: 'HR Manager', group: 'Management' },
    { name: 'Finance Manager', group: 'Management' },
    { name: 'Sales Manager', group: 'Management' },
    { name: 'Project Manager', group: 'Management' },
    { name: 'Helpdesk Manager', group: 'Management' },
    { name: 'NOC Manager', group: 'Management' },
    { name: 'Engineer', group: 'Operations' },
    { name: 'Junior Engineer', group: 'Operations' },
    { name: 'Warehouse', group: 'Operations' },
    { name: 'Purchasing', group: 'Operations' },
    { name: 'Finance Staff', group: 'Operations' },
    { name: 'HR Staff', group: 'Operations' },
    { name: 'Customer', group: 'Customer' },
    { name: 'Vendor', group: 'Vendor' },
    { name: 'System Admin', group: 'System', isSystem: true },
  ];

  for (const r of rolesToCreate) {
    const exists = await db.select().from(roles).where(eq(roles.name, r.name));
    if (exists.length === 0) {
      const groupId = getGroupId(r.group);
      if (groupId) {
        await db.insert(roles).values({
          id: uuidv4(),
          name: r.name,
          groupId,
          isSystem: r.isSystem || false,
        });
      }
    }
  }

  // 4. Permissions Matrix
  const actions = ['View', 'Create', 'Update', 'Delete', 'Approve', 'Export', 'Import', 'Print', 'Audit', 'Restore', 'Archive'];
  const modules = ['Dashboard', 'CRM', 'Sales', 'Purchase', 'Inventory', 'Asset', 'Project', 'Helpdesk', 'Finance', 'HR', 'Knowledge Base', 'Document', 'BI', 'Settings'];

  for (const mod of modules) {
    for (const act of actions) {
      // Create if not exist
      const pName = `${act}_${mod}`.toUpperCase().replace(/\s+/g, '_');
      const exists = await db.select().from(permissions).where(eq(permissions.name, pName));
      if (exists.length === 0) {
        await db.insert(permissions).values({
          id: uuidv4(),
          module: mod,
          action: act,
          name: pName,
        });
      }
    }
  }

  // Assign System Admin all permissions & menus
  const sysAdmin = await db.select().from(roles).where(eq(roles.name, 'System Admin'));
  if (sysAdmin.length > 0) {
    const adminId = sysAdmin[0].id;
    const allPerms = await db.select().from(permissions);
    const existingPerms = await db.select().from(rolePermissions).where(eq(rolePermissions.roleId, adminId));
    
    for (const p of allPerms) {
      if (!existingPerms.find(ep => ep.permissionId === p.id)) {
        await db.insert(rolePermissions).values({ id: uuidv4(), roleId: adminId, permissionId: p.id });
      }
    }

    const existingMenus = await db.select().from(menuPermissions).where(eq(menuPermissions.roleId, adminId));
    for (const m of modules) {
      if (!existingMenus.find(em => em.menu === m)) {
        await db.insert(menuPermissions).values({ id: uuidv4(), roleId: adminId, menu: m });
      }
    }
    
    // Assign sys admin role to the initial admin user if any
    const firstUser = await db.select().from(users).limit(1);
    if (firstUser.length > 0) {
      const uRoles = await db.select().from(userRoles).where(eq(userRoles.userId, firstUser[0].id));
      if (uRoles.length === 0) {
         await db.insert(userRoles).values({ id: uuidv4(), userId: firstUser[0].id, roleId: adminId });
      }
    }
  }

  console.log('RBAC Seeding Complete.');
}

seedRBAC().catch(console.error).then(() => process.exit(0));
