import fs from 'fs';
let code = fs.readFileSync('src/routes/rbacRoutes.ts', 'utf8');

code = code.replace(
  "import { refreshRBACCache } from '../middleware/rbac-engine';",
  "import { refreshRBACCache, getUserPermissions, getUserRoles, getUserMenus, getUserScope } from '../middleware/rbac-engine.js';"
);

// also remove the require
const requireLine = "  const { getUserPermissions, getUserRoles, getUserMenus, getUserScope } = require('../middleware/rbac-engine');\n";
code = code.replace(requireLine, "");

fs.writeFileSync('src/routes/rbacRoutes.ts', code);
