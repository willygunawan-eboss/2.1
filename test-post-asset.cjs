fetch('http://localhost:3000/api/assets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'AST-TEST',
    assetId: 'AST-999',
    name: 'Test Asset',
    category: 'Hardware',
    purchaseDate: '2026-07-08',
    currentValue: 1000,
    status: 'Active',
    assignedTo: 'EMP-123',
    assignedEmployeeName: 'lehboy5G'
  })
}).then(res => res.json()).then(console.log).catch(console.error);
