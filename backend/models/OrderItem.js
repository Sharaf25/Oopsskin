module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      productId: { type: DataTypes.STRING, allowNull: false },
      product_name: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.FLOAT, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "order_items", timestamps: true }
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: "order_id" });
  };

  return OrderItem;
};
