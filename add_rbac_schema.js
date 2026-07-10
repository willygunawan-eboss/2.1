import fs from 'fs';
let schemaCode = fs.readFileSync('src/db/schema.ts', 'utf8');

const rbacTables = `
// --- ENTERPRISE RBAC & PERMISSION ENGINE ---
export const roleGroups = sqliteTable('role_groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const roles = sqliteTable('roles', {
  id: text('id').primaryKey(),
  groupId: text('group_id').notNull().references(() => roleGroups.id),
  name: text('name').notNull().unique(),
  description: text('description'),
  isSystem: integer('is_system', { mode: 'boolean' }).default(false),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const permissions = sqliteTable('permissions', {
  id: text('id').primaryKey(),
  module: text('module').notNull(), // e.g., Dashboard, Ticket, Invoice
  action: text('action').notNull(), // e.g., View, Create, Update, Delete, Approve
  name: text('name').notNull(),
  description: text('description'),
  isSystem: integer('is_system', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
});

export const rolePermissions = sqliteTable('role_permissions', {
  id: text('id').primaryKey(),
  roleId: text('role_id').notNull().references(() => roles.id),
  permissionId: text('permission_id').notNull().references(() => permissions.id),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  createdBy: text('created_by'),
});

export const userRoles = sqliteTable('user_roles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  roleId: text('role_id').notNull().references(() => roles.id),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  createdBy: text('created_by'),
});

export const dataScopes = sqliteTable('data_scopes', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(), // e.g., Self, Department, Division, Branch, Company, Global
  description: text('description'),
  level: integer('level').notNull(), // lower means more restricted
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
});

export const roleDataScopes = sqliteTable('role_data_scopes', {
  id: text('id').primaryKey(),
  roleId: text('role_id').notNull().references(() => roles.id),
  module: text('module').notNull(),
  scopeId: text('scope_id').notNull().references(() => dataScopes.id),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
});

export const menuPermissions = sqliteTable('menu_permissions', {
  id: text('id').primaryKey(),
  roleId: text('role_id').notNull().references(() => roles.id),
  menu: text('menu').notNull(), // e.g., Dashboard, CRM, Sales, etc.
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
});

export const approvalLevels = sqliteTable('approval_levels', {
  id: text('id').primaryKey(),
  module: text('module').notNull(), // e.g., Purchase, Invoice
  minAmount: integer('min_amount').notNull(),
  maxAmount: integer('max_amount'),
  roleId: text('role_id').notNull().references(() => roles.id),
  levelOrder: integer('level_order').notNull(),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
});

export const auditPermissions = sqliteTable('audit_permissions', {
  id: text('id').primaryKey(),
  action: text('action').notNull(), // e.g., GRANT_PERMISSION, REVOKE_PERMISSION, CHANGE_APPROVAL
  entityType: text('entity_type').notNull(), // e.g., Role, ApprovalLevel
  entityId: text('entity_id').notNull(),
  details: text('details'), // JSON string
  performedBy: text('performed_by').notNull().references(() => users.id),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
});

// RBAC Relations
export const roleGroupsRelations = relations(roleGroups, ({ many }) => ({
  roles: many(roles),
}));

export const rolesRelations = relations(roles, ({ one, many }) => ({
  group: one(roleGroups, { fields: [roles.groupId], references: [roleGroups.id] }),
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
  menuPermissions: many(menuPermissions),
  roleDataScopes: many(roleDataScopes),
  approvalLevels: many(approvalLevels),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, { fields: [rolePermissions.permissionId], references: [permissions.id] }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const dataScopesRelations = relations(dataScopes, ({ many }) => ({
  roleDataScopes: many(roleDataScopes),
}));

export const roleDataScopesRelations = relations(roleDataScopes, ({ one }) => ({
  role: one(roles, { fields: [roleDataScopes.roleId], references: [roles.id] }),
  scope: one(dataScopes, { fields: [roleDataScopes.scopeId], references: [dataScopes.id] }),
}));

export const menuPermissionsRelations = relations(menuPermissions, ({ one }) => ({
  role: one(roles, { fields: [menuPermissions.roleId], references: [roles.id] }),
}));

export const approvalLevelsRelations = relations(approvalLevels, ({ one }) => ({
  role: one(roles, { fields: [approvalLevels.roleId], references: [roles.id] }),
}));

`;

schemaCode = schemaCode + "\n" + rbacTables;
fs.writeFileSync('src/db/schema.ts', schemaCode);
