import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace("app.get(\"/api/system/health\", async (req, res) => {", "app.get(\"/api/system/health\", async (req, res) => {\nconsole.log('HIT HEALTH ROUTE');");
fs.writeFileSync('server.ts', code);
