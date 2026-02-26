module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define("Favorite", {});

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });

    Favorite.belongsTo(models.Product, {
      foreignKey: "product_id",
      onDelete: "CASCADE",
    });
  };

  return Favorite;
};