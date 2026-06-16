const express = require('express');
const router = express.Router();
const db = require('../db');

// GET dashboard aggregations
router.get('/', async (req, res) => {
  try {
    const [customers] = await db.query('SELECT COUNT(*) as count FROM Customer');
    const [products] = await db.query('SELECT COUNT(*) as count FROM Product');
    const [orders] = await db.query('SELECT COUNT(*) as count FROM Orders');
    const [revenue] = await db.query('SELECT COALESCE(SUM(amount), 0) as total FROM Payment');
    const [pendingOrders] = await db.query('SELECT COUNT(*) as count FROM Orders WHERE status IN ("pending", "processing")');
    const [lowStock] = await db.query('SELECT COUNT(*) as count FROM Product WHERE stock < 50');

    // Recent orders
    const [recentOrders] = await db.query(`
      SELECT 
        o.order_id as id,
        c.name as customerName,
        DATE_FORMAT(o.order_date, '%Y-%m-%d') as date,
        o.status,
        COALESCE((SELECT SUM(subtotal) FROM Order_Items WHERE order_id = o.order_id), 0) as total
      FROM Orders o
      LEFT JOIN Customer c ON o.customer_id = c.customer_id
      ORDER BY o.order_id DESC
      LIMIT 6
    `);

    res.json({
      totalCustomers: customers[0].count,
      totalProducts: products[0].count,
      totalOrders: orders[0].count,
      totalRevenue: revenue[0].total,
      pendingOrders: pendingOrders[0].count,
      lowStock: lowStock[0].count,
      recentOrders
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
