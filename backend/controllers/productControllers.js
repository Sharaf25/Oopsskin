const {
  Product,
  Category,
  Tag,
  ProductImage,
  ProductRating,
} = require("../models");

const { Op } = require("sequelize");
const fs = require("fs");

// ========================================
// 1️⃣ ADD PRODUCT (ADMIN)
// ========================================
exports.addProduct = async (req, res) => {
  try {
    const {
      name_en,
      name_ar,
      details_en,
      details_ar,
      price,
      before_price,
      stock,
      badge,
      category_id,
      tags,
    } = req.body;

    const product = await Product.create({
      name_en,
      name_ar,
      details_en,
      details_ar,
      price,
      before_price: before_price || null,
      stock,
      badge,
      category_id: category_id || null,
    });

    if (tags && tags.length > 0) {
      await product.setTags(tags);
    }

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        await ProductImage.create({
          image_url: req.files[i].path,
          is_featured: i === 0,
          product_id: product.id,
        });
      }
    }

    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// 2️⃣ GET PRODUCTS (LIST)
// ========================================
exports.getProducts = async (req, res) => {
  try {
    const lang = req.query.lang === "ar" ? "ar" : "en";

    const {
      minPrice,
      maxPrice,
      category,
      tag,
      search,
      inStock,
      sort = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    const where = {};

    // ✅ Price filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    // ✅ Category filter (by ID)
    if (category) {
      where.category_id = Number(category);
    }

    // ✅ Search
    if (search) {
      where[`name_${lang}`] = {
        [Op.like]: `%${search}%`,
      };
    }

    // ✅ In stock filter
    if (inStock === "true") {
      where.stock = { [Op.gt]: 0 };
    }

    // ✅ Sorting (ONLY BY PRICE)
    const orderDirection = sort.toLowerCase() === "desc" ? "DESC" : "ASC";

    const offset = (page - 1) * limit;

    const products = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: "category" },
        {
          model: Tag,
          as: "tags",
          through: { attributes: [] },
          ...(tag && { where: { id: tag } }),
        },
        { model: ProductImage, as: "images" },
      ],
      distinct: true,
      offset: Number(offset),
      limit: Number(limit),
      order: [["price", orderDirection]], // 🔥 Always price
    });

    const data = products.rows.map((p) => {
      const featured = p.images.find((i) => i.is_featured);

      return {
        id: p.id,
        name: p[`name_${lang}`],
        price: p.price,
        before_price: p.before_price,
        badge: p.badge,
        star_rating: p.star_rating,
        stock: p.stock,
        featured_image: featured ? featured.image_url : null,
        category: p.category ? p.category[`name_${lang}`] : null,
        tags: p.tags.map((t) => t[`name_${lang}`]),
      };
    });

    res.json({
      totalItems: products.count,
      totalPages: Math.ceil(products.count / limit),
      currentPage: Number(page),
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// 3️⃣ PRODUCT DETAILS
// ========================================
exports.getProductDetails = async (req, res) => {
  try {
    const lang = req.query.lang === "ar" ? "ar" : "en";
    const userId = req.user?.id; // Get user ID if authenticated

    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: "category" },
        { model: Tag, as: "tags" },
        { model: ProductImage, as: "images" },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get user's rating if authenticated
    let userRating = null;
    if (userId) {
      const rating = await ProductRating.findOne({
        where: { user_id: userId, product_id: product.id },
      });
      userRating = rating ? rating.rating : null;
    }

    res.json({
      id: product.id,
      name: product[`name_${lang}`],
      details: product[`details_${lang}`],
      price: product.price,
      before_price: product.before_price,
      stock: product.stock,
      badge: product.badge,
      star_rating: product.star_rating,
      rating_count: product.rating_count,
      user_rating: userRating, // Add user's rating
      category: product.category ? product.category[`name_${lang}`] : null,
      tags: product.tags.map((t) => t[`name_${lang}`]),
      images: product.images,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// 4️⃣ EDIT PRODUCT (ADMIN)
// ========================================
exports.editProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: ["images"],
    });

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    const { price, before_price, badge, category_id, tags, featured_image_id } =
      req.body;

    await product.update({
      price,
      before_price,
      badge,
      category_id: category_id || null,
    });

    if (tags) {
      await product.setTags(tags);
    }

    if (featured_image_id) {
      await ProductImage.update(
        { is_featured: false },
        { where: { product_id: product.id } },
      );

      await ProductImage.update(
        { is_featured: true },
        { where: { id: featured_image_id } },
      );
    }

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        await ProductImage.create({
          image_url: file.path,
          product_id: product.id,
        });
      }
    }

    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// 5️⃣ DELETE PRODUCT (ADMIN)
// ========================================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: ["images"],
    });

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    for (const img of product.images) {
      if (fs.existsSync(img.image_url)) {
        fs.unlinkSync(img.image_url);
      }
    }

    await product.destroy();

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// 6️⃣ ADD / UPDATE STAR RATING
// ========================================
exports.addStarRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user.id;
    const productId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating 1-5 only" });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    let existing = await ProductRating.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (existing) {
      existing.rating = rating;
      await existing.save();
    } else {
      await ProductRating.create({
        user_id: userId,
        product_id: productId,
        rating,
      });
    }

    const ratings = await ProductRating.findAll({
      where: { product_id: productId },
    });

    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const avg = Math.round((total / ratings.length) * 10) / 10;

    product.star_rating = avg;
    product.rating_count = ratings.length;
    await product.save();

    res.json({
      star_rating: product.star_rating,
      rating_count: product.rating_count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// 7️⃣ DELETE PRODUCT IMAGE
// ========================================
exports.deleteProductImage = async (req, res) => {
  try {
    const image = await ProductImage.findByPk(req.params.imageId);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (fs.existsSync(image.image_url)) {
      fs.unlinkSync(image.image_url);
    }

    await image.destroy();

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
