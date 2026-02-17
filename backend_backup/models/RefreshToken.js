const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "refresh_tokens",
    timestamps: true,
  }
);

RefreshToken.belongsTo(User, { foreignKey: "userId" });

module.exports = RefreshToken;
