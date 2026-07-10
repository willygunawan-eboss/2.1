const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const middleware = `
const authMiddleware = async (req, res, next) => {
  if (req.path.startsWith('/api/auth/') || req.path === '/api/health') return next();
  if (!req.path.startsWith('/api/')) return next();

  const { token, refreshToken } = req.cookies;
  
  if (!token && !refreshToken) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (e) {
      // Token invalid or expired, fall through to refresh
    }
  }
  
  if (refreshToken) {
    try {
      const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET) as any;
      const result = await db.select().from(schema.users).where(eq(schema.users.id, decodedRefresh.id));
      if (result.length > 0 && result[0].refreshToken === refreshToken) {
        const user = result[0];
        const newToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
        res.cookie('token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 15 * 60 * 1000 });
        req.user = { id: user.id, username: user.username, role: user.role };
        return next();
      }
    } catch (e) {
      // Refresh token invalid
    }
  }
  
  res.status(401).json({ success: false, message: 'Token invalid' });
};
`;

content = content.replace(/const authMiddleware = \(req, res, next\) => \{[\s\S]*?\n\};\n/m, middleware);

fs.writeFileSync('server.ts', content);
