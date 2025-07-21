const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// GET all products
app.get('/api/products', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'products.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read products data.' });
    }
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {    
  console.log(`Server is running at http://localhost:${PORT}`);
});