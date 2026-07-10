const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

content = content.replace('setIsSubmitting(false); else {', 'else {');
content = content.replace(
  'window.dispatchEvent(new Event(\'refetch-dashboard-stats\'));',
  'window.dispatchEvent(new Event(\'refetch-dashboard-stats\')); setIsSubmitting(false);'
);

fs.writeFileSync('src/components/HRView.tsx', content);
