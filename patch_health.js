import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const oldHealthRoute = `  app.get("/api/system/health", async (req, res) => {
console.log('HIT HEALTH ROUTE');
    try {
      const dbStatus = await db.select({ id: schema.dashboardStats.id }).from(schema.dashboardStats).limit(1);
      const isDbOk = dbStatus.length > 0;
      
      res.json({ 
        success: true,
        data: {
          applicationVersion: APP_VERSION,
          buildTime: new Date().toISOString(),
          gitCommit: process.env.GIT_COMMIT || 'unknown',
          databasePath: getDbPath(),
          migrationVersion: 'latest',
          seederVersion: '1.0',
          status: {
            database: isDbOk ? 'OK' : 'ERROR',
            rbac: Object.keys(rbacCache.userRolesList).length > 0 ? 'OK' : 'ERROR',
            reference: 'OK',
            organization: 'OK'
          },
          systemReady: isDbOk
        }
      });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });`;

const newHealthRoute = `  app.get("/api/system/health", async (req, res) => {
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
      
      const orgReady = hasCompany && hasBranch && hasDepartment;
      const hrReady = hasPosition && hasEmployee;
      const refReady = hasRef;
      const rbacReady = hasRole;
      
      const isSystemReady = orgReady && hrReady && refReady && rbacReady;
      
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
          applicationVersion: APP_VERSION,
          buildTime: new Date().toISOString(),
          status: {
            organization: orgReady ? 'OK' : 'PENDING',
            reference: refReady ? 'OK' : 'PENDING',
            rbac: rbacReady ? 'OK' : 'PENDING',
            hr: hrReady ? 'OK' : 'PENDING'
          },
          details: {
            hasCompany,
            hasBranch,
            hasDepartment,
            hasPosition,
            hasRole,
            hasRef,
            hasEmployee
          },
          progress,
          systemReady: isSystemReady
        }
      });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });`;

code = code.replace(oldHealthRoute, newHealthRoute);
fs.writeFileSync('server.ts', code);
