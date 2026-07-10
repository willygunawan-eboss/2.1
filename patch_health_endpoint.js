import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const oldHealth = `  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "ICHANGEBOSS API is running", timestamp: new Date().toISOString() });
  });`;

const newHealth = `  app.get("/api/system/health", async (req, res) => {
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
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "ICHANGEBOSS API is running", timestamp: new Date().toISOString() });
  });`;

code = code.replace(oldHealth, newHealth);

if (!code.includes("rbacCache")) {
  code = code.replace("import { refreshRBACCache", "import { rbacCache, refreshRBACCache");
}

fs.writeFileSync('server.ts', code);
