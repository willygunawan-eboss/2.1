import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  "import { initRBAC } from \"./src/middleware/rbac-engine\";",
  "import { initRBAC, rbacCache } from \"./src/middleware/rbac-engine.js\";"
);
fs.writeFileSync('server.ts', code);
