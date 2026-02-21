module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name_en: { type: DataTypes.STRING, allowNull: false },
    name_ar: { type: DataTypes.STRING, allowNull: false },
    details_en: { type: DataTypes.TEXT, allowNull: false },
    details_ar: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    before_price: { type: DataTypes.FLOAT, allowNull: true },
    badge: { type: DataTypes.STRING, allowNull: true },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    star_rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    rating_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: { name: "category_id", allowNull: true },
      onDelete: "SET NULL",
      as: "category",
    });

    Product.belongsToMany(models.Tag, {
      through: "ProductTags",
      foreignKey: "product_id",
      as: "tags",
    });

    Product.hasMany(models.ProductImage, {
      foreignKey: "product_id",
      onDelete: "CASCADE",
      as: "images",
    });

    Product.hasMany(models.ProductRating, {
      foreignKey: "product_id",
      onDelete: "CASCADE",
      as: "ratings",
    });
  };

  return Product;
};
