import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

// Remove the direct POST /api/system/bootstrap
const bootstrapApiRegex = /app\.post\("\/api\/system\/bootstrap", async \(req, res\) => \{[\s\S]*?return res\.status\(400\)\.json\(\{ success: false, message: 'Invalid step' \}\);\n    \} catch \(e\) \{\n      console\.error\('Bootstrap Error:', e\);\n      res\.status\(500\)\.json\(\{ success: false, message: String\(e\) \}\);\n    \}\n  \}\);\n/g;

code = code.replace(bootstrapApiRegex, '');

// Add GET /api/bootstrap/status
const bootstrapStatusApi = `
  app.get("/api/bootstrap/status", async (req, res) => {
    try {
      const companies = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
      const branches = await db.select({ id: schema.branches.id }).from(schema.branches).limit(1);
      const departments = await db.select({ id: schema.departments.id }).from(schema.departments).limit(1);
      const positions = await db.select({ id: schema.positions.id }).from(schema.positions).limit(1);
      const roles = await db.select({ id: schema.roles.id }).from(schema.roles).limit(1);
      const refs = await db.select({ id: schema.referenceGroups.id }).from(schema.referenceGroups).limit(1);
      const employeesCount = await db.select({ id: schema.employees.id }).from(schema.employees).limit(1);
      
      const hasCompany = companies.length > 0;
      const hasBranch = branches.length > 0;
      const hasDepartment = departments.length > 0;
      const hasPosition = positions.length > 0;
      const hasRole = roles.length > 0;
      const hasRef = refs.length > 0;
      const hasEmployee = employeesCount.length > 0;
      
      const organizationReady = hasCompany && hasBranch && hasDepartment;
      const employeeReady = hasPosition && hasEmployee;
      const referenceReady = hasRef;
      const rbacReady = hasRole;
      
      const isSystemReady = organizationReady && employeeReady && referenceReady && rbacReady;
      
      let progress = 0;
      if (hasCompany) progress += 15;
      if (hasBranch) progress += 15;
      if (hasDepartment) progress += 15;
      if (hasPosition) progress += 15;
      if (hasRole) progress += 10;
      if (hasRef) progress += 10;
      if (hasEmployee) progress += 20;

      res.json({ 
        success: true,
        data: {
          organizationReady,
          referenceReady,
          rbacReady,
          employeeReady,
          erpReady: isSystemReady,
          progress,
          details: {
            hasCompany,
            hasBranch,
            hasDepartment,
            hasPosition,
            hasRole,
            hasRef,
            hasEmployee
          }
        }
      });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });
`;

if (!code.includes('/api/bootstrap/status')) {
    code = code.replace(
        'app.get("/api/system/health",',
        bootstrapStatusApi + '\n  app.get("/api/system/health",'
    );
}

// Ensure /api/bootstrap/status is whitelisted from auth if needed, or maybe it should be authenticated?
// According to user: "Saat login sebagai SUPER_ADMIN: Jika ERP belum siap, arahkan otomatis ke Bootstrap. Jika ERP sudah siap, langsung masuk Dashboard."
// This implies Bootstrap is accessed after login. So the API doesn't need to bypass auth unless it's called during login, but /api/auth/me can just return user.
// Wait, the auth check is checking token. We'll leave authMiddleware as is since Bootstrap is done after login.

fs.writeFileSync('server.ts', code);
