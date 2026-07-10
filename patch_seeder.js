import fs from 'fs';
let code = fs.readFileSync('src/db/seeder.ts', 'utf8');

const additionalSeeds = `
  // 7. Ensure Default Division & Job Grade for Bootstrap
  const comp = await db.select().from(schema.companies).limit(1);
  if (comp.length > 0) {
    const div = await db.select().from(schema.divisions).limit(1);
    let defaultDivId = div[0]?.id;
    if (!defaultDivId) {
      defaultDivId = randomUUID();
      await db.insert(schema.divisions).values({
        id: defaultDivId,
        companyId: comp[0].id,
        code: 'DIV-001',
        name: 'Main Division'
      });
    }

    const jg = await db.select().from(schema.jobGrades).limit(1);
    if (jg.length === 0) {
      await db.insert(schema.jobGrades).values({
        id: randomUUID(),
        code: 'JG-1',
        name: 'Staff',
        level: 1
      });
    }
  }
`;

if (!code.includes('Ensure Default Division')) {
  code = code.replace("console.log('[Seeder] Database seed completed.');", additionalSeeds + "\n  console.log('[Seeder] Database seed completed.');");
  fs.writeFileSync('src/db/seeder.ts', code);
}
