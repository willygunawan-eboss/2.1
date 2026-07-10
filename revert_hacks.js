import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

// revert debug_path
code = code.replace(
  "if (req.path.includes('health')) return res.json({ debug_path: req.path, debug_url: req.originalUrl });",
  "if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health', '/api/system/health'].includes(req.path)) return next();"
);

// revert HACKED
code = code.replace("HACKED", "ICHANGEBOSS API is running");

fs.writeFileSync('server.ts', code);
