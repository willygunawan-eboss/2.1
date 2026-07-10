import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace("if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health'].includes(req.path)) return next();", "if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health', '/api/system/health'].includes(req.path)) return next();");
fs.writeFileSync('server.ts', code);
