import fetch from 'node-fetch';

(async () => {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'password123' })
  });
  const cookies = loginRes.headers.raw()['set-cookie'] || [];
  const tokenCookie = cookies.length ? cookies[0].split(';')[0] : '';
  
  const res = await fetch('http://localhost:3000/api/tickets/references/all', {
    headers: { 'Cookie': tokenCookie }
  });
  const data = await res.json();
  console.log("Categories:", data.data?.categories?.length);
  console.log("Subcategories:", data.data?.subCategories?.length);
  console.log("Priorities:", data.data?.priorities?.length);
  console.log("Impacts:", data.data?.impacts?.length);
  console.log("Urgencies:", data.data?.urgencies?.length);
  console.log("Customers:", data.data?.customers?.length);
  console.log("Assets:", data.data?.assets?.length);
})();
