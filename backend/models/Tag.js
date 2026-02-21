module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define("Tag", {
    name_en: { type: DataTypes.STRING, allowNull: false },
    name_ar: { type: DataTypes.STRING, allowNull: false },
  });

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Product, {
      through: "ProductTags",
      foreignKey: "tag_id",
    });
  };

  return Tag;
};
