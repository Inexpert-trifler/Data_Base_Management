const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.product_id as id,
        p.product_name as name,
        CONCAT('SKU-', p.product_id) as sku, -- Dummy SKU
        p.category,
        p.price,
        p.stock,
        'unit' as unit, -- Dummy unit
        COALESCE(s.supplier_name, 'Unknown Supplier') as supplier
      FROM Product p
      LEFT JOIN Supplier s ON p.supplier_id = s.supplier_id
      ORDER BY p.product_id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Product WHERE product_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ ...rows[0], id: rows[0].product_id });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST new product
router.post('/', async (req, res) => {
  const { name, category, price, stock, supplier_id } = req.body;
  try {
    // If supplier is provided as a string instead of ID, we could either insert it or just leave supplier_id null
    // Assuming we insert a product with basic info for now. supplier_id is optional or needs to match an existing ID.
    // To keep it simple, we insert with null supplier if not provided.
    const [result] = await db.query(
      'INSERT INTO Product (product_name, category, price, stock, supplier_id) VALUES (?, ?, ?, ?, ?)',
      [name, category, price, stock, supplier_id || null]
    );
    res.status(201).json({ id: result.insertId, name, category, price, stock });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  const { name, category, price, stock } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE Product SET product_name = ?, category = ?, price = ?, stock = ? WHERE product_id = ?',
      [name, category, price, stock, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Product WHERE product_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product. It might be linked to orders.' });
  }
});

module.exports = router;
