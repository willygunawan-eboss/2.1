const fs = require('fs');
let content = fs.readFileSync('src/components/AssetView.tsx', 'utf8');

// 1. Add useEmployees to import
content = content.replace("import { Search, Filter", "import { useEmployees } from '../data';\nimport { Search, Filter");

// 2. Change Asset interface to include assigned fields
content = content.replace("  lastModifiedAt?: string;\n}", "  lastModifiedAt?: string;\n  assignedTo?: string;\n  assignedEmployeeName?: string;\n}");

// 3. Inside AssetView, set up useEmployees and fetch API
const stateMarker = `  const [assets, setAssets] = useState<Asset[]>([\n    { id: '1', assetId: 'AST-001', name: 'MacBook Pro 16"', category: 'Hardware', purchaseDate: '2023-11-15', currentValue: 2500, status: 'Active' },\n    { id: '2', assetId: 'AST-002', name: 'Dell UltraSharp 32"', category: 'Hardware', purchaseDate: '2024-01-10', currentValue: 800, status: 'Active' },\n    { id: '3', assetId: 'AST-003', name: 'Office Chair', category: 'Furniture', purchaseDate: '2023-05-20', currentValue: 300, status: 'Maintenance' },\n    { id: '4', assetId: 'AST-004', name: 'Conference Table', category: 'Furniture', purchaseDate: '2022-08-11', currentValue: 1200, status: 'Active' },\n  ]);`;

const newStates = `  const [assets, setAssets] = useState<Asset[]>([]);
  const { data: employees } = useEmployees();

  React.useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/assets');
      if (res.ok) {
        const json = await res.json();
        setAssets(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };`;

content = content.replace(stateMarker, newStates);

// 4. Update the Initial Value input in the Create Asset form (add pl-10)
const initialValMarkerCreate = `className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                      placeholder="2000"`;
const initialValNewCreate = `className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                      placeholder="2000"`;
content = content.replace(initialValMarkerCreate, initialValNewCreate);

// 5. Change "Initial Value (Rp )" to "Initial Value (Rp)"
content = content.replace(/Initial Value \(Rp \)/g, "Initial Value (Rp)");

// 6. Update the Initial Value input in the Edit Asset form (add pl-10) -> Actually the code already says pl-10 for Edit Asset! Let me check... Ah, edit form has:
// className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
// So edit form is already fine for spacing, but I should check the Create Form again.

// 7. Add assigned to employee select in both forms.
// In Create form:
const createStatusMarker = `<div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Status</label>`;
                  
const createAssignedField = `<div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Assigned To (Employee)</label>
                  <div className="relative">
                    <select 
                      value={formData.assignedTo || ''}
                      onChange={(e) => {
                        const emp = employees.find((emp: any) => emp.id === e.target.value);
                        setFormData({...formData, assignedTo: e.target.value, assignedEmployeeName: emp ? emp.name : ''});
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

content = content.replace(createStatusMarker, createAssignedField);

// In Edit form:
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

content = content.replace(editStatusMarker, editAssignedField);

// 8. Update Table header and rows to show "Assigned To"
content = content.replace(`<th className="px-5 py-4 text-left">Status</th>`, `<th className="px-5 py-4 text-left">Assigned To</th><th className="px-5 py-4 text-left">Status</th>`);

content = content.replace(
`<td className="px-5 py-4 whitespace-nowrap">
                        <span className={\`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium \${
                          asset.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          asset.status === 'Maintenance' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }\`}>
                          {asset.status}
                        </span>
                      </td>`,
`<td className="px-5 py-4">
                        <div className="text-sm font-medium text-slate-900">{asset.assignedEmployeeName || '-'}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={\`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium \${
                          asset.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          asset.status === 'Maintenance' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }\`}>
                          {asset.status}
                        </span>
                      </td>`
);

// 9. Update PDF export
const pdfHeaderMarker = `const tableColumn = ["Asset ID", "Name", "Category", "Purchase Date", "Status", "Value (Rp )"];`;
const pdfHeaderNew = `const tableColumn = ["Asset ID", "Name", "Category", "Purchase Date", "Assigned To", "Status", "Value (Rp)"];`;
content = content.replace(pdfHeaderMarker, pdfHeaderNew);

const pdfRowMarker = `const tableRows = filteredAssets.map(asset => [
      asset.assetId,
      asset.name,
      asset.category,
      asset.purchaseDate,
      asset.status,
      asset.currentValue.toString()
    ]);`;
const pdfRowNew = `const tableRows = filteredAssets.map(asset => [
      asset.assetId,
      asset.name,
      asset.category,
      asset.purchaseDate,
      asset.assignedEmployeeName || '-',
      asset.status,
      asset.currentValue.toString()
    ]);`;
content = content.replace(pdfRowMarker, pdfRowNew);

// 10. Update Excel export
const excelObjMarker = `'Purchase Date': asset.purchaseDate,
      'Status': asset.status,
      'Current Value (Rp )': asset.currentValue`;
const excelObjNew = `'Purchase Date': asset.purchaseDate,
      'Assigned To': asset.assignedEmployeeName || '-',
      'Status': asset.status,
      'Current Value (Rp)': asset.currentValue`;
content = content.replace(excelObjMarker, excelObjNew);

const excelWidthMarker = `{ wch: 15 }, // Purchase Date
      { wch: 15 }, // Status`;
const excelWidthNew = `{ wch: 15 }, // Purchase Date
      { wch: 25 }, // Assigned To
      { wch: 15 }, // Status`;
content = content.replace(excelWidthMarker, excelWidthNew);

// 11. Fix handleSubmit and handleEditSubmit to use API
content = content.replace(`const newAsset: Asset = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      currentValue: parseFloat(formData.currentValue) || 0
    };

    setAssets([...assets, newAsset]);
    setIsFormOpen(false);
    setFormData({`, 
`const newAsset = {
      ...formData,
      id: 'AST-' + Date.now(),
      currentValue: parseFloat(formData.currentValue) || 0
    };

    fetch('/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAsset)
    }).then(res => {
      if (res.ok) fetchAssets();
    });

    setIsFormOpen(false);
    setFormData({`);

content = content.replace(`const updatedAssets = assets.map(asset => 
      asset.id === editingAsset.id ? editingAsset : asset
    );
    setAssets(updatedAssets);
    setIsEditFormOpen(false);`,
`fetch(\`/api/assets/\${editingAsset.id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingAsset)
    }).then(res => {
      if (res.ok) fetchAssets();
    });
    setIsEditFormOpen(false);`);
    

fs.writeFileSync('src/components/AssetView.tsx', content);
