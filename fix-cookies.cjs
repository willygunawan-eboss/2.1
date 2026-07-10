const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/sameSite: 'lax'/g, "sameSite: 'none'");
content = content.replace(/secure: false \/\* for testing \*\//g, "secure: true");

fs.writeFileSync('server.ts', content);
