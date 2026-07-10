import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const appVersionCode = `
import { createRequire } from 'module';
const customRequire = createRequire(import.meta.url);
const pkg = customRequire('../package.json');
const APP_VERSION = pkg.version || '1.0.0';
`;

if (!code.includes('const APP_VERSION')) {
  // insert after imports
  code = code.replace("import { runSeeder } from './src/db/seeder.js';", "import { runSeeder } from './src/db/seeder.js';\n" + appVersionCode);
}

const runDbCode = `
  console.log('=============================================');
  console.log(\`🚀 Starting ICHANGEBOSS ERP \${APP_VERSION}\`);
  console.log(\`📦 Database Path: \${getDbPath()}\`);
  try { runMigrations(); } catch(e) { console.error('Migration failed:', e); }
  try { await runSeeder(); } catch(e) { console.error('Seeder failed:', e); }
  await initRBAC();
  console.log('✅ RBAC Engine Initialized.');
  console.log('=============================================');
`;

if (!code.includes('🚀 Starting ICHANGEBOSS ERP')) {
  code = code.replace("const app = express();", "const app = express();\n" + runDbCode);
}

// Remove the old initRBAC and runSeeder calls at the bottom if they exist
code = code.replace(/await initRBAC\(\);/g, '');
code = code.replace(/await runSeeder\(\);/g, '');

fs.writeFileSync('server.ts', code);
