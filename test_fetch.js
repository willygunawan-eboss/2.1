import fetch from 'node-fetch';

(async () => {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: '1234erP' })
  });
  const cookies = loginRes.headers.raw()['set-cookie'];
  const tokenCookie = cookies[0].split(';')[0];

  const listRes = await fetch('http://localhost:3000/api/tickets', {
    headers: { 'Cookie': tokenCookie }
  });
  console.log(listRes.status);
  const data = await listRes.json();
  console.log(data);
})();
