const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const jwtCode = `
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'fallback-refresh-secret';

app.use(cookieParser());

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
    if (result.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const user = result[0];
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
    
    await db.update(schema.users).set({ refreshToken }).where(eq(schema.users.id, user.id));
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.json({ success: true, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' });
    
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as any;
    const result = await db.select().from(schema.users).where(eq(schema.users.id, decoded.id));
    if (result.length === 0 || result[0].refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    
    const user = result[0];
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.json({ success: true });
  } catch (e) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as any;
      await db.update(schema.users).set({ refreshToken: null }).where(eq(schema.users.id, decoded.id));
    }
  } catch(e) {}
  
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (e) {
    res.status(401).json({ success: false, message: 'Token invalid' });
  }
});

const authMiddleware = (req, res, next) => {
  if (req.path.startsWith('/api/auth/') || req.path === '/api/health') return next();
  if (!req.path.startsWith('/api/')) return next(); // Not an API route

  const { token } = req.cookies;
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ success: false, message: 'Token invalid' });
  }
};

app.use('/api', authMiddleware);
`;

content = content.replace('app.use(express.json());', 'app.use(express.json());\n' + jwtCode);

fs.writeFileSync('server.ts', content);
