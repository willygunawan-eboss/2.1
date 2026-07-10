import fs from 'fs';
let code = fs.readFileSync('employee-workspace-seed.ts', 'utf8');

const replacement = `
  let employees = await db.select().from(schema.employees).limit(1);
  if (!employees.length) {
    const defaultEmpId = randomUUID();
    await db.insert(schema.employees).values({
      id: defaultEmpId,
      employeeNumber: 'EMP-001',
      name: 'Budi Santoso',
      email: 'budi.s@ichangeboss.co.id',
      status: 'Active',
      joinDate: '2022-01-15'
    });
    employees = await db.select().from(schema.employees).limit(1);
  }
`;

code = code.replace(
  "  const employees = await db.select().from(schema.employees).limit(1);\n  if (!employees.length) {\n    console.log(\"No employees found to seed workspace data.\");\n    process.exit(0);\n  }",
  replacement
);

fs.writeFileSync('employee-workspace-seed.ts', code);
