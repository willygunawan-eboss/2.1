import fs from 'fs';
const file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `export const employees = sqliteTable('employees', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  department: text('department').notNull(),
  status: text('status').notNull(), // Active, On Leave, Terminated
  joinDate: text('join_date').notNull(),
  email: text('email').notNull(),
  avatar: text('avatar'),
});`;

const newEmployees = `export const companies = sqliteTable('companies', {
  id: text('id').primaryKey(), // UUID
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const branches = sqliteTable('branches', {
  id: text('id').primaryKey(), // UUID
  companyId: text('company_id').notNull().references(() => companies.id),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  address: text('address'),
  phone: text('phone'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const divisions = sqliteTable('divisions', {
  id: text('id').primaryKey(), // UUID
  companyId: text('company_id').notNull().references(() => companies.id),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const departments = sqliteTable('departments', {
  id: text('id').primaryKey(), // UUID
  divisionId: text('division_id').notNull().references(() => divisions.id),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const jobGrades = sqliteTable('job_grades', {
  id: text('id').primaryKey(), // UUID
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  level: integer('level').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const positions = sqliteTable('positions', {
  id: text('id').primaryKey(), // UUID
  departmentId: text('department_id').notNull().references(() => departments.id),
  jobGradeId: text('job_grade_id').notNull().references(() => jobGrades.id),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const employees = sqliteTable('employees', {
  id: text('id').primaryKey(), // UUID
  employeeNumber: text('employee_number').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  companyId: text('company_id').references(() => companies.id),
  branchId: text('branch_id').references(() => branches.id),
  departmentId: text('department_id').references(() => departments.id),
  positionId: text('position_id').references(() => positions.id),
  status: text('status').notNull().default('Active'),
  joinDate: text('join_date'),
  avatar: text('avatar'),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  branches: many(branches),
  divisions: many(divisions),
  employees: many(employees),
}));

export const branchesRelations = relations(branches, ({ one, many }) => ({
  company: one(companies, { fields: [branches.companyId], references: [companies.id] }),
  employees: many(employees),
}));

export const divisionsRelations = relations(divisions, ({ one, many }) => ({
  company: one(companies, { fields: [divisions.companyId], references: [companies.id] }),
  departments: many(departments),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  division: one(divisions, { fields: [departments.divisionId], references: [divisions.id] }),
  positions: many(positions),
  employees: many(employees),
}));

export const jobGradesRelations = relations(jobGrades, ({ many }) => ({
  positions: many(positions),
}));

export const positionsRelations = relations(positions, ({ one, many }) => ({
  department: one(departments, { fields: [positions.departmentId], references: [departments.id] }),
  jobGrade: one(jobGrades, { fields: [positions.jobGradeId], references: [jobGrades.id] }),
  employees: many(employees),
}));

export const employeesRelations = relations(employees, ({ one }) => ({
  company: one(companies, { fields: [employees.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [employees.branchId], references: [branches.id] }),
  department: one(departments, { fields: [employees.departmentId], references: [departments.id] }),
  position: one(positions, { fields: [employees.positionId], references: [positions.id] }),
}));
`;

code = code.replace(target, newEmployees);
fs.writeFileSync(file, code);
