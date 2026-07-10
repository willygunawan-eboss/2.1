const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/secure: process\.env\.NODE_ENV === 'production'/g, 'secure: process.env.NODE_ENV === "production" /* require https */');
content = content.replace(/sameSite: 'strict'/g, "sameSite: 'lax'");

fs.writeFileSync('server.ts', content);
