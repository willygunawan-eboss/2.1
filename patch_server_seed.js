import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const oldSeedRegex = /async function seedDatabase\(\) \{[\s\S]*?\n\nasync function startServer\(\) \{/m;

code = code.replace(oldSeedRegex, `import { runSeeder } from './src/db/seeder.js';\n\nasync function startServer() {`);

code = code.replace(/await seedDatabase\(\);/g, 'await runSeeder();');

fs.writeFileSync('server.ts', code);
