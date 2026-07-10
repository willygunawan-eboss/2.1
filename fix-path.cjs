const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace("app.use('/api', authMiddleware);", "app.use(authMiddleware);");
fs.writeFileSync('server.ts', content);
