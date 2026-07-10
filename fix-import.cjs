const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

if (!content.includes('EmployeeDetailModal')) {
    console.log("No mention of EmployeeDetailModal");
} else if (!content.includes('import { EmployeeDetailModal }')) {
    content = content.replace("import { cn } from '../lib/utils';", "import { cn } from '../lib/utils';\nimport { EmployeeDetailModal } from './EmployeeDetailModal';");
    fs.writeFileSync('src/components/HRView.tsx', content);
    console.log("Fixed import");
} else {
    console.log("Already fixed");
}
