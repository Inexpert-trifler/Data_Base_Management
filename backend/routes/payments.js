const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all payments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.payment_id as id,
        p.order_id as orderId,
        p.amount,
        p.payment_method as method,
        DATE_FORMAT(p.payment_date, '%Y-%m-%d') as date,
        'completed' as status, -- Dummy status since it's not in schema
        CONCAT('TXN', p.payment_id, p.order_id) as transactionId, -- Dummy txn ID
        c.customer_id as customerId,
        c.name as customerName
      FROM Payment p
      JOIN Orders o ON p.order_id = o.order_id
      JOIN Customer c ON o.customer_id = c.customer_id
      ORDER BY p.payment_id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// POST new payment
router.post('/', async (req, res) => {
  const { orderId, amount, method, date } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Payment (order_id, amount, payment_method, payment_date) VALUES (?, ?, ?, ?)',
      [orderId, amount, method, date]
    );
    res.status(201).json({ id: result.insertId, message: 'Payment recorded' });
  } catch (err) {
    console.error('Error creating payment:', err);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Payment WHERE payment_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Payment not found' });
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    console.error('Error deleting payment:', err);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

module.exports = router;
