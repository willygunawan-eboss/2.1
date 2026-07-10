const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

content = content.replace('new FormData(e.target)', 'new FormData(e.currentTarget)');
content = content.replace("alert('Error adding employee');", "alert('Error adding employee: ' + String(err)); console.error(err);");

fs.writeFileSync('src/components/HRView.tsx', content);
