import fetch from 'node-fetch';

(async () => {
  // Login
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'password123' })
  });
  
  const cookies = loginRes.headers.raw()['set-cookie'];
  const tokenCookie = cookies[0].split(';')[0];
  
  console.log("Logged in");

  // Create ticket
  const payload = {
    title: "Test Ticket API",
    description: "Testing API Create",
    categoryId: "CAT-001",
    priorityId: "PRI-003",
    assignedTo: ""
  };
  
  const createRes = await fetch('http://localhost:3000/api/tickets', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': tokenCookie
    },
    body: JSON.stringify(payload)
  });
  
  const createData = await createRes.json();
  console.log("Create:", createData);

  // List tickets
  const listRes = await fetch('http://localhost:3000/api/tickets', {
    headers: { 'Cookie': tokenCookie }
  });
  const listData = await listRes.json();
  console.log("List:", listData.data.length, "tickets");
})();
