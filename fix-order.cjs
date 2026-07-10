const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const middlewareDef = `
const authMiddleware = async (req, res, next) => {
  if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health'].includes(req.path)) return next();
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
      const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET);
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
app.use('/api', authMiddleware);
`;

// Remove existing middleware definition and usage
content = content.replace(/const authMiddleware = async \(req, res, next\) => \{[\s\S]*?\n\};\n/m, '');
content = content.replace("app.use('/api', authMiddleware);\n", '');

// Insert it right after app.use(cookieParser())
content = content.replace('app.use(cookieParser());\n', 'app.use(cookieParser());\n' + middlewareDef + '\n');

fs.writeFileSync('server.ts', content);
