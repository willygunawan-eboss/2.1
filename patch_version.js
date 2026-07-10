import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const oldCode = `import { createRequire } from 'module';
const customRequire = createRequire(import.meta.url);
const pkg = customRequire('./package.json');
const APP_VERSION = pkg.version || '1.0.0';`;

const newCode = `
let APP_VERSION = '1.0.0';
try {
  const pkgContent = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
  APP_VERSION = JSON.parse(pkgContent).version || '1.0.0';
} catch(e) {
}
`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('server.ts', code);
