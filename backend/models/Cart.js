module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "Cart",
    {},
    { tableName: "carts", timestamps: true },
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "CASCADE",
    });

    Cart.hasMany(models.CartItem, {
      foreignKey: "cart_id",
      as: "items",
      onDelete: "CASCADE",
    });
  };

  return Cart;
};
