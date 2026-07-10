import fs from 'fs';
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

const startIndex = code.indexOf('export const employeesRelations = relations(employees, ({ one, many }) => ({');
const endIndex = code.indexOf('export const employeeDocumentsRelations = relations(employeeDocuments, ({ one }) => ({\n  employee: one(employees, { fields: [employeeDocuments.employeeId], references: [employees.id] })\n}));') + 'export const employeeDocumentsRelations = relations(employeeDocuments, ({ one }) => ({\n  employee: one(employees, { fields: [employeeDocuments.employeeId], references: [employees.id] })\n}));'.length;

if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
  const block = code.substring(startIndex, endIndex);
  code = code.substring(0, startIndex) + code.substring(endIndex);
  code += "\n// === MOVED RELATIONS ===\n" + block + "\n";
  fs.writeFileSync('src/db/schema.ts', code);
  console.log("Success");
} else {
  console.log("Failed to find block");
}
