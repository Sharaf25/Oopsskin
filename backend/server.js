const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { testConnection } = require('./config/database');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Oopsskin API Server',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders'
    }
  });
});

// API Routes
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
async function startServer() {
  // Test database connection
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('❌ Failed to connect to database. Please check your configuration.');
    console.log('💡 Make sure MySQL is running and credentials in .env are correct');
    console.log('💡 Run "npm run init-db" to initialize the database');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 Oopsskin API Server Started Successfully!');
    console.log('='.repeat(50));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log('\n📚 Available Endpoints:');
    console.log(`   GET    /api/products          - Get all products`);
    console.log(`   GET    /api/products/:id      - Get product by ID`);
    console.log(`   GET    /api/products/category/:category - Get products by category`);
    console.log(`   POST   /api/products          - Create product`);
    console.log(`   PUT    /api/products/:id      - Update product`);
    console.log(`   DELETE /api/products/:id      - Delete product`);
    console.log('');
    console.log(`   GET    /api/orders            - Get all orders`);
    console.log(`   GET    /api/orders/:id        - Get order by ID`);
    console.log(`   GET    /api/orders/number/:orderNumber - Get order by number`);
    console.log(`   POST   /api/orders            - Create order`);
    console.log(`   PUT    /api/orders/:id/status - Update order status`);
    console.log(`   PUT    /api/orders/:id        - Update order`);
    console.log(`   DELETE /api/orders/:id        - Delete order`);
    console.log(`   GET    /api/orders/stats/summary - Get order statistics`);
    console.log('='.repeat(50) + '\n');
  });
}

startServer();

module.exports = app;
