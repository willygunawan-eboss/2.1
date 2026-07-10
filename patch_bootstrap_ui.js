import fs from 'fs';
let code = fs.readFileSync('src/components/BootstrapWizard.tsx', 'utf8');

code = code.replace(
  /let endpoint = '';.*?return;/s,
  `const res = await fetch('/api/system/bootstrap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ step: currentStep, data })
        });
        const resData = await res.json();
        if (!res.ok || !resData.success) throw new Error(resData.message || "Failed to save");`
);
code = code.replace(
  /if \(endpoint\) \{.*?\}\n/s,
  ''
);

fs.writeFileSync('src/components/BootstrapWizard.tsx', code);
