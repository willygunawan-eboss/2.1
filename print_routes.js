import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
const routes = [];
const lines = code.split('\n');
lines.forEach((line, i) => {
  if (line.includes('app.use(') || line.includes('app.get(') || line.includes('app.post(')) {
    routes.push(`${i+1}: ${line.trim()}`);
  }
});
console.log(routes.join('\n'));
