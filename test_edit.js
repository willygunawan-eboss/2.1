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

  // List tickets to get one
  const listRes = await fetch('http://localhost:3000/api/tickets', {
    headers: { 'Cookie': tokenCookie }
  });
  const listData = await listRes.json();
  const ticketId = listData.data[0].id;

  // Edit ticket
  const payload = {
    title: "Test Ticket API 2 Edited",
  };
  
  const editRes = await fetch(`http://localhost:3000/api/tickets/${ticketId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': tokenCookie
    },
    body: JSON.stringify(payload)
  });
  
  const editData = await editRes.json();
  console.log("Edit:", JSON.stringify(editData, null, 2));
})();
