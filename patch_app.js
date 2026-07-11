import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const [systemReady, setSystemReady] = useState<boolean>(true);',
  'const [systemReady, setSystemReady] = useState<boolean>(true);\n  const [userRole, setUserRole] = useState<string>("");'
);

code = code.replace(
  'setIsAuthenticated(true);',
  'setIsAuthenticated(true);\n            setUserRole(data.user?.role || "");'
);

code = code.replace(
  "const healthRes = await fetch('/api/system/health');",
  "const healthRes = await fetch('/api/bootstrap/status');"
);

code = code.replace(
  "setSystemReady(healthData.data.systemReady);",
  "setSystemReady(healthData.data.erpReady);"
);

code = code.replace(
  "if (!systemReady) {\n    return <BootstrapWizard onComplete={() => setSystemReady(true)} />;\n  }",
  `if (!systemReady) {
    if (userRole === 'SUPER_ADMIN') {
      return <BootstrapWizard onComplete={() => setSystemReady(true)} />;
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50 font-sans text-center px-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">System Under Initialization</h1>
          <p className="text-slate-600 max-w-md">
            The ERP system is currently being set up by the administrator. Please check back later.
          </p>
        </div>
      );
    }
  }`
);

fs.writeFileSync('src/App.tsx', code);
