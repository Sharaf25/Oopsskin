module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      original_total: { type: DataTypes.FLOAT, allowNull: false },
      discount_amount: { type: DataTypes.FLOAT, defaultValue: 0 },
      total_amount: { type: DataTypes.FLOAT, allowNull: false },
      voucher_code: { type: DataTypes.STRING, allowNull: true },
      city: { type: DataTypes.STRING, allowNull: false },
      street: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: "orders", timestamps: true }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: "user_id" });
    Order.hasMany(models.OrderItem, { foreignKey: "order_id", onDelete: "CASCADE" });
  };

  return Order;
};
