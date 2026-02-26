const { Favorite, Product, ProductImage, Category, Tag, ProductRating } = require("../models");
const { Op } = require("sequelize");

// ========================================
// 1️⃣ ADD / REMOVE FAVORITE
// ========================================
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const existing = await Favorite.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (existing) {
      await existing.destroy();
      return res.json({ message: "Removed from favorites" });
    }

    await Favorite.create({
      user_id: userId,
      product_id: productId,
    });

    res.json({ message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// 2️⃣ GET USER FAVORITES
// ========================================
exports.getUserFavorites = async (req, res) => {
  try {
    const lang = req.query.lang === "ar" ? "ar" : "en";
    const userId = req.user.id;

    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          include: [
            { model: ProductImage, as: "images" },
            { model: Category, as: "category" },
            { model: Tag, as: "tags" },
          ],
        },
      ],
    });

    // Fetch user ratings for all favorited products in one query
    const productIds = favorites.map((fav) => fav.Product.id);
    let userRatingsMap = {};
    if (productIds.length > 0) {
      const userRatings = await ProductRating.findAll({
        where: { user_id: userId, product_id: { [Op.in]: productIds } },
      });
      userRatings.forEach((r) => {
        userRatingsMap[r.product_id] = r.rating;
      });
    }

    const data = favorites.map((fav) => {
      const p = fav.Product;
      const featured = p.images.find((i) => i.is_featured);

      return {
        id: p.id,
        name: p[`name_${lang}`],
        price: p.price,
        star_rating: p.star_rating,
        rating_count: p.rating_count,
        user_rating: userRatingsMap[p.id] || null,
        stock: p.stock,
        featured_image: featured ? featured.image_url : null,
        category: p.category ? p.category[`name_${lang}`] : null,
        tags: p.tags.map((t) => t[`name_${lang}`]),
      };
    });

    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};