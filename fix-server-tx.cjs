const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /await db\.transaction\(async \(tx\) => \{([\s\S]*?)\}\);/g;

content = content.replace(regex, (match, p1) => {
  // Replace `await tx.insert` with `tx.insert` and add `.run()`
  let newInner = p1.replace(/await tx\.insert\((.*?)\)\.values\((.*?)\);/g, 'tx.insert($1).values($2).run();');
  return `db.transaction((tx) => {${newInner}});`;
});

fs.writeFileSync('server.ts', content);
