const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

content = content.replace('const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);', "const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);\n  const [formError, setFormError] = useState('');\n  const [isSubmitting, setIsSubmitting] = useState(false);");

content = content.replace(
  'onClick={() => setIsAddEmployeeModalOpen(false)}',
  "onClick={() => { setIsAddEmployeeModalOpen(false); setFormError(''); }}"
);

// Second occurrence of closing modal might be the X button
content = content.replace(
  'onClick={() => setIsAddEmployeeModalOpen(false)}',
  "onClick={() => { setIsAddEmployeeModalOpen(false); setFormError(''); }}"
);

content = content.replace(
  '<div className="p-6 overflow-y-auto custom-scrollbar">',
  '<div className="p-6 overflow-y-auto custom-scrollbar">\n              {formError && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200">{formError}</div>}'
);

content = content.replace(
  'onSubmit={async (e) => { \n                  e.preventDefault();',
  "onSubmit={async (e) => { \n                  e.preventDefault();\n                  setFormError('');\n                  setIsSubmitting(true);"
);

content = content.replace(
  "alert('Failed to add employee: ' + (data.message || data.error || 'Unknown error'));",
  "setFormError('Failed to add employee: ' + (data.message || data.error || 'Unknown error'));"
);

content = content.replace(
  "alert('Error adding employee: ' + String(err)); console.error(err);",
  "setFormError('Error adding employee: ' + String(err)); console.error(err);"
);

content = content.replace(
  "alert('Employee added successfully!');",
  ""
);

content = content.replace(
  'type="submit" \n                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"\n                  >\n                    Save Employee\n                  </button>',
  'type="submit" disabled={isSubmitting}\n                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"\n                  >\n                    {isSubmitting ? "Saving..." : "Save Employee"}\n                  </button>'
);

content = content.replace(
  'window.dispatchEvent(new Event(\'refetch-dashboard-stats\'));\n                    }',
  'window.dispatchEvent(new Event(\'refetch-dashboard-stats\'));\n                    }\n                    setIsSubmitting(false);'
);

content = content.replace(
  'setFormError(\'Error adding employee: \' + String(err)); console.error(err);\n                  }',
  'setFormError(\'Error adding employee: \' + String(err)); console.error(err);\n                  }\n                  setIsSubmitting(false);'
);


fs.writeFileSync('src/components/HRView.tsx', content);
