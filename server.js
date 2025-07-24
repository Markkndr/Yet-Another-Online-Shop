import express from "express";
import path from "path";
import url from "url";
import fs from "fs";

const app = express();
const PORT = 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware to serve static files and parse JSON
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

// POST (Add or Edit) product
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  const filePath = path.join(__dirname, 'data', 'products.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    let products = [];

    if (!err && data.trim()) {
      try {
        products = JSON.parse(data);
        if (!Array.isArray(products)) {
          products = [];
        }
      } catch {
        products = [];
      }
    }

    // Check if product with same ID exists
    const existingIndex = products.findIndex(p => p.id === newProduct.id);

    if (existingIndex !== -1) {
      // Update existing product
      products[existingIndex] = newProduct;
    } else {
      // Add new product
      products.push(newProduct);
    }

    // Save the updated list
    fs.writeFile(filePath, JSON.stringify(products, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Unable to save product.' });
      }
      res.status(201).json({ message: 'Product saved successfully.' });
    });
  });
});

// POST a new order
app.post('/api/orders', (req, res) => {
  const order = req.body;
  const filePath = path.join(__dirname, 'data', 'order.json');

  // Read existing orders
  fs.readFile(filePath, 'utf8', (err, data) => {
    let orders = [];
    let idObj = {}
    if (!err && data.trim()) {
      try {
        orders = JSON.parse(data);
        if (!Array.isArray(orders)) {
          orders = [];
        }
      } catch {
        orders = [];
      }
    }
    idObj.orderID = orders.length
    // Add the new order
    orders.push(idObj)
    orders.push(order);

    // Save updated order list
    fs.writeFile(filePath, JSON.stringify(orders, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Unable to save order.' });
      }
      res.status(201).json({ message: 'Order placed successfully.' });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});