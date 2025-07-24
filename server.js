import express from "express";
import path from "path";
import url from "url";
import fs from "fs";

const app = express();
const PORT = 3000;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.static('public'));
app.use(express.json());

// GET all products
app.get('/api/products', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'products.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read products data.' });
    }
    res.json(JSON.parse(data || '[]'));
  });
});

// Szerver kliens és Editor oldal
app.get('/clientPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/clientPage.html'));
});

app.get('/editorPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/editorPage.html'));
});

// POST or update product
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  const filePath = path.join(__dirname, 'data', 'products.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    let products = [];

    if (!err && data.trim()) {
      try {
        products = JSON.parse(data);
        if (!Array.isArray(products)) products = [];
      } catch {
        products = [];
      }
    }

    const index = products.findIndex(p => p.id === newProduct.id);
    if (index !== -1) {
      products[index] = newProduct;
      console.log(`Product updated: ${newProduct.name}`);
    } else {
      products.push(newProduct);
      console.log(`New product added: ${newProduct.name}`);
    }

    fs.writeFile(filePath, JSON.stringify(products, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Unable to save product.' });
      res.status(201).json({ message: 'Product saved successfully.' });
    });
  });
});

// POST new order
app.post('/api/orders', (req, res) => {
  const orderItems = req.body;
  const filePath = path.join(__dirname, 'data', 'order.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    let orders = [];

    if (!err && data.trim()) {
      try {
        orders = JSON.parse(data);
        if (!Array.isArray(orders)) orders = [];
      } catch {
        orders = [];
      }
    }

    const newOrder = {
      id: orders.length + 1,
      date: new Date().toISOString(),
      items: orderItems
    };

    orders.push(newOrder);
    console.log(`New order placed. ID: ${newOrder.id}`);

    fs.writeFile(filePath, JSON.stringify(orders, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Unable to save order.' });
      res.status(201).json({ message: 'Order placed successfully.' });
    });
  });
});

app.get('/api/orders', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'order.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Unable to read orders.' });
    res.json(JSON.parse(data || '[]'));
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
