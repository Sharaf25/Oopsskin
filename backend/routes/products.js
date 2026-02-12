const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, limit, offset } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Filter by category
    if (category && category !== 'All') {
      query += ' AND (category = ? OR category_ar = ?)';
      params.push(category, category);
    }

    // Search by name
    if (search) {
      query += ' AND (name LIKE ? OR name_ar LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Sorting
    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY rating DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY created_at DESC';
    } else {
      query += ' ORDER BY reviews_count DESC'; // Default: best selling
    }

    // Pagination
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
      
      if (offset) {
        query += ' OFFSET ?';
        params.push(parseInt(offset));
      }
    }

    const [products] = await pool.query(query, params);
    
    // Parse JSON fields
    const formattedProducts = products.map(product => ({
      ...product,
      colors: product.colors ? JSON.parse(product.colors) : [],
      images: product.images ? JSON.parse(product.images) : []
    }));

    res.json({
      success: true,
      count: formattedProducts.length,
      data: formattedProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = products[0];
    const formattedProduct = {
      ...product,
      colors: product.colors ? JSON.parse(product.colors) : [],
      images: product.images ? JSON.parse(product.images) : []
    };

    res.json({
      success: true,
      data: formattedProduct
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// GET products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const [products] = await pool.query(
      'SELECT * FROM products WHERE category = ? OR category_ar = ? ORDER BY reviews_count DESC',
      [category, category]
    );
    
    const formattedProducts = products.map(product => ({
      ...product,
      colors: product.colors ? JSON.parse(product.colors) : [],
      images: product.images ? JSON.parse(product.images) : []
    }));

    res.json({
      success: true,
      count: formattedProducts.length,
      data: formattedProducts
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// POST - Create new product (Admin)
router.post('/', async (req, res) => {
  try {
    const {
      name, name_ar, description, description_ar,
      category, category_ar, price, original_price,
      rating, reviews_count, colors, images,
      badge, discount, in_stock, stock_quantity
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO products 
       (name, name_ar, description, description_ar, category, category_ar, 
        price, original_price, rating, reviews_count, colors, images, 
        badge, discount, in_stock, stock_quantity) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, name_ar, description, description_ar,
        category, category_ar, price, original_price,
        rating || 0, reviews_count || 0,
        JSON.stringify(colors || []),
        JSON.stringify(images || []),
        badge, discount, in_stock !== false, stock_quantity || 0
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// PUT - Update product (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Convert arrays to JSON strings
    if (updates.colors) updates.colors = JSON.stringify(updates.colors);
    if (updates.images) updates.images = JSON.stringify(updates.images);

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    await pool.query(
      `UPDATE products SET ${fields} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// DELETE - Delete product (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

module.exports = router;
