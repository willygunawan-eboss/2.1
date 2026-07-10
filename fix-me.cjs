const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  "if (req.path.startsWith('/api/auth/') || req.path === '/api/health') return next();",
  "if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health'].includes(req.path)) return next();"
);

content = content.replace(
  "app.get('/api/auth/me', (req, res) => {",
  "app.get('/api/auth/me', (req, res) => {\n  if (req.user) return res.json({ success: true, user: req.user });"
);

fs.writeFileSync('server.ts', content);
