const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Generate unique order number
function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

// GET all orders
router.get('/', async (req, res) => {
  try {
    const { status, limit, offset } = req.query;
    
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    // Filter by status
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    // Pagination
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
      
      if (offset) {
        query += ' OFFSET ?';
        params.push(parseInt(offset));
      }
    }

    const [orders] = await pool.query(query, params);
    
    // Parse JSON fields
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.items ? JSON.parse(order.items) : []
    }));

    res.json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// GET single order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];
    const formattedOrder = {
      ...order,
      items: order.items ? JSON.parse(order.items) : []
    };

    res.json({
      success: true,
      data: formattedOrder
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// GET order by order number
router.get('/number/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const [orders] = await pool.query('SELECT * FROM orders WHERE order_number = ?', [orderNumber]);
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];
    const formattedOrder = {
      ...order,
      items: order.items ? JSON.parse(order.items) : []
    };

    res.json({
      success: true,
      data: formattedOrder
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// POST - Create new order
router.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_country,
      items,
      subtotal,
      shipping,
      total,
      payment_method,
      notes
    } = req.body;

    // Validation
    if (!customer_name || !customer_email || !customer_phone || !customer_address || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const orderNumber = generateOrderNumber();

    const [result] = await pool.query(
      `INSERT INTO orders 
       (order_number, customer_name, customer_email, customer_phone, 
        customer_address, customer_city, customer_country, items, 
        subtotal, shipping, total, payment_method, notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_city || '',
        customer_country || '',
        JSON.stringify(items),
        subtotal,
        shipping || 0,
        total,
        payment_method || 'cash_on_delivery',
        notes || '',
        'pending'
      ]
    );

    // Update product stock quantities
    for (const item of items) {
      await pool.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity || 1, item.id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        id: result.insertId,
        order_number: orderNumber
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// PUT - Update order status (Admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// PUT - Update order (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Convert arrays to JSON strings
    if (updates.items) updates.items = JSON.stringify(updates.items);

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    await pool.query(
      `UPDATE orders SET ${fields} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
});

// DELETE - Delete order (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM orders WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
});

// GET order statistics (Admin)
router.get('/stats/summary', async (req, res) => {
  try {
    const [totalOrders] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const [totalRevenue] = await pool.query('SELECT SUM(total) as revenue FROM orders WHERE status != "cancelled"');
    const [pendingOrders] = await pool.query('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
    const [completedOrders] = await pool.query('SELECT COUNT(*) as count FROM orders WHERE status = "delivered"');

    res.json({
      success: true,
      data: {
        total_orders: totalOrders[0].count,
        total_revenue: totalRevenue[0].revenue || 0,
        pending_orders: pendingOrders[0].count,
        completed_orders: completedOrders[0].count
      }
    });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;
