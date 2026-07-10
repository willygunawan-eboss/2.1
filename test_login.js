import fetch from 'node-fetch';

(async () => {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'password123' })
  });
  console.log(loginRes.status);
  const data = await loginRes.json();
  console.log(data);
})();
