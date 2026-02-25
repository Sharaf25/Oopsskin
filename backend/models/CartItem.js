module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    "CartItem",
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "cart_items",
      timestamps: true,
    },
  );

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, {
      foreignKey: "cart_id",
      as: "cart",
    });

    CartItem.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
      onDelete: "CASCADE",
    });
  };

  return CartItem;
};
