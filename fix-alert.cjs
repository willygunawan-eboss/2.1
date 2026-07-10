const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

content = content.replace("alert('Failed to add employee: ' + (data.error || 'Unknown error'));", "alert('Failed to add employee: ' + (data.message || data.error || 'Unknown error'));");

fs.writeFileSync('src/components/HRView.tsx', content);
