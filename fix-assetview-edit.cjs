const fs = require('fs');
let content = fs.readFileSync('src/components/AssetView.tsx', 'utf8');

const editFormMatch = content.match(/onSubmit=\{handleEditSubmit\}([\s\S]*?)<\/form>/);
if (editFormMatch) {
  let editForm = editFormMatch[1];
  
  if (!editForm.includes('Assigned To (Employee)')) {
    const editStatusMarker = `<div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Status</label>`;
                
    const editAssignedField = `<div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Assigned To (Employee)</label>
                <div className="relative">
                  <select 
                    value={editingAsset.assignedTo || ''}
                    onChange={(e) => {
                      const emp = employees.find((emp: any) => emp.id === e.target.value);
                      setEditingAsset({...editingAsset, assignedTo: e.target.value, assignedEmployeeName: emp ? emp.name : ''});
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="">-- Not Assigned --</option>
                    {employees?.map((emp: any) => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Status</label>`;
                
    editForm = editForm.replace(editStatusMarker, editAssignedField);
    content = content.replace(editFormMatch[1], editForm);
  }
}

fs.writeFileSync('src/components/AssetView.tsx', content);
