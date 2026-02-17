const { Cart, CartItem, Order, OrderItem, Voucher } = require("../models");

exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { city, street, phone, voucherCode } = req.body;

    if (!city || !street || !phone) {
      return res.status(400).json({ message: "City, street, phone required" });
    }

    // Fetch cart with correct alias
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [{ model: CartItem, as: "items" }], // <-- use alias
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate totals
    let originalTotal = 0;
    cart.items.forEach(i => {
      originalTotal += i.price * i.quantity;
    });

    let discountAmount = 0;
    let appliedVoucher = null;

    if (voucherCode) {
      const voucher = await Voucher.findOne({
        where: { code: voucherCode, is_active: true },
      });

      if (!voucher) return res.status(400).json({ message: "Invalid voucher" });
      if (voucher.expires_at && voucher.expires_at < new Date())
        return res.status(400).json({ message: "Voucher expired" });
      if (voucher.used_count >= voucher.max_usage)
        return res.status(400).json({ message: "Voucher limit reached" });

      discountAmount =
        voucher.type === "percentage"
          ? (originalTotal * voucher.value) / 100
          : voucher.value;

      if (discountAmount > originalTotal) discountAmount = originalTotal;

      voucher.used_count += 1;
      await voucher.save();
      appliedVoucher = voucher.code;
    }

    const finalTotal = originalTotal - discountAmount;

    // Create order
    const order = await Order.create({
      user_id: userId,
      original_total: originalTotal,
      discount_amount: discountAmount,
      total_amount: finalTotal,
      voucher_code: appliedVoucher,
      city,
      street,
      phone,
    });

    // Add items to order
    for (const item of cart.items) { // <-- use alias
      await OrderItem.create({
        order_id: order.id,
        productId: item.productId,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
      });
    }

    // Empty the cart
    await cart.destroy();

    res.json({ message: "Order placed", orderId: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
