module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define("ProductImage", {
    image_url: { type: DataTypes.STRING, allowNull: false },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, { foreignKey: "product_id" });
  };

  return ProductImage;
};
