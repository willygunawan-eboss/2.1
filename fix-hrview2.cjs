const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

content = content.replace(/<\/>\n  \);\n\}/g, "  );\n}");

fs.writeFileSync('src/components/HRView.tsx', content);
