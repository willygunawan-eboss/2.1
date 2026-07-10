import fs from 'fs';
let code = fs.readFileSync('src/middleware/rbac-engine.ts', 'utf8');
code = code.replace("let rbacCache: {", "export let rbacCache: {");
fs.writeFileSync('src/middleware/rbac-engine.ts', code);
