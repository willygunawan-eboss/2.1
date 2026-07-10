import fs from 'fs';
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

// Add employeeCertifications table
const certificationsTable = `
export const employeeCertifications = sqliteTable('employee_certifications', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  certificationName: text('certification_name').notNull(),
  institution: text('institution'),
  issueDate: text('issue_date'),
  expiryDate: text('expiry_date'),
  credentialId: text('credential_id'),
});
`;

code = code.replace("export const employeeTrainings", certificationsTable + "\nexport const employeeTrainings");

// Find employeesRelations and replace it
const oldEmployeesRelations = `export const employeesRelations = relations(employees, ({ one }) => ({
  company: one(companies, { fields: [employees.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [employees.branchId], references: [branches.id] }),
  department: one(departments, { fields: [employees.departmentId], references: [departments.id] }),
  position: one(positions, { fields: [employees.positionId], references: [positions.id] }),
}));`;

const newEmployeesRelations = `export const employeesRelations = relations(employees, ({ one, many }) => ({
  company: one(companies, { fields: [employees.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [employees.branchId], references: [branches.id] }),
  department: one(departments, { fields: [employees.departmentId], references: [departments.id] }),
  position: one(positions, { fields: [employees.positionId], references: [positions.id] }),
  
  contracts: many(employeeContracts),
  leaves: many(employeeLeaves),
  attendance: many(attendance),
  assetAssignments: many(assetAssignments, { relationName: 'employeeAssignments' }),
  certifications: many(employeeCertifications),
  trainings: many(employeeTrainings),
  performances: many(employeePerformances),
  documents: many(employeeDocuments),
}));

export const employeeContractsRelations = relations(employeeContracts, ({ one }) => ({
  employee: one(employees, { fields: [employeeContracts.employeeId], references: [employees.id] })
}));
export const employeeLeavesRelations = relations(employeeLeaves, ({ one }) => ({
  employee: one(employees, { fields: [employeeLeaves.employeeId], references: [employees.id] })
}));
export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, { fields: [attendance.employeeId], references: [employees.id] })
}));
export const employeeCertificationsRelations = relations(employeeCertifications, ({ one }) => ({
  employee: one(employees, { fields: [employeeCertifications.employeeId], references: [employees.id] })
}));
export const employeeTrainingsRelations = relations(employeeTrainings, ({ one }) => ({
  employee: one(employees, { fields: [employeeTrainings.employeeId], references: [employees.id] })
}));
export const employeePerformancesRelations = relations(employeePerformances, ({ one }) => ({
  employee: one(employees, { fields: [employeePerformances.employeeId], references: [employees.id] })
}));
export const employeeDocumentsRelations = relations(employeeDocuments, ({ one }) => ({
  employee: one(employees, { fields: [employeeDocuments.employeeId], references: [employees.id] })
}));
`;

code = code.replace(oldEmployeesRelations, newEmployeesRelations);

// We also need to fix assetAssignments relation to have relationName if it doesn't match
code = code.replace(
  "assignee: one(employees, { fields: [assetAssignments.assignedToId], references: [employees.id] })",
  "assignee: one(employees, { fields: [assetAssignments.assignedToId], references: [employees.id], relationName: 'employeeAssignments' })"
);

fs.writeFileSync('src/db/schema.ts', code);
