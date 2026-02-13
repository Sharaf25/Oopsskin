const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET all vouchers
router.get('/', async (req, res) => {
  try {
    const { status, type } = req.query;
    
    let query = 'SELECT * FROM vouchers WHERE 1=1';
    const params = [];

    // Filter by status
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    // Filter by type
    if (type) {
      query += ' AND discount_type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC';

    const [vouchers] = await pool.query(query, params);

    res.json({
      success: true,
      count: vouchers.length,
      data: vouchers
    });
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vouchers',
      error: error.message
    });
  }
});

// GET single voucher by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [vouchers] = await pool.query('SELECT * FROM vouchers WHERE id = ?', [id]);
    
    if (vouchers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    res.json({
      success: true,
      data: vouchers[0]
    });
  } catch (error) {
    console.error('Error fetching voucher:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching voucher',
      error: error.message
    });
  }
});

// POST - Validate voucher code
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Voucher code is required'
      });
    }

    const [vouchers] = await pool.query(
      'SELECT * FROM vouchers WHERE code = ? AND status = "active"',
      [code.toUpperCase()]
    );

    if (vouchers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or inactive voucher code'
      });
    }

    const voucher = vouchers[0];
    const now = new Date();

    // Check if voucher is expired
    if (voucher.expiry_date && new Date(voucher.expiry_date) < now) {
      return res.status(400).json({
        success: false,
        message: 'This voucher has expired'
      });
    }

    // Check if voucher has usage limit
    if (voucher.usage_limit && voucher.usage_count >= voucher.usage_limit) {
      return res.status(400).json({
        success: false,
        message: 'This voucher has reached its usage limit'
      });
    }

    // Check minimum purchase amount
    if (voucher.minimum_purchase && subtotal < voucher.minimum_purchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of $${voucher.minimum_purchase} required`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (voucher.discount_type === 'percentage') {
      discountAmount = (subtotal * voucher.discount_value) / 100;
      if (voucher.maximum_discount && discountAmount > voucher.maximum_discount) {
        discountAmount = voucher.maximum_discount;
      }
    } else {
      discountAmount = voucher.discount_value;
    }

    res.json({
      success: true,
      message: 'Voucher applied successfully',
      data: {
        code: voucher.code,
        discount_type: voucher.discount_type,
        discount_value: voucher.discount_value,
        discount_amount: parseFloat(discountAmount.toFixed(2)),
        description: voucher.description
      }
    });
  } catch (error) {
    console.error('Error validating voucher:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating voucher',
      error: error.message
    });
  }
});

// POST - Apply voucher (increment usage count)
router.post('/apply', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Voucher code is required'
      });
    }

    await pool.query(
      'UPDATE vouchers SET usage_count = usage_count + 1 WHERE code = ?',
      [code.toUpperCase()]
    );

    res.json({
      success: true,
      message: 'Voucher usage recorded'
    });
  } catch (error) {
    console.error('Error applying voucher:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying voucher',
      error: error.message
    });
  }
});

// POST - Create new voucher (Admin)
router.post('/', async (req, res) => {
  try {
    const {
      code,
      description,
      description_ar,
      discount_type,
      discount_value,
      minimum_purchase,
      maximum_discount,
      usage_limit,
      expiry_date,
      status
    } = req.body;

    // Validation
    if (!code || !discount_type || !discount_value) {
      return res.status(400).json({
        success: false,
        message: 'Code, discount type, and discount value are required'
      });
    }

    // Check if code already exists
    const [existing] = await pool.query('SELECT id FROM vouchers WHERE code = ?', [code.toUpperCase()]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Voucher code already exists'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO vouchers 
       (code, description, description_ar, discount_type, discount_value, 
        minimum_purchase, maximum_discount, usage_limit, expiry_date, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        code.toUpperCase(),
        description,
        description_ar || null,
        discount_type,
        discount_value,
        minimum_purchase || null,
        maximum_discount || null,
        usage_limit || null,
        expiry_date || null,
        status || 'active'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Voucher created successfully',
      data: { id: result.insertId, code: code.toUpperCase() }
    });
  } catch (error) {
    console.error('Error creating voucher:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating voucher',
      error: error.message
    });
  }
});

// PUT - Update voucher (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Convert code to uppercase if provided
    if (updates.code) {
      updates.code = updates.code.toUpperCase();
    }

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    await pool.query(
      `UPDATE vouchers SET ${fields} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Voucher updated successfully'
    });
  } catch (error) {
    console.error('Error updating voucher:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating voucher',
      error: error.message
    });
  }
});

// PUT - Toggle voucher status (Admin)
router.put('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [vouchers] = await pool.query('SELECT status FROM vouchers WHERE id = ?', [id]);
    if (vouchers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    const newStatus = vouchers[0].status === 'active' ? 'inactive' : 'active';
    
    await pool.query('UPDATE vouchers SET status = ? WHERE id = ?', [newStatus, id]);

    res.json({
      success: true,
      message: `Voucher ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: { status: newStatus }
    });
  } catch (error) {
    console.error('Error toggling voucher status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling voucher status',
      error: error.message
    });
  }
});

// DELETE - Delete voucher (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM vouchers WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Voucher deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting voucher:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting voucher',
      error: error.message
    });
  }
});

// GET - Voucher statistics (Admin)
router.get('/stats/summary', async (req, res) => {
  try {
    const [totalVouchers] = await pool.query('SELECT COUNT(*) as count FROM vouchers');
    const [activeVouchers] = await pool.query('SELECT COUNT(*) as count FROM vouchers WHERE status = "active"');
    const [totalUsage] = await pool.query('SELECT SUM(usage_count) as total FROM vouchers');
    const [expiredVouchers] = await pool.query(
      'SELECT COUNT(*) as count FROM vouchers WHERE expiry_date < NOW() AND status = "active"'
    );

    res.json({
      success: true,
      data: {
        total_vouchers: totalVouchers[0].count,
        active_vouchers: activeVouchers[0].count,
        total_usage: totalUsage[0].total || 0,
        expired_vouchers: expiredVouchers[0].count
      }
    });
  } catch (error) {
    console.error('Error fetching voucher statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;
