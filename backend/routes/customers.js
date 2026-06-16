const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all customers
router.get('/', async (req, res) => {
  try {
    // Left join with Orders and Payment to calculate total orders and total spent
    const [rows] = await db.query(`
      SELECT 
        c.customer_id as id,
        c.name,
        c.email,
        c.phone,
        c.address,
        'active' as status, -- Dummy status as it's not in schema
        DATE_FORMAT(NOW(), '%Y-%m-%d') as joinDate, -- Dummy join date as it's not in schema
        COUNT(DISTINCT o.order_id) as totalOrders,
        COALESCE(SUM(p.amount), 0) as totalSpent
      FROM Customer c
      LEFT JOIN Orders o ON c.customer_id = o.customer_id
      LEFT JOIN Payment p ON o.order_id = p.order_id AND p.amount > 0
      GROUP BY c.customer_id
      ORDER BY c.customer_id DESC
    `);
    res.json(rows);
  } catch (err) {
  console.error("FULL ERROR:", err);

  res.status(500).json({
    message: err.message,
    code: err.code,
    sqlMessage: err.sqlMessage
  });
}
});

// GET single customer
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Customer WHERE customer_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    
    // Map customer_id to id for frontend compatibility
    const customer = { ...rows[0], id: rows[0].customer_id };
    res.json(customer);
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// POST new customer
router.post('/', async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Customer (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone, address]
    );
    res.status(201).json({ id: result.insertId, name, email, phone, address });
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT update customer
router.put('/:id', async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE Customer SET name = ?, email = ?, phone = ?, address = ? WHERE customer_id = ?',
      [name, email, phone, address, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer updated successfully' });
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Customer WHERE customer_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    // Might fail due to foreign key constraints if they have orders
    res.status(500).json({ error: 'Failed to delete customer. They might have existing orders.' });
  }
});

module.exports = router;
