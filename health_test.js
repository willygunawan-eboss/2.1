fetch('http://localhost:3010/api/system/health').then(r=>r.json()).then(console.log).catch(console.error)
