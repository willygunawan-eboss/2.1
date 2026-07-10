const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

const targetFunction = `function EmployeeDirectoryTab() {
  const { data: employees } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  return (
    <>
      {selectedEmployee && <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
    <div className="space-y-6">`;

content = content.replace(`function EmployeeDirectoryTab() {
  const { data: employees } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  return (
    <>
      {selectedEmployee && <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
      <div className="space-y-6">`, targetFunction);

const endFunction = `            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}`;

content = content.replace(`            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

`, endFunction + "\n\n");

fs.writeFileSync('src/components/HRView.tsx', content);
