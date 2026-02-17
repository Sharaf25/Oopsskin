module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {}, { tableName: "carts", timestamps: true });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "user_id" });
    Cart.hasMany(models.CartItem, {
      foreignKey: "cart_id",
      as: "items", // give it an alias
      onDelete: "CASCADE",
    });
  };

  return Cart;
};
