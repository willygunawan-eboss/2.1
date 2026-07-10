import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const bootstrapApi = `
  app.post("/api/system/bootstrap", async (req, res) => {
    try {
      const { step, data } = req.body;
      const adminUserId = req.user?.id;
      
      if (step === 1) { // Company
        const compId = crypto.randomUUID();
        await db.insert(schema.companies).values({ id: compId, code: data.code, name: data.name, email: data.email, createdBy: 'admin' });
        return res.json({ success: true, data: { id: compId } });
      }
      
      if (step === 2) { // Branch
        let comp = await db.select().from(schema.companies).limit(1);
        if (!comp.length) return res.status(400).json({ success: false, message: 'Company not found' });
        const branchId = crypto.randomUUID();
        await db.insert(schema.branches).values({ id: branchId, companyId: comp[0].id, code: data.code, name: data.name, createdBy: 'admin' });
        return res.json({ success: true, data: { id: branchId } });
      }
      
      if (step === 3) { // Department
        let comp = await db.select().from(schema.companies).limit(1);
        let div = await db.select().from(schema.divisions).limit(1);
        let divId = div[0]?.id;
        if (!divId) {
          divId = crypto.randomUUID();
          await db.insert(schema.divisions).values({ id: divId, companyId: comp[0].id, code: 'DIV-01', name: 'Main Division', createdBy: 'admin' });
        }
        const deptId = crypto.randomUUID();
        await db.insert(schema.departments).values({ id: deptId, divisionId: divId, code: data.code, name: data.name, createdBy: 'admin' });
        return res.json({ success: true, data: { id: deptId } });
      }
      
      if (step === 4) { // Position
        let dept = await db.select().from(schema.departments).limit(1);
        let jg = await db.select().from(schema.jobGrades).limit(1);
        let jgId = jg[0]?.id;
        if (!jgId) {
          jgId = crypto.randomUUID();
          await db.insert(schema.jobGrades).values({ id: jgId, code: 'JG-1', name: 'Staff', level: 1 });
        }
        const posId = crypto.randomUUID();
        await db.insert(schema.positions).values({ id: posId, departmentId: dept[0].id, jobGradeId: jgId, code: data.code, name: data.name, createdBy: 'admin' });
        return res.json({ success: true, data: { id: posId } });
      }
      
      if (step === 5) { // Employee
        let comp = await db.select().from(schema.companies).limit(1);
        let branch = await db.select().from(schema.branches).limit(1);
        let dept = await db.select().from(schema.departments).limit(1);
        let pos = await db.select().from(schema.positions).limit(1);
        const empId = crypto.randomUUID();
        await db.insert(schema.employees).values({
          id: empId,
          employeeNumber: data.employeeNumber,
          name: data.name,
          email: data.email,
          companyId: comp[0].id,
          branchId: branch[0].id,
          departmentId: dept[0].id,
          positionId: pos[0].id,
          userId: adminUserId, // Link to currently logged in admin user!
          createdBy: 'admin'
        });
        
        // Also let's setup Reference Engine minimums if not exist
        let refGroups = await db.select().from(schema.referenceGroups).limit(1);
        if (refGroups.length === 0) {
           const refGroupId = crypto.randomUUID();
           await db.insert(schema.referenceGroups).values({ id: refGroupId, code: 'CURRENCY', name: 'Currency', isSystem: true });
           await db.insert(schema.referenceValues).values({ id: crypto.randomUUID(), groupId: refGroupId, code: 'IDR', value: 'Indonesian Rupiah', isSystem: true });
           await db.insert(schema.referenceValues).values({ id: crypto.randomUUID(), groupId: refGroupId, code: 'USD', value: 'US Dollar', isSystem: true });
        }

        return res.json({ success: true, data: { id: empId } });
      }

      return res.status(400).json({ success: false, message: 'Invalid step' });
    } catch (e) {
      console.error('Bootstrap Error:', e);
      res.status(500).json({ success: false, message: String(e) });
    }
  });
`;

if (!code.includes('/api/system/bootstrap')) {
  code = code.replace(
    'app.get("/api/system/health",',
    bootstrapApi + '\n  app.get("/api/system/health",'
  );
  fs.writeFileSync('server.ts', code);
}
