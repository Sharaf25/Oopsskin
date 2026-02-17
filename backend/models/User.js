module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false, validate: { len: [10, 15] } },
      role: { type: DataTypes.ENUM("admin", "user"), allowNull: false, defaultValue: "user" },
      city: { type: DataTypes.STRING, allowNull: true },
      street: { type: DataTypes.STRING, allowNull: true },
    },
    { tableName: "users", timestamps: true }
  );

  User.associate = (models) => {
    // Associations are run after all models are loaded in models/index.js
    User.hasOne(models.Cart, { foreignKey: "user_id" });
    User.hasMany(models.Order, { foreignKey: "user_id" });
    User.hasMany(models.RefreshToken, { foreignKey: "userId" });
  };

  return User;
};
