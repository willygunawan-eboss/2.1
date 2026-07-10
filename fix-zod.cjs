const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/e\.errors\[0\]\.message/g, 'e.issues[0].message');
fs.writeFileSync('server.ts', content);
