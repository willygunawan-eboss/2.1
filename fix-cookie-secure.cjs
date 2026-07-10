const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/secure: process\.env\.NODE_ENV === "production" \/\* require https \*\//g, "secure: false /* for testing */");
fs.writeFileSync('server.ts', content);
