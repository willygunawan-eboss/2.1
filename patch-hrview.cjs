const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

if (!content.includes('EmployeeDetailModal')) {
  // 1. Add import
  content = content.replace(
    "import { Users, Briefcase, Calendar, Clock, DollarSign, Download, Filter, Search, Plus, X } from 'lucide-react';",
    "import { Users, Briefcase, Calendar, Clock, DollarSign, Download, Filter, Search, Plus, X } from 'lucide-react';\nimport { EmployeeDetailModal } from './EmployeeDetailModal';"
  );

  // 2. Add state to EmployeeDirectoryTab
  const tabFind = `function EmployeeDirectoryTab() {\n  const { data: employees } = useEmployees();\n  return (`;
  const tabReplace = `function EmployeeDirectoryTab() {\n  const { data: employees } = useEmployees();\n  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);\n  return (\n    <>\n      {selectedEmployee && <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}`;
  content = content.replace(tabFind, tabReplace);
  // close fragment at the end of EmployeeDirectoryTab
  content = content.replace(`</div>\n    </div>\n  );\n}\n`, `</div>\n    </div>\n    </>\n  );\n}\n`);

  // 3. Make row clickable
  const rowFind = `<tr key={record.id} className="hover:bg-slate-50/50 transition-colors">`;
  const rowReplace = `<tr key={record.id} onClick={() => setSelectedEmployee(record)} className="hover:bg-slate-50/50 transition-colors cursor-pointer">`;
  content = content.replace(rowFind, rowReplace);

  fs.writeFileSync('src/components/HRView.tsx', content);
}
