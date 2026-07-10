import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
const oldLine = "if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health', '/api/system/health'].includes(req.path)) return next();";
const newLine = "if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'].includes(req.path) || req.path.startsWith('/api/health') || req.path.startsWith('/api/system/health')) return next();";
code = code.replace(oldLine, newLine);
fs.writeFileSync('server.ts', code);
