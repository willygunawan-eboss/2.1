import fs from 'fs';
let code = fs.readFileSync('src/routes/orgRoutes.ts', 'utf8');

const validationLogic = `
  // Validation Interceptor
  router.post(\`/\${path}\`, async (req, res, next) => {
    try {
      if (path === 'employees') {
        const comp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
        if (!comp.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Company terlebih dahulu di menu Organization.' }] });
        const branch = await db.select({ id: schema.branches.id }).from(schema.branches).limit(1);
        if (!branch.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Branch terlebih dahulu.' }] });
        const dept = await db.select({ id: schema.departments.id }).from(schema.departments).limit(1);
        if (!dept.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Department terlebih dahulu.' }] });
        const pos = await db.select({ id: schema.positions.id }).from(schema.positions).limit(1);
        if (!pos.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Position terlebih dahulu.' }] });
      } else if (path === 'branches') {
        const comp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
        if (!comp.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Company terlebih dahulu.' }] });
      } else if (path === 'departments') {
        const comp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
        if (!comp.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Company terlebih dahulu.' }] });
      } else if (path === 'positions') {
        const dept = await db.select({ id: schema.departments.id }).from(schema.departments).limit(1);
        if (!dept.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Department terlebih dahulu.' }] });
      }
      next();
    } catch (e) {
      res.status(500).json({ success: false, message: String(e) });
    }
  });

  // Create
`;

if (!code.includes('Validation Interceptor')) {
  code = code.replace("  // Create", validationLogic);
  fs.writeFileSync('src/routes/orgRoutes.ts', code);
}
