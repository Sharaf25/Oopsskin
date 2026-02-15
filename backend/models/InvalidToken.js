const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const InvalidToken = sequelize.define(
  "InvalidToken",
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "invalid_tokens",
    timestamps: true,
  }
);

module.exports = InvalidToken;
