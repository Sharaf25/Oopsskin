const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  try {
    // Connect without database to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    console.log('📦 Creating database...');
    
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`✅ Database '${process.env.DB_NAME}' created or already exists`);
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Create products table
    console.log('📦 Creating products table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255),
        description TEXT,
        description_ar TEXT,
        category VARCHAR(100) NOT NULL,
        category_ar VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2),
        rating DECIMAL(3, 2) DEFAULT 0,
        reviews_count INT DEFAULT 0,
        colors JSON,
        images JSON,
        badge VARCHAR(50),
        discount VARCHAR(50),
        in_stock BOOLEAN DEFAULT TRUE,
        stock_quantity INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Products table created');

    // Create orders table
    console.log('📦 Creating orders table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        customer_address TEXT NOT NULL,
        customer_city VARCHAR(100),
        customer_country VARCHAR(100),
        items JSON NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        shipping DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'cash_on_delivery',
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Orders table created');

    // Create users table (for authentication)
    console.log('📦 Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        city VARCHAR(100),
        country VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create vouchers table
    console.log('📦 Creating vouchers table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vouchers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        description VARCHAR(255),
        description_ar VARCHAR(255),
        discount_type ENUM('percentage', 'fixed') NOT NULL,
        discount_value DECIMAL(10, 2) NOT NULL,
        minimum_purchase DECIMAL(10, 2),
        maximum_discount DECIMAL(10, 2),
        usage_limit INT,
        usage_count INT DEFAULT 0,
        expiry_date DATE,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Vouchers table created');

    // Insert sample products
    console.log('📦 Inserting sample products...');
    const sampleProducts = [
      ['Flawless Foundation', 'كريم أساس خالي من العيوب', 'Long-lasting foundation for flawless skin', 'كريم أساس طويل الأمد للبشرة الخالية من العيوب', 'Foundation', 'كريم الأساس', 48.00, null, 4.9, 1250, '["#FFE4E1", "#F5DEB3", "#DEB887", "#D2691E"]', '[]', null, null, true, 100],
      ['HD Powder', 'بودرة إتش دي', 'High-definition setting powder', 'بودرة تثبيت عالية الوضوح', 'Powder & Setting Spray', 'البودرة والمثبت', 43.00, null, 4.8, 856, '["#FFE4E1", "#F5DEB3", "#DEB887"]', '[]', null, null, true, 80],
      ['Velvet Primer', 'برايمر مخملي', 'Smooth velvet primer for perfect makeup base', 'برايمر مخملي ناعم لقاعدة مكياج مثالية', 'Primer', 'البرايمر', 35.00, null, 4.7, 642, '[]', '[]', null, null, true, 120],
      ['Perfecting Concealer', 'كونسيلر مثالي', 'Full coverage concealer for flawless finish', 'كونسيلر كامل التغطية للمسة نهائية خالية من العيوب', 'Concealer & Corrector', 'الكونسيلر والمصحح', 32.00, null, 4.9, 1543, '["#FFE4E1", "#F5DEB3", "#DEB887", "#D2691E", "#8B4513"]', '[]', null, null, true, 150],
      ['Contour Stick', 'ستيك كونتور', 'Easy-to-use contour stick for sculpted look', 'ستيك كونتور سهل الاستخدام للمظهر المنحوت', 'Contour & Highlight', 'الكونتور والهايلايت', 28.00, null, 4.6, 432, '["#DEB887", "#D2691E", "#8B4513"]', '[]', null, null, true, 90],
      ['Eyeshadow Palette', 'باليت ظلال العيون', 'Professional eyeshadow palette with 12 shades', 'باليت ظلال عيون احترافية بـ 12 لون', 'Eyeshadow', 'ظلال العيون', 65.00, 80.00, 5.0, 2341, '[]', '[]', 'BESTSELLER', 'SAVE 19%', true, 200],
      ['Brow Pencil', 'قلم حواجب', 'Long-lasting brow pencil for defined eyebrows', 'قلم حواجب طويل الأمد للحواجب المحددة', 'Eyebrows', 'الحواجب', 22.00, null, 4.8, 876, '["#8B4513", "#654321", "#3D2817"]', '[]', null, null, true, 180],
      ['Liquid Eyeliner', 'آيلاينر سائل', 'Precision liquid eyeliner for perfect lines', 'آيلاينر سائل دقيق للخطوط المثالية', 'Eyeliner', 'الآيلاينر', 24.00, null, 4.9, 1234, '["#000000"]', '[]', null, null, true, 160],
      ['Volume Mascara', 'ماسكارا حجم', 'Volumizing mascara for dramatic lashes', 'ماسكارا حجم للرموش الدرامية', 'Mascara', 'الماسكارا', 29.00, null, 4.7, 987, '["#000000"]', '[]', null, null, true, 140],
      ['Lash Extensions', 'رموش صناعية', 'Premium false eyelashes for glamorous look', 'رموش صناعية فاخرة للمظهر الساحر', 'Fake Eyelashes', 'الرموش الصناعية', 18.00, null, 4.8, 654, '[]', '[]', null, null, true, 250],
      ['Jelly Lip Stain', 'صبغة شفاه جيلي', 'Long-lasting jelly lip stain', 'صبغة شفاه جيلي طويلة الأمد', 'Jelly Stained Lips', 'الصبغات الجيلي للشفاه', 26.00, null, 4.9, 1432, '["#FF69B4", "#DC143C", "#8B008B"]', '[]', 'NEW', null, true, 110],
      ['Glossy Lip Oil', 'زيت شفاه لامع', 'Nourishing glossy lip oil', 'زيت شفاه لامع ومغذي', 'Lip Gloss', 'ملمع الشفاه', 22.00, null, 4.6, 567, '["#FFB6C1", "#FF69B4", "#DC143C"]', '[]', null, null, true, 130],
      ['Matte Lipstick', 'روج مطفي', 'Long-wearing matte lipstick', 'روج مطفي طويل الأمد', 'Lipstick', 'أحمر الشفاه', 28.00, null, 4.9, 2156, '["#DC143C", "#8B008B", "#800000"]', '[]', 'BESTSELLER', null, true, 190],
      ['Precision Lip Liner', 'محدد شفاه دقيق', 'Precise lip liner for perfect definition', 'محدد شفاه دقيق للتحديد المثالي', 'Lip Liner', 'محدد الشفاه', 20.00, null, 4.7, 789, '["#DC143C", "#8B008B", "#800000"]', '[]', null, null, true, 170],
      ['Nourishing Lip Balm', 'مرطب شفاه مغذي', 'Hydrating lip balm with SPF protection', 'مرطب شفاه مع حماية من الشمس', 'Lip Balm', 'مرطب الشفاه', 15.00, null, 4.8, 1876, '[]', '[]', null, null, true, 300],
      ['Cream Blush', 'بلاشر كريمي', 'Creamy blush for natural-looking flush', 'بلاشر كريمي للمسة طبيعية', 'Blush', 'أحمر الخدود', 32.00, null, 4.9, 1098, '["#FFB6C1", "#FF69B4", "#DC143C"]', '[]', null, null, true, 95],
      ['Bronzing Powder', 'بودرة برونزية', 'Warm bronzing powder for sun-kissed glow', 'بودرة برونزية دافئة للتوهج المشمس', 'Bronzer', 'البرونزر', 38.00, null, 4.8, 876, '["#D2691E", "#8B4513", "#654321"]', '[]', null, null, true, 85],
      ['Makeup Brush Set', 'طقم فرش مكياج', 'Professional makeup brush set - 12 pieces', 'طقم فرش مكياج احترافي - 12 قطعة', 'Brushes', 'الفرش', 89.00, 120.00, 5.0, 3421, '[]', '[]', 'EXCLUSIVE', 'SAVE 26%', true, 60],
      ['Beauty Sponge', 'إسفنجة تجميل', 'Premium beauty sponge for flawless application', 'إسفنجة تجميل فاخرة للتطبيق الخالي من العيوب', 'Tools & Accessories', 'الأدوات والإكسسوارات', 18.00, null, 4.7, 2341, '["#FFB6C1"]', '[]', null, null, true, 400],
      ['Mini Kit Collection', 'مجموعة صغيرة', 'Travel-sized beauty essentials kit', 'طقم أساسيات التجميل بحجم السفر', 'Mini Products', 'المنتجات الصغيرة', 45.00, 65.00, 4.9, 765, '[]', '[]', null, 'SAVE 31%', true, 70]
    ];

    for (const product of sampleProducts) {
      await connection.query(
        `INSERT INTO products (name, name_ar, description, description_ar, category, category_ar, price, original_price, rating, reviews_count, colors, images, badge, discount, in_stock, stock_quantity) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        product
      );
    }
    console.log('✅ Sample products inserted');

    // Insert sample vouchers
    console.log('📦 Inserting sample vouchers...');
    const sampleVouchers = [
      ['WELCOME10', '10% off for new customers', 'خصم 10% للعملاء الجدد', 'percentage', 10.00, null, null, null, null, 'active'],
      ['SUMMER20', 'Summer sale - 20% off', 'تخفيضات الصيف - خصم 20%', 'percentage', 20.00, 50.00, 50.00, 100, null, 'active'],
      ['SAVE5', '$5 off your order', 'خصم 5 دولار على طلبك', 'fixed', 5.00, 25.00, null, null, null, 'active'],
      ['MAKEUP15', '15% off on makeup products', 'خصم 15% على منتجات المكياج', 'percentage', 15.00, 30.00, 30.00, 50, null, 'active'],
      ['FREESHIP', 'Free shipping on orders over $50', 'شحن مجاني للطلبات أكثر من 50 دولار', 'fixed', 0.00, 50.00, null, null, null, 'active']
    ];

    for (const voucher of sampleVouchers) {
      await connection.query(
        `INSERT INTO vouchers (code, description, description_ar, discount_type, discount_value, minimum_purchase, maximum_discount, usage_limit, expiry_date, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        voucher
      );
    }
    console.log('✅ Sample vouchers inserted');

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('📊 Tables created: products, orders, users, vouchers');
    console.log('📦 Sample data inserted: 20 products, 5 vouchers');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
