import fetch from 'node-fetch';

(async () => {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: '1234erP' })
  });
  const tokenCookie = loginRes.headers.raw()['set-cookie'][0].split(';')[0];
  const payload = {
    title: "Test Ticket",
    description: "Test description",
    categoryId: "CAT-001",
    subCategoryId: "SCAT-001",
    priorityId: "PRI-001",
    impactId: "IMP-001",
    urgencyId: "URG-001",
  };
  
  const p1 = fetch('http://localhost:3000/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': tokenCookie },
    body: JSON.stringify(payload)
  });
  const p2 = fetch('http://localhost:3000/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': tokenCookie },
    body: JSON.stringify(payload)
  });
  
  const [r1, r2] = await Promise.all([p1, p2]);
  console.log(await r1.text());
  console.log(await r2.text());
})();
