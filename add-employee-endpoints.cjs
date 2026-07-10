const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
  const employeeRelatedTables = [
    { path: 'contracts', schema: schema.employeeContracts },
    { path: 'families', schema: schema.employeeFamilies },
    { path: 'emergency-contacts', schema: schema.employeeEmergencyContacts },
    { path: 'banks', schema: schema.employeeBanks },
    { path: 'taxes', schema: schema.employeeTaxes },
    { path: 'bpjs', schema: schema.employeeBpjs },
    { path: 'position-histories', schema: schema.employeePositionHistories },
    { path: 'salary-histories', schema: schema.employeeSalaryHistories },
    { path: 'promotion-histories', schema: schema.employeePromotionHistories },
    { path: 'leaves', schema: schema.employeeLeaves },
    { path: 'overtimes', schema: schema.employeeOvertimes },
    { path: 'assets', schema: schema.employeeAssets },
    { path: 'trainings', schema: schema.employeeTrainings },
    { path: 'performances', schema: schema.employeePerformances },
    { path: 'documents', schema: schema.employeeDocuments },
    { path: 'shifts', schema: schema.employeeShifts },
  ];

  employeeRelatedTables.forEach(({ path, schema: tableSchema }) => {
    app.get(\`/api/employees/:id/\${path}\`, async (req, res) => {
      try {
        const data = await db.select().from(tableSchema).where(eq(tableSchema.employeeId, req.params.id));
        res.json({ success: true, data });
      } catch (e) {
        res.status(500).json({ success: false, error: String(e) });
      }
    });

    app.post(\`/api/employees/:id/\${path}\`, async (req, res) => {
      try {
        await db.insert(tableSchema).values({ id: path.substring(0,3).toUpperCase() + '-' + Date.now(), employeeId: req.params.id, ...req.body });
        res.json({ success: true });
      } catch (e) {
        res.status(500).json({ success: false, error: String(e) });
      }
    });
  });
`;

if (!content.includes('employeeRelatedTables')) {
  content = content.replace('// --- Seed Database ---', endpoints + '\n  // --- Seed Database ---');
  fs.writeFileSync('server.ts', content);
}
