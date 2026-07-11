import fs from 'fs';
let code = fs.readFileSync('src/components/BootstrapWizard.tsx', 'utf8');

code = code.replace(
  'errorInfo: null };',
  'errorInfo: null, logId: "" };'
);

code = code.replace(
  'this.setState({ errorInfo });',
  'this.setState({ errorInfo, logId: `ERR-${Math.random().toString(36).substr(2, 9).toUpperCase()}` });'
);

code = code.replace(
  '<div className="bg-slate-100 p-4 rounded-lg text-sm text-red-600 font-mono overflow-auto mb-6 max-h-40">\n              {this.state.error?.toString()}\n            </div>',
  `<div className="bg-slate-100 p-4 rounded-lg text-sm text-red-600 font-mono overflow-auto mb-6 max-h-40">
              <p className="font-bold mb-1">Log ID: {this.state.logId}</p>
              {this.state.error?.toString()}
            </div>`
);

fs.writeFileSync('src/components/BootstrapWizard.tsx', code);
