import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const oldMid = "const authMiddleware = async (req, res, next) => {";
const newMid = "const authMiddleware = async (req, res, next) => {\n  if (req.path === '/api/system/health') return next();";

if (!code.includes("if (req.path === '/api/system/health') return next();")) {
  code = code.replace(oldMid, newMid);
  fs.writeFileSync('server.ts', code);
}
