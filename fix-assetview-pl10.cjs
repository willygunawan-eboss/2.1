const fs = require('fs');
let content = fs.readFileSync('src/components/AssetView.tsx', 'utf8');

const createFormMatch = content.match(/onSubmit=\{handleCreateSubmit\}([\s\S]*?)<\/form>/);
if (createFormMatch) {
  let createForm = createFormMatch[1];
  createForm = createForm.replace(/editingAsset\.assignedTo/g, 'formData.assignedTo');
  createForm = createForm.replace(/setEditingAsset\(\{\.\.\.editingAsset/g, 'setFormData({...formData');
  content = content.replace(createFormMatch[1], createForm);
}

fs.writeFileSync('src/components/AssetView.tsx', content);
