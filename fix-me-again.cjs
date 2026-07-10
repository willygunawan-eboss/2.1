const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldMe = `app.get('/api/auth/me', (req, res) => {
  if (req.user) return res.json({ success: true, user: req.user });
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (e) {
    res.status(401).json({ success: false, message: 'Token invalid' });
  }
});`;

const newMe = `app.get('/api/auth/me', (req, res) => {
  if (req.user) return res.json({ success: true, user: req.user });
  res.status(401).json({ success: false, message: 'Not authenticated' });
});`;

content = content.replace(oldMe, newMe);
fs.writeFileSync('server.ts', content);
