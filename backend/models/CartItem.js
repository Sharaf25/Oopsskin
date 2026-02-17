module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    "CartItem",
    {
      productId: { type: DataTypes.STRING, allowNull: false },
      product_name: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.FLOAT, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      cart_id: { type: DataTypes.INTEGER, allowNull: false }, // link to Cart
    },
    { tableName: "cart_items", timestamps: true }
  );

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, { foreignKey: "cart_id", as: "cart" });
  };

  return CartItem;
};
