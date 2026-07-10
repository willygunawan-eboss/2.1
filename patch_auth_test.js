import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const oldMid = "const authMiddleware = async (req, res, next) => {\\n  if (req.path === '/api/system/health') return next();";
const newMid = "const authMiddleware = async (req, res, next) => {\\n  if (req.path.includes('health')) return res.json({ debug_path: req.path, debug_url: req.originalUrl });";

code = code.replace(oldMid, newMid);
fs.writeFileSync('server.ts', code);
