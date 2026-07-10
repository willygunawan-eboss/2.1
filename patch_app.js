import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { BootstrapWizard }')) {
  code = code.replace(
    "import { LoginView } from './components/LoginView';", 
    "import { LoginView } from './components/LoginView';\nimport { BootstrapWizard } from './components/BootstrapWizard';"
  );
}

if (!code.includes('systemReady')) {
  code = code.replace(
    "const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);",
    "const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);\n  const [systemReady, setSystemReady] = useState<boolean>(true);"
  );

  code = code.replace(
    "if (data.success) {\n            setIsAuthenticated(true);\n          } else {\n            setIsAuthenticated(false);\n          }",
    `if (data.success) {
            setIsAuthenticated(true);
            const healthRes = await fetch('/api/system/health');
            if (healthRes.ok) {
              const healthData = await healthRes.json();
              if (healthData.success) {
                setSystemReady(healthData.data.systemReady);
              }
            }
          } else {
            setIsAuthenticated(false);
          }`
  );

  code = code.replace(
    "if (!isAuthenticated) {\n    return <LoginView onLogin={handleLogin} />;\n  }",
    `if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }
  
  if (!systemReady) {
    return <BootstrapWizard onComplete={() => setSystemReady(true)} />;
  }`
  );

  fs.writeFileSync('src/App.tsx', code);
}
