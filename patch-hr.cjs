const fs = require('fs');
let code = fs.readFileSync('src/components/HRView.tsx', 'utf-8');

// Replace the onSubmit in HRView.tsx
code = code.replace(/onSubmit=\{\(e\) => \{\s*e\.preventDefault\(\);\s*setIsAddEmployeeModalOpen\(false\);\s*\}\}/, `
                onSubmit={async (e) => { 
                  e.preventDefault(); 
                  const formData = new FormData(e.target);
                  const newEmployee = {
                    name: formData.get('name'),
                    role: formData.get('role'),
                    department: formData.get('department'),
                    email: formData.get('email'),
                    status: 'Active',
                    joinDate: new Date().toISOString().split('T')[0],
                    avatar: ''
                  };
                  try {
                    const res = await fetch('/api/employees', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newEmployee)
                    });
                    if (res.ok) {
                      setIsAddEmployeeModalOpen(false);
                      alert('Employee added successfully!');
                    } else {
                      alert('Failed to add employee');
                    }
                  } catch (err) {
                    alert('Error adding employee');
                  }
                }}
`);

// Add name attributes to the inputs
code = code.replace(/placeholder="e.g. Budi Santoso" \/>/, 'placeholder="e.g. Budi Santoso" name="name" />');
code = code.replace(/placeholder="e.g. EMP-100" \/>/, 'placeholder="e.g. EMP-100" name="id" />');
code = code.replace(/placeholder="e.g. budi@company.com" \/>/, 'placeholder="e.g. budi@company.com" name="email" />');
code = code.replace(/<select className="w-full/, '<select name="department" className="w-full');
code = code.replace(/placeholder="e.g. Software Engineer" \/>/, 'placeholder="e.g. Software Engineer" name="role" />');

fs.writeFileSync('src/components/HRView.tsx', code);
