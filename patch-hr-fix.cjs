const fs = require('fs');
let code = fs.readFileSync('src/components/HRView.tsx', 'utf-8');

// Fix the joinDate input to have a name attribute
code = code.replace(/<input required type="date" className="w-full/, '<input required type="date" name="joinDate" className="w-full');

// Fix the onSubmit handler to use form values and show exact error
code = code.replace(/const newEmployee = \{[\s\S]*?avatar: ''\s*\};/, `
                  const newEmployee = {
                    id: formData.get('id'),
                    name: formData.get('name'),
                    role: formData.get('role'),
                    department: formData.get('department'),
                    email: formData.get('email'),
                    status: 'Active',
                    joinDate: formData.get('joinDate') || new Date().toISOString().split('T')[0],
                    avatar: ''
                  };
`);

code = code.replace(/alert\('Failed to add employee'\);/, `
                      const data = await res.json();
                      alert('Failed to add employee: ' + (data.error || 'Unknown error'));
`);

fs.writeFileSync('src/components/HRView.tsx', code);
