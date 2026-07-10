import fs from 'fs';
let code = fs.readFileSync('src/components/EmployeesView.tsx', 'utf8');

code = code.replace(
  "import { Search, Filter, Plus, Users } from 'lucide-react';",
  "import { Search, Filter, Plus, Users } from 'lucide-react';\nimport { EmployeeDetailModal } from './EmployeeDetailModal';\nimport { useState, useEffect } from 'react';"
);

// We need to add state and fetch employees
const fetchLogic = `
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(json => {
        if (json.success) setEmployees(json.data);
      });
  }, []);
`;

code = code.replace(
  "export function EmployeesView() {",
  "export function EmployeesView() {\n" + fetchLogic
);

const tbodyOld = `              <tbody className="divide-y divide-slate-100 text-sm">
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No records found. Click "Create New" to get started.
                  </td>
                </tr>
              </tbody>`;

const tbodyNew = `              <tbody className="divide-y divide-slate-100 text-sm">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No records found. Click "Create New" to get started.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp: any) => (
                    <tr 
                      key={emp.id} 
                      onClick={() => setSelectedEmployee(emp)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-blue-600">{emp.employeeNumber || emp.id.substring(0,8)}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{emp.name}</td>
                      <td className="px-6 py-4 text-slate-500">{emp.role || '-'}</td>
                      <td className="px-6 py-4 text-slate-500">{emp.department || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {emp.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>`;

code = code.replace(tbodyOld, tbodyNew);

// Add the modal at the end of the return statement
code = code.replace(
  "    </div>\n  );\n}",
  "    </div>\n    {selectedEmployee && <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}\n  );\n}"
);

fs.writeFileSync('src/components/EmployeesView.tsx', code);
