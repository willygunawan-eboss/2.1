import fs from 'fs';
let schemaCode = fs.readFileSync('src/db/schema.ts', 'utf8');

const referenceTables = `
// --- REFERENCE ENGINE ---
export const referenceGroups = sqliteTable('reference_groups', {
  id: text('id').primaryKey(), // UUID
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  sortOrder: integer('sort_order').default(0),
  isSystem: integer('is_system', { mode: 'boolean' }).default(false),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const referenceValues = sqliteTable('reference_values', {
  id: text('id').primaryKey(), // UUID
  groupId: text('group_id').notNull().references(() => referenceGroups.id),
  code: text('code').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color'),
  icon: text('icon'),
  sortOrder: integer('sort_order').default(0),
  metadata: text('metadata'), // JSON
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
  isSystem: integer('is_system', { mode: 'boolean' }).default(false),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const referenceGroupsRelations = relations(referenceGroups, ({ many }) => ({
  values: many(referenceValues),
}));

export const referenceValuesRelations = relations(referenceValues, ({ one }) => ({
  group: one(referenceGroups, {
    fields: [referenceValues.groupId],
    references: [referenceGroups.id],
  }),
}));
`;

schemaCode = schemaCode.replace("// --- ENTERPRISE ITSM (HELPDESK & SUPPORT) SCHEMA ---", referenceTables + "\\n// --- ENTERPRISE ITSM (HELPDESK & SUPPORT) SCHEMA ---");

fs.writeFileSync('src/db/schema.ts', schemaCode);
