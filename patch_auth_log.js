import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace("if (['/api/auth/login'", "console.log('Path:', req.path);\n  if (['/api/auth/login'");
fs.writeFileSync('server.ts', code);
