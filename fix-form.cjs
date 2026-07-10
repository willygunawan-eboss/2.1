const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

// Update the newEmployee object to include payroll data
const submitRegex = /const newEmployee = \{([\s\S]*?)avatar: \(formData.get\('avatar'\) as string\) \|\| \`https:\/\/api.dicebear.com\/7.x\/avataaars\/svg\?seed=\$\{formData.get\('name'\)\}\`\n                  \};/g;

const newEmployeeStr = `const newEmployee = {
                    id: (formData.get('id') as string),
                    name: (formData.get('name') as string),
                    role: (formData.get('role') as string),
                    department: (formData.get('department') as string),
                    email: (formData.get('email') as string),
                    status: 'Active',
                    joinDate: (formData.get('joinDate') as string) || new Date().toISOString().split('T')[0],
                    avatar: (formData.get('avatar') as string) || \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${formData.get('name')}\`,
                    basicSalary: Number(formData.get('basicSalary')) || 5000000,
                    allowances: Number(formData.get('allowances')) || 1000000,
                    deductions: Number(formData.get('deductions')) || 200000
                  };`;

content = content.replace(submitRegex, newEmployeeStr);

// Add the input fields to the form
const inputRegex = /<div className="grid grid-cols-2 gap-4">\n                  <div className="space-y-1\.5">\n                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Department<\/label>/g;

const additionalInputs = `<div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Basic Salary (Rp)</label>
                    <input type="number" defaultValue={5000000} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" name="basicSalary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Allowances (Rp)</label>
                    <input type="number" defaultValue={1000000} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" name="allowances" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Deductions (Rp)</label>
                    <input type="number" defaultValue={200000} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" name="deductions" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Department</label>`;

content = content.replace(inputRegex, additionalInputs);

fs.writeFileSync('src/components/HRView.tsx', content);
