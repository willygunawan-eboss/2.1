import fetch from 'node-fetch';

(async () => {
  // Login
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: '1234erP' })
  });
  
  const cookies = loginRes.headers.raw()['set-cookie'];
  const tokenCookie = cookies[0].split(';')[0];

  // Get references
  const refRes = await fetch('http://localhost:3000/api/tickets/references/all', {
    headers: { 'Cookie': tokenCookie }
  });
  const refData = await refRes.json();
  const refs = refData.data;

  // Create ticket 1
  const payload = {
    title: "Test Ticket API Double 1",
    description: "Testing API Create 1",
    categoryId: refs.categories[0]?.id || '',
    subCategoryId: refs.subCategories[0]?.id || '',
    priorityId: refs.priorities[0]?.id || '',
    impactId: refs.impacts[0]?.id || '',
    urgencyId: refs.urgencies[0]?.id || '',
  };
  
  const createRes = await fetch('http://localhost:3000/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': tokenCookie },
    body: JSON.stringify(payload)
  });
  
  console.log("Create 1:", await createRes.text());

  // Create ticket 2
  const createRes2 = await fetch('http://localhost:3000/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': tokenCookie },
    body: JSON.stringify({...payload, title: "Test Ticket API Double 2"})
  });
  
  console.log("Create 2:", await createRes2.text());
})();
