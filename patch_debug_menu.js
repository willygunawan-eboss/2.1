import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace("menu: [],", "menu: getUserMenus(user.id),");

fs.writeFileSync('server.ts', code);
