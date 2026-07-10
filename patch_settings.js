import fs from 'fs';
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf8');

if (!code.includes('System Readiness')) {
  code = code.replace(
    "import { Webhook } from 'lucide-react';",
    "import { Webhook, Activity } from 'lucide-react';"
  );
  
  code = code.replace(
    "import { OrgMasterView } from './OrgMasterView';",
    "import { OrgMasterView } from './OrgMasterView';\nimport { SystemReadinessView } from './SystemReadinessView';"
  );
  
  code = code.replace(
    "export function SettingsView() {",
    "export function SettingsView() {\n  const [activeTab, setActiveTab] = React.useState('company');"
  );
  
  code = code.replace(
    "<button className=\"w-full flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm transition-colors\">",
    "<button onClick={() => setActiveTab('company')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'company' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>"
  );
  
  code = code.replace(
    "<button className=\"w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors\">\n              <UserCircle className=\"w-5 h-5 text-slate-400\" />\n              User Management\n            </button>",
    `<button onClick={() => setActiveTab('users')} className={\`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors \${activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}\`}>
              <UserCircle className="w-5 h-5 text-slate-400" />
              User Management
            </button>
            <button onClick={() => setActiveTab('readiness')} className={\`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors \${activeTab === 'readiness' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}\`}>
              <Activity className="w-5 h-5 text-slate-400" />
              System Readiness
            </button>`
  );

  code = code.replace(
    "<OrgMasterView />",
    "{activeTab === 'company' && <OrgMasterView />}\n            {activeTab === 'readiness' && <SystemReadinessView />}\n            {activeTab === 'users' && <div className=\"p-8 text-slate-500\">User Management (Coming Soon)</div>}"
  );

  fs.writeFileSync('src/components/SettingsView.tsx', code);
}
