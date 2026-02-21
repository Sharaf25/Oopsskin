module.exports = (sequelize, DataTypes) => {
  const ProductRating = sequelize.define("ProductRating", {
    rating: { type: DataTypes.FLOAT, allowNull: false },
  });

  ProductRating.associate = (models) => {
    ProductRating.belongsTo(models.User, { foreignKey: "user_id" });
    ProductRating.belongsTo(models.Product, { foreignKey: "product_id" });
  };

  return ProductRating;
};
