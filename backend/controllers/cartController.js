const { Cart, CartItem } = require("../models");

// --- Add item to cart ---
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, product_name, price, quantity } = req.body;

    if (!productId || !product_name || !price) {
      return res.status(400).json({ message: "Invalid product data" });
    }

    // Get or create user's cart
    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) cart = await Cart.create({ user_id: userId });

    // Check if item already exists in cart
    let item = await CartItem.findOne({
      where: { cart_id: cart.id, productId },
    });

    if (item) {
      item.quantity += quantity || 1;
      await item.save();
    } else {
      await CartItem.create({
        cart_id: cart.id,
        productId,
        product_name,
        price,
        quantity: quantity || 1,
      });
    }

    res.json({ message: "Item added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Get cart items ---
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{ model: CartItem, as: "items" }], // use alias 'items'
    });

    if (!cart) return res.json({ items: [] });

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Update quantity ---
exports.updateQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1)
      return res.status(400).json({ message: "Quantity must be >= 1" });

    const item = await CartItem.findByPk(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await item.save();

    res.json({ message: "Quantity updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Remove item ---
exports.removeItem = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.destroy();
    res.json({ message: "Item removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
