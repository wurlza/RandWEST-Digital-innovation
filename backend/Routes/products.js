const express = require('express');
const router = express.Router();

// Mock data - replace with database
let products = [
    { id: 1, name: "Product 1", price: 29.99, category: "electronics" },
    { id: 2, name: "Product 2", price: 19.99, category: "clothing" }
];

// Get all products
router.get('/', (req, res) => {
    res.json(products);
});

// Get single product
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

module.exports = router;