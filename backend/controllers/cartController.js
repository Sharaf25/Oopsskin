const {
  Cart,
  CartItem,
  Product,
  ProductImage,
  Category,
  Tag,
  ProductRating,
} = require("../models");

// ========================================
// 1️⃣ ADD TO CART
// ========================================
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id)
      return res.status(400).json({ message: "product_id is required" });

    const product = await Product.findByPk(product_id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock < quantity)
      return res.status(400).json({ message: "Not enough stock" });

    let cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    let item = await CartItem.findOne({
      where: { cart_id: cart.id, product_id },
    });

    if (item) {
      if (product.stock < item.quantity + quantity) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      item.quantity += quantity;
      await item.save();
    } else {
      await CartItem.create({
        cart_id: cart.id,
        product_id,
        quantity,
      });
    }

    res.json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================================
// 2️⃣ GET CART
// ========================================
exports.getCart = async (req, res) => {
  try {
    const lang = req.query.lang === "ar" ? "ar" : "en";
    const userId = req.user.id;

    const productInclude = [
      { model: ProductImage, as: "images" },
      { model: Category, as: "category" },
      { model: Tag, as: "tags", through: { attributes: [] } },
      {
        model: ProductRating,
        as: "ratings",
        required: false,
        where: { user_id: userId },
        attributes: ["rating"],
      },
    ];

    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              include: productInclude,
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.json({ items: [], total: 0 });
    }

    let total = 0;

    const items = cart.items.map((item) => {
      const product = item.product;
      const featured =
        product.images?.find((i) => i.is_featured) || product.images?.[0];

      const userRatingValue =
        product.ratings && product.ratings.length > 0
          ? product.ratings[0].rating
          : null;

      const subtotal = product.price * item.quantity;
      total += subtotal;

      return {
        id: item.id,
        quantity: item.quantity,
        subtotal,
        product: {
          id: product.id,
          name: product[`name_${lang}`],
          price: product.price,
          before_price: product.before_price,
          badge: product.badge,
          star_rating: product.star_rating,
          rating_count: product.rating_count,
          user_rating: userRatingValue,
          stock: product.stock,
          featured_image: featured ? featured.image_url : null,
          category: product.category
            ? product.category[`name_${lang}`]
            : null,
          tags: product.tags
            ? product.tags.map((t) => t[`name_${lang}`])
            : [],
        },
      };
    });

    res.json({ items, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================================
// 3️⃣ UPDATE QUANTITY
// ========================================
exports.updateQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1)
      return res.status(400).json({ message: "Quantity must be >= 1" });

    const item = await CartItem.findByPk(itemId, {
      include: [
        {
          model: Cart,
          as: "cart",
        },
        {
          model: Product,
          as: "product",
        },
      ],
    });

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.cart.user_id !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (item.product.stock < quantity)
      return res.status(400).json({ message: "Not enough stock" });

    item.quantity = quantity;
    await item.save();

    res.json({ message: "Quantity updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================================
// 4️⃣ REMOVE ITEM
// ========================================
exports.removeItem = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.itemId, {
      include: [
        {
          model: Cart,
          as: "cart",
        },
      ],
    });

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.cart.user_id !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await item.destroy();

    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
