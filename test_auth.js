fetch('http://localhost:3000/api/tickets/references/all')
.then(res => res.json())
.then(console.log)
.catch(console.error)
