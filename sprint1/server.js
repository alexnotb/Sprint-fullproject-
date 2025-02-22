const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World! My Startup is running.');
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:3000/`);
});
