const fs = require('fs');
let content = fs.readFileSync('src/components/AssetView.tsx', 'utf8');

const createMatch = content.match(/const handleCreateSubmit = \(e: React\.FormEvent\) => \{([\s\S]*?)setAssets\(\[newAsset, \.\.\.assets\]\);/);
if (createMatch) {
  const newCreateFunc = `const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.currentValue) return;

    const newAsset = {
      id: 'AST-' + Date.now(),
      assetId: formData.assetId,
      name: formData.name,
      category: formData.category,
      serialNumber: formData.serialNumber,
      purchaseDate: formData.purchaseDate,
      currentValue: parseFloat(formData.currentValue as string) || 0,
      status: formData.status,
      assignedTo: (formData as any).assignedTo || null,
      assignedEmployeeName: (formData as any).assignedEmployeeName || null,
      lastModifiedBy: currentUser.name,
      lastModifiedAt: new Date().toLocaleString()
    };

    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAsset)
      });
      if (res.ok) {
        fetchAssets();
      }
    } catch (e) {
      console.error(e);
    }`;
    
  content = content.replace(createMatch[0], newCreateFunc);
}

const editMatch = content.match(/const handleEditSubmit = \(e: React\.FormEvent\) => \{([\s\S]*?)setAssets\(updatedAssets\);/);
if (editMatch) {
  const newEditFunc = `const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    
    const updatedAsset = {
      ...editingAsset,
      lastModifiedBy: currentUser.name,
      lastModifiedAt: new Date().toLocaleString()
    };

    try {
      const res = await fetch(\`/api/assets/\${editingAsset.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAsset)
      });
      if (res.ok) {
        fetchAssets();
      }
    } catch (e) {
      console.error(e);
    }`;
    
  content = content.replace(editMatch[0], newEditFunc);
}

// Fix padding for Rp
content = content.replace(/className="w-full pl-10 pr-4 py-2\.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"/g, 'className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"');

fs.writeFileSync('src/components/AssetView.tsx', content);
